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
  )`,
  `do $$ begin
    create type underemployment_cohort as enum ('recent_grads', 'all_grads');
  exception when duplicate_object then null;
  end $$`,
  `create table if not exists majors (
    id serial primary key,
    name text not null unique,
    category text,
    is_common_online boolean not null default false,
    cip_code_mapping jsonb not null default '[]'::jsonb
  )`,
  `create table if not exists underemployment_observations (
    id serial primary key,
    major_id integer references majors(id),
    cohort underemployment_cohort not null,
    date date not null,
    underemployment_rate numeric,
    unemployment_rate numeric,
    median_wage_college_job numeric,
    median_wage_non_college_job numeric,
    share_in_low_wage_jobs numeric,
    share_with_graduate_degree numeric,
    source_url text not null,
    created_at timestamp not null default now()
  )`,
  `create unique index if not exists major_cohort_date_unique
    on underemployment_observations (major_id, cohort, date)`,
  `create table if not exists involuntary_part_time (
    id serial primary key,
    date date not null unique,
    total_thousands numeric,
    source text not null default 'BLS CPS'
  )`,
  `create table if not exists hours_underemployment (
    id serial primary key,
    industry_name text not null,
    industry_code text,
    date date not null,
    average_weekly_hours numeric,
    year_ago_change numeric
  )`,
  `create unique index if not exists hours_underemployment_industry_date_unique
    on hours_underemployment (industry_name, date)`,
  `create table if not exists underemployment_trajectory (
    id serial primary key,
    age_group text not null,
    date date not null,
    underemployment_rate numeric,
    source text not null
  )`,
  `create unique index if not exists underemployment_trajectory_age_date_unique
    on underemployment_trajectory (age_group, date)`
] as const;

export const LABOR_PULSE_SCHEMA_SQL = LABOR_PULSE_SCHEMA_STATEMENTS.join(";\n");
