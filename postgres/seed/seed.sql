BEGIN TRANSACTION;

-- User 'wes' with password 'wes'
INSERT into users (name, email, entries, joined) values ('wes', 'wes@gmail.com', '15', '2020-02-02');
INSERT into login (hash, email) values ('$2a$10$d649oACgoHFUDg2fnGqBzeiwnm6xfwfnembKEQlTydbK2ZlZUgWfm', 'wes@gmail.com')
;

COMMIT;