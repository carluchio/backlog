-- Backlog: Tasks table and Row Level Security
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  deadline timestamptz,
  committed_to text,
  context_note text,
  status text default 'active' check (status in ('active', 'completed', 'deleted')),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.tasks enable row level security;

-- Policies: users can only access their own tasks
create policy "Users can view own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_tasks_user_status on public.tasks(user_id, status);
create index if not exists idx_tasks_deadline on public.tasks(deadline);
create index if not exists idx_tasks_created on public.tasks(created_at);

-- Enable realtime for the tasks table
alter publication supabase_realtime add table public.tasks;
