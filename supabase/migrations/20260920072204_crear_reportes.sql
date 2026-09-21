create table if not exists public.reportes (
    id uuid primary key default gen_random_uuid(),

    cliente_id text,
    cliente_nombre text not null,


    plantilla text not null default 'estado_mantenimiento_cubierta',
    titulo text not null,
    fecha date not null default current_date,

    diagnostico text,

    zonas jsonb not null default '[]'::jsonb,
    mantenimiento jsonb not null default '[]'::jsonb,
    limpieza jsonb not null default '{}'::jsonb,
    alertas jsonb not null default '[]'::jsonb,

    recomendacion_final text,

    seguimiento jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_reportes_cliente_id
    on public.reportes(cliente_id);

create index if not exists idx_reportes_fecha
    on public.reportes(fecha);

create index if not exists idx_reportes_plantilla
    on public.reportes(plantilla);
