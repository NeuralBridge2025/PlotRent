-- Get conversation list for a user: distinct partners with last message + unread count
create or replace function public.get_conversations(p_user_id uuid)
returns table (
  conversation_id text,
  other_user_id uuid,
  other_user_name text,
  other_user_avatar text,
  last_message text,
  last_message_at timestamptz,
  unread_count bigint
)
language sql
stable
security invoker
as $$
  with user_messages as (
    select
      m.*,
      case
        when m.sender_id = p_user_id then m.receiver_id
        else m.sender_id
      end as partner_id
    from public.messages m
    where m.sender_id = p_user_id or m.receiver_id = p_user_id
  ),
  ranked as (
    select
      um.*,
      row_number() over (partition by um.partner_id order by um.created_at desc) as rn
    from user_messages um
  )
  select
    r.partner_id::text as conversation_id,
    r.partner_id as other_user_id,
    p.full_name as other_user_name,
    p.avatar_url as other_user_avatar,
    r.text as last_message,
    r.created_at as last_message_at,
    (
      select count(*)
      from user_messages um2
      where um2.partner_id = r.partner_id
        and um2.receiver_id = p_user_id
        and um2.read = false
    ) as unread_count
  from ranked r
  join public.profiles p on p.id = r.partner_id
  where r.rn = 1
  order by r.created_at desc;
$$;
