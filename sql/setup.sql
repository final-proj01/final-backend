DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_clips CASCADE;
DROP TABLE IF EXISTS user_comments CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS community_feed CASCADE;
DROP TABLE IF EXISTS followers CASCADE;



 CREATE TABLE users (
    id bigint generated always as identity primary key,
    GamerTag varchar not null,
    email varchar not null,
    password_hash varchar not null,
    bio varchar,
    platforms varchar,
    avatar_png varchar,
    channelLinks varchar
 );

CREATE TABLE user_clips (
    id bigint generated always as identity primary key,
    clip_link varchar not null,
    users_id bigint,
    o_site varchar not null,
    created_at  timestamptz not null default now(),
    description varchar,
    title varchar not null,
    foreign key (users_id) references users(id)
);

CREATE TABLE user_comments (
    id bigint generated always as identity,
    comment varchar not null,
    users_id bigint primary key,
    foreign key (users_id) references users(id)
);

CREATE TABLE comments (
    id bigint generated always as identity primary key,
    commenter_id bigint not null,
    clip_id bigint not null,
    details varchar not null,
    created_at  timestamptz not null default now(),
    foreign key (commenter_id) references user_comments(users_id),
    foreign key (clip_id) references user_clips(id)
);

CREATE TABLE votes (
    id bigint generated always as identity,
    voteUp boolean,
    voteDown boolean,
    voter_id bigint not null,
    foreign key (voter_id) references users(id)
);

CREATE TABLE community_feed (
    id bigint generated always as identity,
    clip_id bigint not null,
    users_id bigint not null,
    foreign key (clip_id) references user_clips(id)
);

CREATE TABLE followers (
    id bigint generated always as identity,
    users_id bigint not null,
    follower_id bigint not null,
    followed boolean
);

insert into users (GamerTag, email, password_hash, bio, platforms, channelLinks) values
('CheatcodeChad', 'stablerpsn@gmail.com', '$2b$10$uJutybBq9l/Hwk81Ourcm.sRgBUqPOthHNek8cO7x2wWAf5Sjz9Ie', 
'Developer of Twitch Tok, absolute legend. can scramble under pressure so effectively I look like Neo from The Matrix',
'Playstation, PC', 'https://www.youtube.com/channel/UCyS4i5WTxl16KPJRNl3i0jg, https://www.twitch.tv/thegoodmansinner');


insert into user_clips (clip_link, users_id, o_site, title) values
('NKoVRXKv4rM', 1, 'youtube', 'Rocket League clip'),
('1puKDTa5kL8', 1, 'youtube', 'Tossing someone into the pool'),
('EDUQy8ZpaGU', 1, 'youtube', 'Oh wait does someone else wanna hold the bridge?'),
('y0WVN-d8l5c', 1, 'youtube', 'I`m blind'),
('M7xQ0QXotEg', 1, 'youtube', 'Double kill'),
('hu9y_EL5EJw', 1, 'youtube', 'Kali ace'),
('USMrVs-gYlA', 1, 'youtube', 'Wall bang headshot'),
('6R1rXlnTXjs', 1, 'youtube', 'Respect the square'),
('KfiZL8SSjf4', 1, 'youtube', 'I don`t even know'),
('zw_R_-WYDns', 1, 'youtube', 'Double no scope'),
('jZsJssw5zso', 1, 'youtube', 'Tappy tap');
