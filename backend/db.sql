CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  profile_photo_url TEXT,
  favorite_genres TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  release_year INT,
  genres TEXT[],
  cover_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  movie_id INT REFERENCES movies(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  sentiment TEXT,
  emotional_tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, movie_id)
);

CREATE TABLE favorites (
  user_id INT REFERENCES users(id),
  movie_id INT REFERENCES movies(id),
  PRIMARY KEY(user_id, movie_id)
);

CREATE TABLE watched (
  user_id INT REFERENCES users(id),
  movie_id INT REFERENCES movies(id),
  watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id, movie_id)
);

CREATE TABLE lists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  creator_id INT REFERENCES users(id),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE list_movies (
  list_id INT REFERENCES lists(id),
  movie_id INT REFERENCES movies(id),
  added_by INT REFERENCES users(id),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(list_id, movie_id)
);

CREATE TABLE list_collaborators (
  list_id INT REFERENCES lists(id),
  user_id INT REFERENCES users(id),
  role VARCHAR(20) CHECK (role IN ('creator', 'collaborator')),
  PRIMARY KEY(list_id, user_id)
);
