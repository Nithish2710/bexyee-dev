alter table public.admin_users add column if not exists must_change_password boolean not null default true;
alter table public.admin_users add column if not exists email_verified_at timestamptz;

create table public.admin_security_events (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  email text,
  event_type text not null check (event_type in ('FIRST_LOGIN', 'OTP_SENT', 'OTP_VERIFIED', 'PASSWORD_CHANGED', 'EMAIL_CHANGE_REQUESTED', 'PASSWORD_RESET_REQUESTED', 'LOGOUT')),
  created_at timestamptz not null default now()
);

alter table public.admin_security_events enable row level security;
create policy "admins can read security events" on public.admin_security_events for select using (public.is_admin());

create or replace function public.complete_admin_password_setup(requested_admin uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin(requested_admin) then raise exception 'ADMIN_REQUIRED'; end if;
  update public.admin_users set must_change_password = false, email_verified_at = coalesce(email_verified_at, now()) where user_id = requested_admin;
  insert into public.admin_security_events(admin_user_id, event_type) values (requested_admin, 'PASSWORD_CHANGED');
  insert into public.audit_logs(admin_user_id, action, entity, entity_id) values (requested_admin, 'PASSWORD_CHANGED', 'admin_users', requested_admin::text);
  return true;
end;
$$;
