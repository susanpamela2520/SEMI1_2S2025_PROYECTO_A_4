const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Registro de usuario
app.post('/register', async (req, res) => {
  const { full_name, username, email, password, profile_photo_url, favorite_genres } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      `INSERT INTO users (full_name, username, email, password_hash, profile_photo_url, favorite_genres)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [full_name, username, email, hash, profile_photo_url, favorite_genres]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err) {
    res.status(400).json({ error: 'Usuario o correo ya existe' });
  }
});

// Inicio de sesión
app.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1 OR email = $1`,
    [identifier]
  );
  const user = result.rows[0];
  if (user && await bcrypt.compare(password, user.password_hash)) {
    res.json({ message: 'Login exitoso', userId: user.id });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

// Explorar películas
app.get('/movies', async (req, res) => {
  const { genre, year, title } = req.query;
  let query = `SELECT * FROM movies WHERE 1=1`;
  const params = [];
  if (genre) {
    params.push(genre);
    query += ` AND $${params.length} = ANY(genres)`;
  }
  if (year) {
    params.push(year);
    query += ` AND release_year = $${params.length}`;
  }
  if (title) {
    params.push(`%${title}%`);
    query += ` AND title ILIKE $${params.length}`;
  }
  const result = await pool.query(query, params);
  res.json(result.rows);
});

// Calificar y reseñar película
app.post('/reviews', async (req, res) => {
  const { user_id, movie_id, rating, review_text, emotional_tags, sentiment } = req.body;
  try {
    await pool.query(
      `INSERT INTO reviews (user_id, movie_id, rating, review_text, emotional_tags, sentiment)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, movie_id) DO UPDATE SET rating = $3, review_text = $4, emotional_tags = $5, sentiment = $6`,
      [user_id, movie_id, rating, review_text, emotional_tags, sentiment]
    );
    res.json({ message: 'Reseña guardada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar reseña' });
  }
});
