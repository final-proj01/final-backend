DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS userClips CASCADE;
DROP TABLE IF EXISTS usersComments CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS communityFeedTable CASCADE;
DROP TABLE IF EXISTS followers CASCADE;



 CREATE TABLE users (
    id bigint generated always as identity primary key,
    GamerTag varchar not null,
    email varchar not null,
    password_hash varchar not null,
    bio varchar not null,
    platforms varchar not null,
    avatar_png varchar not null,
    channelLinks varchar not null
 );

CREATE TABLE userClips (
    id bigint generated always as identity primary key,
    clipLink varchar not null,
    users_id bigint,
    foreign key (users_id) references users(id)
);

CREATE TABLE usersComments (
    id bigint generated always as identity,
    comment_id bigint not null,
    users_id bigint primary key,
    foreign key (users_id) references users(id)
);

CREATE TABLE comments (
    id bigint generated always as identity primary key,
    commenter_id bigint not null,
    clip_id bigint not null,
    comments varchar not null,
    foreign key (commenter_id) references usersComments(users_id),
    foreign key (clip_id) references userClips(id)
);

CREATE TABLE votes (
    id bigint generated always as identity,
    voteUp boolean,
    voteDown boolean,
    commenter_id bigint not null,
    foreign key (commenter_id) references users(id)
);

CREATE TABLE communityFeedTable (
    id bigint generated always as identity,
    clip_id bigint not null,
    users_id bigint not null,
    foreign key (clip_id) references userClips(id)
);

CREATE TABLE followers (
    id bigint generated always as identity,
    users_id bigint not null,
    follower_id bigint not null,
    followed boolean
);









