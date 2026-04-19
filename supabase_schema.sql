create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  number_label text not null,
  title text not null,
  description text not null,
  href text not null unique,
  tag text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  sku text unique,
  name text not null,
  category_label text not null,
  description text not null,
  price_cop numeric(12,0) not null default 0,
  image_src text not null,
  image_position text default 'center',
  badge text,
  badge_type text default '',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_phone text,
  customer_email text,
  notes text,
  total_cop numeric(12,0) not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price_cop numeric(12,0) not null default 0,
  quantity integer not null default 1 check (quantity > 0),
  subtotal_cop numeric(12,0) generated always as (unit_price_cop * quantity) stored
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

insert into public.categories (code, number_label, title, description, href, tag)
values
  ('cat-traumaticas', '01', 'Armas traumaticas', 'Pistolas, revolveres y accesorios con presencia visual fuerte.', 'traumaticas.html', 'Categoria TREX'),
  ('cat-aire', '02', 'Aire comprimido', 'Rifles, pistolas y municiones para tiro deportivo y practica.', 'aire-comprimido.html', 'Categoria TREX'),
  ('cat-airsoft', '03', 'Airsoft tactico', 'Replicas, BBs, chalecos, cascos y plataformas de juego.', 'airsoft.html', 'Categoria TREX'),
  ('cat-accesorios', '04', 'Accesorios', 'Miras, linternas, estuches, protectores y repuestos.', 'accesorios.html', 'Categoria TREX')
on conflict (code) do nothing;

insert into public.products (
  sku,
  category_id,
  name,
  category_label,
  description,
  price_cop,
  image_src,
  image_position,
  badge,
  badge_type,
  is_featured
)
values
  (
    'asg-cz-p09',
    (select id from public.categories where code = 'cat-aire'),
    'ASG CZ P-09',
    'Airsoft',
    'Pistola de perfil tactico con presentacion fuerte y fondo verde TREX.',
    890000,
    'ASGCZP-09.jpeg',
    'center 38%',
    'Nuevo',
    '',
    true
  ),
  (
    'asg-dan-wesson-6pl',
    (select id from public.categories where code = 'cat-traumaticas'),
    'ASG Dan Wesson 6PL Silver',
    'Traumatica',
    'Revolver de impacto visual premium con accesorios y acabado metalico.',
    1450000,
    'ASGDAN.jpeg',
    'center 36%',
    'Oferta',
    'offer',
    true
  ),
  (
    'walther-p38',
    (select id from public.categories where code = 'cat-airsoft'),
    'Walther P38',
    'Clasica',
    'Modelo iconico con empunadura en madera y perfil de coleccion.',
    1190000,
    'waltherp38.jpeg',
    'center 34%',
    'Top',
    '',
    true
  )
on conflict (sku) do nothing;
