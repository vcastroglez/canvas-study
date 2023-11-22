create table if not exists users
(
    id         bigint unsigned auto_increment,
    username   varchar(255)                        not null,
    password   varchar(255)                        not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    constraint users_pk
        primary key (id)
);

create table if not exists sessions
(
    id         bigint unsigned auto_increment,
    id_user    bigint unsigned                     not null,
    uuid       varchar(255)                        not null,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    constraint sessions_pk
        primary key (id),
    constraint sessions_users_id_fk
        foreign key (id_user) references users (id)
);