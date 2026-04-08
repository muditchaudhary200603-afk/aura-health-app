create policy "public_insert_appointments"
on public.appointments
for insert
to anon, authenticated
with check (true);
