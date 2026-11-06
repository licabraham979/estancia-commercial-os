-- ==========================================
-- ESTANCIA TRADING
-- Registro de lotes, eventos y operaciones
-- ==========================================

-- 1. Lotes: cada mensaje completo recibido de TradingView
create table if not exists public.trading_lotes (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,

    source text not null default 'estancia_trading',
    schema_version integer not null default 1,
    script_version text,
    chart_timeframe text,
    bar_time_ms bigint,
    summary text,

    raw_payload jsonb not null,
    received_at timestamptz not null default now(),

    constraint trading_lotes_id_owner_unique unique (id, owner_id)
);

create index if not exists idx_trading_lotes_owner_received
    on public.trading_lotes(owner_id, received_at desc);


-- 2. Eventos individuales del indicador
create table if not exists public.trading_eventos (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,

    lote_id uuid,
    event_id text not null,

    category text not null
        check (category in ('CONTEXT', 'ENTRY')),

    market text not null,
    tv_symbol text not null,
    event_type text not null,
    side text,
    route text,
    timing text,

    event_price numeric(24,10),
    reference_price numeric(24,10),
    confirmation_price numeric(24,10),
    atr_ratio numeric(12,6),

    event_time_ms bigint,
    chart_timeframe text,

    raw_event jsonb not null,
    received_at timestamptz not null default now(),

    constraint trading_eventos_owner_event_unique
        unique (owner_id, event_id),

    constraint trading_eventos_id_owner_unique
        unique (id, owner_id),

    constraint trading_eventos_lote_owner_fk
        foreign key (lote_id, owner_id)
        references public.trading_lotes(id, owner_id)
        on delete cascade
);

create index if not exists idx_trading_eventos_owner_market_time
    on public.trading_eventos(owner_id, market, event_time_ms desc);

create index if not exists idx_trading_eventos_owner_category
    on public.trading_eventos(owner_id, category);

create index if not exists idx_trading_eventos_owner_type
    on public.trading_eventos(owner_id, event_type);

create index if not exists idx_trading_eventos_owner_lote
    on public.trading_eventos(owner_id, lote_id);


-- 3. Operaciones ejecutadas manualmente
create table if not exists public.trading_operaciones (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,

    evento_id uuid,

    market text not null,
    tv_symbol text,

    side text not null
        check (side in ('BUY', 'SELL')),

    status text not null default 'OPEN'
        check (status in ('OPEN', 'CLOSED', 'CANCELLED')),

    entry_price numeric(24,10) not null,
    stop_price numeric(24,10),
    target_price numeric(24,10),
    exit_price numeric(24,10),

    quantity numeric(24,10),
    risk_amount numeric(18,4),
    pnl_amount numeric(18,4),
    pnl_percent numeric(12,4),

    opened_at timestamptz not null default now(),
    closed_at timestamptz,

    notes text,
    created_at timestamptz not null default now(),

    constraint trading_operaciones_evento_owner_fk
        foreign key (evento_id, owner_id)
        references public.trading_eventos(id, owner_id)
);

create index if not exists idx_trading_operaciones_owner_market
    on public.trading_operaciones(owner_id, market);

create index if not exists idx_trading_operaciones_owner_status
    on public.trading_operaciones(owner_id, status);

create index if not exists idx_trading_operaciones_owner_opened
    on public.trading_operaciones(owner_id, opened_at desc);

create index if not exists idx_trading_operaciones_owner_evento
    on public.trading_operaciones(owner_id, evento_id);


-- 4. Seguridad RLS
alter table public.trading_lotes enable row level security;
alter table public.trading_eventos enable row level security;
alter table public.trading_operaciones enable row level security;

-- Lotes
drop policy if exists trading_lotes_select_own on public.trading_lotes;
create policy trading_lotes_select_own
    on public.trading_lotes for select to authenticated
    using (auth.uid() = owner_id);

drop policy if exists trading_lotes_insert_own on public.trading_lotes;
create policy trading_lotes_insert_own
    on public.trading_lotes for insert to authenticated
    with check (auth.uid() = owner_id);

drop policy if exists trading_lotes_update_own on public.trading_lotes;
create policy trading_lotes_update_own
    on public.trading_lotes for update to authenticated
    using (auth.uid() = owner_id)
    with check (auth.uid() = owner_id);

drop policy if exists trading_lotes_delete_own on public.trading_lotes;
create policy trading_lotes_delete_own
    on public.trading_lotes for delete to authenticated
    using (auth.uid() = owner_id);


-- Eventos
drop policy if exists trading_eventos_select_own on public.trading_eventos;
create policy trading_eventos_select_own
    on public.trading_eventos for select to authenticated
    using (auth.uid() = owner_id);

drop policy if exists trading_eventos_insert_own on public.trading_eventos;
create policy trading_eventos_insert_own
    on public.trading_eventos for insert to authenticated
    with check (auth.uid() = owner_id);

drop policy if exists trading_eventos_update_own on public.trading_eventos;
create policy trading_eventos_update_own
    on public.trading_eventos for update to authenticated
    using (auth.uid() = owner_id)
    with check (auth.uid() = owner_id);

drop policy if exists trading_eventos_delete_own on public.trading_eventos;
create policy trading_eventos_delete_own
    on public.trading_eventos for delete to authenticated
    using (auth.uid() = owner_id);


-- Operaciones
drop policy if exists trading_operaciones_select_own on public.trading_operaciones;
create policy trading_operaciones_select_own
    on public.trading_operaciones for select to authenticated
    using (auth.uid() = owner_id);

drop policy if exists trading_operaciones_insert_own on public.trading_operaciones;
create policy trading_operaciones_insert_own
    on public.trading_operaciones for insert to authenticated
    with check (auth.uid() = owner_id);

drop policy if exists trading_operaciones_update_own on public.trading_operaciones;
create policy trading_operaciones_update_own
    on public.trading_operaciones for update to authenticated
    using (auth.uid() = owner_id)
    with check (auth.uid() = owner_id);

drop policy if exists trading_operaciones_delete_own on public.trading_operaciones;
create policy trading_operaciones_delete_own
    on public.trading_operaciones for delete to authenticated
    using (auth.uid() = owner_id);


-- 5. Permisos
revoke all on public.trading_lotes from anon;
revoke all on public.trading_eventos from anon;
revoke all on public.trading_operaciones from anon;

grant select, insert, update, delete
    on public.trading_lotes,
       public.trading_eventos,
       public.trading_operaciones
    to authenticated;

grant all
    on public.trading_lotes,
       public.trading_eventos,
       public.trading_operaciones
    to service_role;
