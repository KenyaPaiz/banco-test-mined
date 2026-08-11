import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '25837', 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'require' ? { rejectUnauthorized: false } : false,
});

// Endpoint de verificación de salud y conexión
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      timestamp: result.rows[0].now,
      database: 'connected'
    });
  } catch (error) {
    console.error('Error de conexión a la BD:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al conectar con la base de datos',
      error: error.message
    });
  }
});

// Endpoint principal para obtener todos los recursos
app.get('/api/recursos', async (req, res) => {
  try {
    const queryText = `
      SELECT id, titulo, materia, grado, descripcion, enlace, autor, created_at 
      FROM recursos 
      ORDER BY id DESC;
    `;
    const { rows } = await pool.query(queryText);
    res.json({
      success: true,
      total: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener recursos:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudieron consultar los recursos',
      error: error.message
    });
  }
});

// Endpoint para crear un nuevo recurso
app.post('/api/recursos', async (req, res) => {
  try {
    const { titulo, materia, grado, descripcion, enlace, autor } = req.body;

    // Validación de campos obligatorios
    if (!titulo?.trim() || !materia?.trim() || !grado?.trim() || !autor?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Los campos Título, Materia, Grado y Autor son obligatorios.'
      });
    }

    // Validación básica de formato de URL para enlace si fue provisto
    if (enlace && enlace.trim() !== '') {
      try {
        new URL(enlace.trim());
      } catch (_) {
        return res.status(400).json({
          success: false,
          message: 'El enlace ingresado no es una URL válida (ej: https://ejemplo.com).'
        });
      }
    }

    const queryText = `
      INSERT INTO recursos (titulo, materia, grado, descripcion, enlace, autor)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, titulo, materia, grado, descripcion, enlace, autor, created_at;
    `;

    const values = [
      titulo.trim(),
      materia.trim(),
      grado.trim(),
      descripcion?.trim() || null,
      enlace?.trim() || null,
      autor.trim()
    ];

    const { rows } = await pool.query(queryText, values);

    res.status(201).json({
      success: true,
      message: 'Recurso creado exitosamente',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al insertar recurso:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al guardar el recurso',
      error: error.message
    });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
});
