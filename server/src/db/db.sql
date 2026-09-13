CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TYPE IF NOT EXISTS post_type AS ENUM('text', 'multimedia');
CREATE TYPE IF NOT EXISTS media_type AS ENUM('image', 'video');


CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT unique_username UNIQUE (username),
    CONSTRAINT unique_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type post_type NOT NULL DEFAULT 'text'::post_type,
    content TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS media (
    id BIGSERIAL PRIMARY KEY,
    post_id UUID NOT NULL,
    type media_type NOT NULL DEFAULT 'image'::media_type,
    url TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_post FOREIGN KEY (post_id)
        REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_posts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    post_id UUID NOT NULL,

    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_post FOREIGN KEY (post_id)
        REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT unique_saved_post UNIQUE (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS likes (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    post_id UUID NOT NULL,

    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_post FOREIGN KEY (post_id)
        REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT unique_like UNIQUE (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    post_id UUID NOT NULL,
    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_post FOREIGN KEY (post_id)
        REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comment_likes (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    comment_id BIGINT NOT NULL,

    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment FOREIGN KEY (comment_id)
        REFERENCES comments(id) ON DELETE CASCADE,
    CONSTRAINT unique_comment_like UNIQUE (user_id, comment_id)
);

CREATE TABLE IF NOT EXISTS follows (
    id BIGSERIAL PRIMARY KEY,
    follower_id UUID NOT NULL,
    following_id UUID NOT NULL,

    CONSTRAINT fk_follower FOREIGN KEY (follower_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_following FOREIGN KEY (following_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);