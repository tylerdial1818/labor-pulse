export const LABOR_PULSE_SCHEMA_STATEMENTS = [
  `do $$ begin
    create type series_category as enum ('lagging', 'leading', 'tech_impact');
  exception when duplicate_object then null;
  end $$`,
  `do $$ begin
    create type frequency as enum ('weekly', 'monthly', 'quarterly', 'ad_hoc');
  exception when duplicate_object then null;
  end $$`,
  `do $$ begin
    create type refresh_status as enum ('success', 'partial', 'failed');
  exception when duplicate_object then null;
  end $$`,
  `do $$ begin
    create type insight_category as enum (
      'official_data',
      'central_bank',
      'hiring_lab',
      'research',
      'manual',
      'employment_situation',
      'jolts',
      'beige_book',
      'hiring_practices',
      'skills_demand',
      'ai_impact',
      'other'
    );
  exception when duplicate_object then null;
  end $$`,
  `create table if not exists series (
    id text primary key,
    title text not null,
    short_title text not null,
    category series_category not null,
    source text not null,
    source_url text not null,
    units text not null,
    unit_label text not null default '',
    frequency frequency not null,
    seasonal_adjustment text,
    is_proxy boolean not null default false,
    methodology_note text,
    state_series_pattern text,
    last_refreshed_at timestamp
  )`,
  `alter table series add column if not exists unit_label text not null default ''`,
  `alter table series add column if not exists state_series_pattern text`,
  `create table if not exists observations (
    id serial primary key,
    series_id text not null references series(id),
    geography text not null default 'US',
    date date not null,
    value numeric,
    created_at timestamp not null default now(),
    unique (series_id, geography, date)
  )`,
  `create table if not exists definitions (
    series_id text primary key references series(id),
    content text not null,
    model text not null,
    generated_at timestamp not null default now()
  )`,
  `create table if not exists refresh_log (
    id serial primary key,
    source text not null,
    series_id text references series(id),
    status refresh_status not null,
    message text,
    started_at timestamp not null,
    completed_at timestamp
  )`,
  `create table if not exists composites (
    id text primary key,
    name text not null,
    description text not null,
    category text not null,
    input_series jsonb not null,
    methodology_note text not null,
    threshold_interpretation jsonb not null default '[]'::jsonb
  )`,
  `create table if not exists composite_observations (
    id serial primary key,
    composite_id text not null references composites(id),
    geography text not null default 'US',
    date date not null,
    value numeric not null,
    created_at timestamp not null default now(),
    unique (composite_id, geography, date)
  )`,
  `create table if not exists insights (
    id text primary key,
    source_id text not null,
    source_name text not null,
    category insight_category not null,
    title text not null,
    source_url text not null,
    published_at timestamp,
    updated_at timestamp not null,
    tags jsonb not null default '[]'::jsonb,
    summary text not null,
    key_takeaways jsonb not null default '[]'::jsonb,
    source_type text not null,
    raw_content text,
    summary_model text
  )`,
  `create table if not exists briefings (
    id serial primary key,
    theme text not null,
    selected_series_ids jsonb not null,
    selected_composite_ids jsonb not null default '[]'::jsonb,
    selected_insight_ids jsonb not null default '[]'::jsonb,
    geography text not null default 'US',
    content text not null,
    model text not null,
    created_at timestamp not null default now()
  )`,
  `create table if not exists ai_exposure_scores (
    occupation_soc_code text primary key,
    occupation_title text not null,
    exposure_score numeric not null,
    exposure_category text not null,
    source_name text not null default 'Eloundou et al. 2023',
    source_url text not null default 'https://arxiv.org/abs/2303.10130',
    methodology_note text not null
  )`
] as const;

export const LABOR_PULSE_SCHEMA_SQL = LABOR_PULSE_SCHEMA_STATEMENTS.join(";\n");
