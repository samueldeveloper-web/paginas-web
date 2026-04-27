create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  number_label text not null,
  title text not null,
  description text not null,
  href text not null unique,
  tag text,
  is_published boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  category_label text not null,
  name text not null,
  description text not null,
  price_cop numeric(12,0) not null default 0,
  image_src text not null,
  image_position text not null default 'center',
  badge text,
  badge_type text not null default '',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() is not null and auth.uid() = id);

drop policy if exists "profiles_admin_select_all" on public.profiles;
create policy "profiles_admin_select_all"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
on public.categories
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "categories_admin_manage" on public.categories;
create policy "categories_admin_manage"
on public.categories
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
on public.products
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "products_admin_manage" on public.products;
create policy "products_admin_manage"
on public.products
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

insert into public.categories (number_label, title, description, href, tag, is_published)
values
  ('01', 'Armas traumaticas', 'Pistolas, revolveres y accesorios con presencia visual fuerte.', 'traumaticas.html', 'Categoria TREX', true),
  ('02', 'Aire comprimido', 'Rifles, pistolas y municiones para tiro deportivo y practica.', 'aire-comprimido.html', 'Categoria TREX', true),
  ('03', 'Airsoft tactico', 'Replicas, BBs, chalecos, cascos y plataformas de juego.', 'airsoft.html', 'Categoria TREX', true),
  ('04', 'Accesorios', 'Miras, linternas, estuches, protectores y repuestos.', 'accesorios.html', 'Categoria TREX', true)
on conflict (href) do nothing;

insert into public.products (
  category_id,
  category_label,
  name,
  description,
  price_cop,
  image_src,
  image_position,
  badge,
  badge_type,
  is_featured,
  is_published
)
values
  (
    (select id from public.categories where href = 'aire-comprimido.html'),
    'Airsoft',
    'ASG CZ P-09',
    'Pistola de perfil tactico con presentacion fuerte y fondo verde TREX.',
    890000,
    'ASGCZP-09.jpeg',
    'center 38%',
    'Nuevo',
    '',
    true,
    true
  ),
  (
    (select id from public.categories where href = 'traumaticas.html'),
    'Traumatica',
    'ASG Dan Wesson 6PL Silver',
    'Revolver de impacto visual premium con accesorios y acabado metalico.',
    1450000,
    'ASGDAN.jpeg',
    'center 36%',
    'Oferta',
    'offer',
    true,
    true
  ),
  (
    (select id from public.categories where href = 'airsoft.html'),
    'Clasica',
    'Walther P38',
    'Modelo iconico con empunadura en madera y perfil de coleccion.',
    1190000,
    'waltherp38.jpeg',
    'center 34%',
    'Top',
    '',
    true,
    true
  )
on conflict do nothing;
