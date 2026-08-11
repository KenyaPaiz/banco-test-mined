import React from 'react';
import { ExternalLink, BookOpen, GraduationCap, User } from 'lucide-react';

export default function ResourceCard({ recurso }) {
  const { titulo, materia, grado, descripcion, enlace, autor, created_at } = recurso;

  // Obtener inicial del autor para avatar
  const authorInitial = autor ? autor.charAt(0).toUpperCase() : 'A';

  return (
    <article className="resource-card">
      <div>
        {/* Badges de Materia y Grado */}
        <div className="card-header-tags">
          {materia && (
            <span className="tag-materia" data-materia={materia}>
              <BookOpen size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              {materia}
            </span>
          )}
          {grado && (
            <span className="tag-grado">
              <GraduationCap size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              {grado}
            </span>
          )}
        </div>

        {/* Título (clickeable en pestaña nueva si existe enlace) */}
        <h2 className="card-title">
          {enlace ? (
            <a
              href={enlace}
              target="_blank"
              rel="noopener noreferrer"
              className="card-title-link"
              title={`Abrir ${titulo} en una nueva pestaña`}
            >
              <span>{titulo}</span>
              <ExternalLink size={18} className="external-icon" />
            </a>
          ) : (
            <span>{titulo}</span>
          )}
        </h2>

        {/* Descripción */}
        <p className="card-description">{descripcion}</p>
      </div>

      {/* Footer con Autor e Hipervínculo opcional */}
      <footer className="card-footer">
        <div className="author-info">
          <div className="author-avatar">{authorInitial}</div>
          <span>{autor || 'Docente / Instructor'}</span>
        </div>

        {enlace && (
          <a
            href={enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="action-link"
          >
            <span>Ver Recurso</span>
            <ExternalLink size={14} />
          </a>
        )}
      </footer>
    </article>
  );
}
