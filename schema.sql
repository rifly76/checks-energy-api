create table if not exists agencies (
  id bigserial primary key,
  name text not null,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists operators (
  id bigserial primary key,
  agency_id bigint not null references agencies(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  status text not null default 'active',
  credits_balance integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists activities (
  id bigserial primary key,
  agency_id bigint not null references agencies(id) on delete cascade,
  operator_id bigint references operators(id) on delete set null,
  public_code text not null unique,
  customer_reference_name text not null,
  site_city text,
  status text not null,
  outcome text,
  activity_at timestamptz not null default now(),
  report_available boolean not null default false
);
