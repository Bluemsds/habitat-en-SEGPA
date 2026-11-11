-- L'habitat en SEGPA : comptes profs, documents réservés, statistiques.
-- À coller UNE fois dans Supabase : SQL Editor > New query > Run.
-- Avant de lancer : remplacer ADRESSE_ADMIN (ligne « insert into public.admins ») par l'adresse de David.

-- 1. Administrateurs : seules ces adresses voient la page de statistiques. Table fermée (aucune règle de lecture).
create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;
insert into public.admins values (lower('ADRESSE_ADMIN')) on conflict do nothing;

-- 2. Profils : une ligne par prof inscrit
create table if not exists public.profils (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  recontact boolean not null default false,   -- case « J'accepte d'être recontacté », décochée par défaut
  cree_le timestamptz not null default now()
);
alter table public.profils enable row level security;
create policy "lire son profil" on public.profils for select to authenticated using (auth.uid() = id);
create policy "changer son consentement" on public.profils for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- 3. Seules les adresses académiques (@ac-….fr) peuvent créer un compte. Contrôle fait par la base : impossible à contourner depuis le site.
create or replace function public.verifier_adresse() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(new.email) !~ '@ac-[a-z0-9-]+\.fr$' and not exists (select 1 from public.admins where email = lower(new.email)) then
    raise exception 'Adresse académique obligatoire (@ac-….fr)';
  end if;
  return new;
end $$;
drop trigger if exists verifier_adresse on auth.users;
create trigger verifier_adresse before insert on auth.users for each row execute function public.verifier_adresse();

create or replace function public.creer_profil() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profils (id, email, recontact)
  values (new.id, lower(new.email), coalesce((new.raw_user_meta_data ->> 'recontact')::boolean, false));
  return new;
end $$;
drop trigger if exists creer_profil on auth.users;
create trigger creer_profil after insert on auth.users for each row execute function public.creer_profil();

-- 4. Téléchargements : le site note chaque document réservé téléchargé (qui, quoi, quand)
create table if not exists public.telechargements (
  id bigserial primary key,
  doc text not null,
  user_id uuid default auth.uid() references auth.users on delete set null,
  le timestamptz not null default now()
);
alter table public.telechargements enable row level security;
create policy "noter ses téléchargements" on public.telechargements for insert to authenticated with check (user_id = auth.uid());

-- 5. Supprimer son compte (droit à l'effacement), depuis la page Mon compte
create or replace function public.supprimer_mon_compte() returns void language sql security definer set search_path = public as $$
  delete from auth.users where id = auth.uid();
$$;
revoke execute on function public.supprimer_mon_compte() from anon, public;
grant execute on function public.supprimer_mon_compte() to authenticated;

-- 6. Statistiques : réservées aux adresses de la table admins
create or replace function public.stats() returns json language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.admins where email = lower(auth.jwt() ->> 'email')) then
    raise exception 'Réservé à l''administrateur';
  end if;
  return json_build_object(
    'inscrits',        (select count(*) from public.profils),
    'inscrits_30j',    (select count(*) from public.profils where cree_le > now() - interval '30 days'),
    'recontact',       (select count(*) from public.profils where recontact),
    'telechargements', (select count(*) from public.telechargements),
    'par_doc',  (select coalesce(json_agg(x), '[]') from (select doc, count(*) as n from public.telechargements group by doc order by n desc) x),
    'par_acad', (select coalesce(json_agg(a), '[]') from (select substring(email from '@ac-([a-z0-9-]+)\.fr$') as acad, count(*) as n from public.profils group by 1 order by n desc) a),
    'profils',  (select coalesce(json_agg(p), '[]') from (select email, recontact, cree_le from public.profils order by cree_le desc) p)
  );
end $$;
revoke execute on function public.stats() from anon, public;
grant execute on function public.stats() to authenticated;

-- 7. La pièce fermée à clé : un espace de stockage privé « prof », lisible seulement par les profs connectés
insert into storage.buckets (id, name, public) values ('prof', 'prof', false) on conflict (id) do nothing;
create policy "profs connectés lisent les documents prof" on storage.objects for select to authenticated using (bucket_id = 'prof');
