-- Mise à jour du 12/11/2026 : les comptes administrateur ne sont plus comptés dans les statistiques
-- (inscriptions, téléchargements, académies, liste des inscrits). À coller dans Supabase > SQL Editor > New query, puis Run.
-- Sans danger : remplace seulement la fonction stats(), aucune donnée n'est supprimée.

create or replace function public.stats() returns json language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.admins where email = lower(auth.jwt() ->> 'email')) then
    raise exception 'Réservé à l''administrateur';
  end if;
  return json_build_object(
    'inscrits',        (select count(*) from public.profils p where not exists (select 1 from public.admins a where a.email = p.email)),
    'inscrits_30j',    (select count(*) from public.profils p where cree_le > now() - interval '30 days' and not exists (select 1 from public.admins a where a.email = p.email)),
    'recontact',       (select count(*) from public.profils p where recontact and not exists (select 1 from public.admins a where a.email = p.email)),
    'telechargements', (select count(*) from public.telechargements t where not exists (select 1 from public.profils p join public.admins a on a.email = p.email where p.id = t.user_id)),
    'par_doc',  (select coalesce(json_agg(x), '[]') from (select doc, count(*) as n from public.telechargements t where not exists (select 1 from public.profils p join public.admins a on a.email = p.email where p.id = t.user_id) group by doc order by n desc) x),
    'par_acad', (select coalesce(json_agg(a), '[]') from (select substring(email from '@ac-([a-z0-9-]+)\.fr$') as acad, count(*) as n from public.profils p where not exists (select 1 from public.admins a where a.email = p.email) group by 1 order by n desc) a),
    'profils',  (select coalesce(json_agg(p), '[]') from (select email, recontact, cree_le from public.profils p where not exists (select 1 from public.admins a where a.email = p.email) order by cree_le desc) p)
  );
end $$;
revoke execute on function public.stats() from anon, public;
grant execute on function public.stats() to authenticated;
