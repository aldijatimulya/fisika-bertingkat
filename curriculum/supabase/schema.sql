-- Skema Supabase/PostgreSQL untuk Master Physics Curriculum & Knowledge Framework
-- Urutan: schema.sql -> seed_1_kurikulum.sql -> seed_2_pendukung.sql -> seed_3_persamaan.sql (dihasilkan tools/build.py)
-- Konten kurikulum = baca-publik; data pengguna = hanya pemilik (RLS).

create type edge_type as enum ('prerequisite','derived_from','special_case_of','approximation_of','generalized_by','motivated_by');
create type equation_kind as enum ('definisi','turunan','hukum','postulat','aproksimasi','model');
create type mastery_status as enum ('belum','sebagian','kuasai');

-- ===== 1. Master Curriculum =====
create table levels (
  level int primary key check (level between 0 and 5),
  name text not null
);
create table areas (
  area_key text primary key,
  level int not null references levels(level),
  name text not null,
  proposed boolean not null default false   -- true = tambahan Claude di luar Jalan Program awal
);
create table concepts (
  id text primary key,                       -- mis. 'k.percepatan'
  level int not null references levels(level),
  area_key text not null references areas(area_key),
  title text not null,
  graph_depth int not null default 0,        -- kedalaman terjauh dari akar prasyarat
  status text not null default 'rencana' check (status in ('rencana','draf','ditinjau','terbit')),
  created_at timestamptz not null default now()
);
create index on concepts(level, area_key);

-- ===== 2. Learning Dependency Framework =====
-- Arah: source_id -> target_id. prerequisite: source harus dipahami sebelum target.
-- derived_from: target diturunkan dari source. "Applied in" = relasi keluar dari source.
create table concept_edges (
  source_id text not null references concepts(id) on delete cascade,
  target_id text not null references concepts(id) on delete cascade,
  edge_type edge_type not null,
  note text not null default '',
  primary key (source_id, target_id, edge_type),
  check (source_id <> target_id)
);
create index on concept_edges(target_id, edge_type);
create index on concept_edges(source_id, edge_type);

-- ===== 3. Equation Derivation Database =====
create table equations (
  id text primary key,
  concept_id text not null references concepts(id),
  title text not null,
  latex text not null,
  kind equation_kind not null,
  assumptions jsonb not null default '[]',
  validity text not null check (length(validity) > 0),   -- batas keberlakuan wajib
  meaning text not null default ''
);
create table equation_steps (
  equation_id text not null references equations(id) on delete cascade,
  step_no int not null,
  latex text not null,
  reason text not null check (length(reason) > 0),       -- tiap langkah wajib beralasan
  primary key (equation_id, step_no)
);
create table equation_deps (                              -- Equation Lineage
  equation_id text not null references equations(id) on delete cascade,
  depends_on_id text not null references equations(id),
  primary key (equation_id, depends_on_id),
  check (equation_id <> depends_on_id)
);
create table equation_applied_in (
  equation_id text not null references equations(id) on delete cascade,
  concept_id text not null references concepts(id),
  primary key (equation_id, concept_id)
);

-- ===== 4. Mathematical Foundation Mapping =====
create table math_requirements (
  area_key text not null references areas(area_key),
  math_concept_id text not null references concepts(id),
  relation text not null check (relation in ('langsung','tidak_langsung')),
  needed_by text not null default '',
  primary key (area_key, math_concept_id)
);

-- ===== 5. Reference & Bibliography =====
create table books (
  code text primary key,
  title text not null, authors text not null, edition text not null,
  layer text not null check (layer in ('utama','pendalaman','matematis','lanjutan','pengayaan')),
  license text not null
);
create table area_references (
  id bigint generated always as identity primary key,
  area_key text not null references areas(area_key),
  book_code text not null references books(code),
  chapters text not null,
  chapters_verified boolean not null default false       -- verifikasi bab terhadap edisi yang dimiliki
);

-- ===== 6. Learning Outcome Framework =====
create table learning_outcomes (
  id bigint generated always as identity primary key,
  area_key text not null references areas(area_key),
  bloom text not null check (bloom in ('C1','C2','C3','C4','C5','C6')),
  outcome text not null,
  mastery_indicator text not null
);

-- ===== 7. Data pengguna (untuk Adaptive Learning Path - tahap berikutnya) =====
create table user_mastery (
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null references concepts(id),
  status mastery_status not null default 'belum',
  score numeric(4,3) check (score between 0 and 1),
  updated_at timestamptz not null default now(),
  primary key (user_id, concept_id)
);
create table attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_id text not null references concepts(id),
  kind text not null check (kind in ('diagnostik','latihan','kuis_konsep','ujian')),
  correct boolean not null,
  misconception_tag text,
  created_at timestamptz not null default now()
);
create index on attempts(user_id, concept_id);

-- ===== RLS =====
alter table levels enable row level security;            alter table areas enable row level security;
alter table concepts enable row level security;          alter table concept_edges enable row level security;
alter table equations enable row level security;         alter table equation_steps enable row level security;
alter table equation_deps enable row level security;     alter table equation_applied_in enable row level security;
alter table math_requirements enable row level security; alter table books enable row level security;
alter table area_references enable row level security;   alter table learning_outcomes enable row level security;
alter table user_mastery enable row level security;      alter table attempts enable row level security;

do $$
declare t text;
begin
  foreach t in array array['levels','areas','concepts','concept_edges','equations','equation_steps','equation_deps',
                           'equation_applied_in','math_requirements','books','area_references','learning_outcomes']
  loop
    execute format('create policy "baca publik" on %I for select using (true)', t);
  end loop;
end $$;
create policy "mastery milik sendiri" on user_mastery for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "attempts milik sendiri" on attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===== Fungsi graf =====
-- Seluruh prasyarat (transitif) sebuah konsep, diurutkan dari paling dasar -> "Telusuri ke belakang"
create or replace function prerequisite_chain(p_concept text)
returns table(concept_id text, title text, level int, depth int) language sql stable as $$
  with recursive r(id, d) as (
    select source_id, 1 from concept_edges where target_id = p_concept and edge_type = 'prerequisite'
    union
    select e.source_id, r.d + 1 from concept_edges e join r on e.target_id = r.id where e.edge_type = 'prerequisite'
  )
  select c.id, c.title, c.level, max(r.d)::int from r join concepts c on c.id = r.id
  group by c.id, c.title, c.level order by max(r.d) desc, c.level, c.id;
$$;

-- Konsep yang membutuhkan konsep ini -> "Lihat ke depan" (Applied in)
create or replace function applied_in(p_concept text)
returns table(concept_id text, title text, edge_type edge_type) language sql stable as $$
  select c.id, c.title, e.edge_type from concept_edges e join concepts c on c.id = e.target_id
  where e.source_id = p_concept order by e.edge_type, c.level, c.id;
$$;
