CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('testAuthor', 'testUrl', 'testTitle');
insert into blogs (author, url, title) values ('testAuthor2', 'testUrl2', 'testTitle2');



CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username string NOT NULL,
    name string NOT NULL
);