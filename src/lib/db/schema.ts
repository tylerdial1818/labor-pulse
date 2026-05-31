export const LABOR_PULSE_SCHEMA_SQL = `
create type if not exists series_category as enum ('lagging', 'leading', 'tech_impact');
create type if not exists frequency as enum ('weekly', 'monthly', 'quarterly', 'ad_hoc');
create type if not exists refresh_status as enum ('success', 'partial', 'failed');

create table if not exists series (
  id text primary key,
  title text not null,
  short_title text not null,
  category series_category not null,
  source text not null,
  source_url text not null,
  units text not null,
  frequency frequency not null,
  seasonal_adjustment text,
  is_proxy boolean not null default false,
  methodology_note text,
  last_refreshed_at timestamp
);

create table if not exists observations (
  id serial primary key,
  series_id text not null references series(id),
  geography text not null default 'US',
  date date not null,
  value numeric,
  created_at timestamp not null default now(),
  unique (series_id, geography, date)
);

create table if not exists definitions (
  series_id text primary key references series(id),
  content text not null,
  model text not null,
  generated_at timestamp not null default now()
);

create table if not exists refresh_log (
  id serial primary key,
  source text not null,
  series_id text references series(id),
  status refresh_status not null,
  message text,
  started_at timestamp not null,
  completed_at timestamp
);
`;
