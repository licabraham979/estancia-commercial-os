-- Evita insertar dos veces el mismo snapshot MT5.
-- Los registros existentes y TradingView pueden conservar source_key = NULL.

alter table public.trading_lotes
    add column if not exists source_key text;

create unique index if not exists
    idx_trading_lotes_owner_source_key
on public.trading_lotes(owner_id, source, source_key);
