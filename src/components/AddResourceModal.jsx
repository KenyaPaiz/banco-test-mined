import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, Link as LinkIcon, BookOpen, GraduationCap, User, FileText } from 'lucide-react';

export default function AddResourceModal({ isOpen, onClose, onResourceAdded }) {
  const [formData, setFormData] = useState({
    titulo: '',
    materia: '',
    grado: '',
    descripcion: '',
    enlace: '',
    autor: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio.';
    }
    if (!formData.materia.trim()) {
      newErrors.materia = 'La materia es obligatoria.';
    }
    if (!formData.grado.trim()) {
      newErrors.grado = 'El grado/nivel es obligatorio.';
    }
    if (!formData.autor.trim()) {
      newErrors.autor = 'El nombre del autor es obligatorio.';
    }

    if (formData.enlace.trim()) {
      try {
        new URL(formData.enlace.trim());
      } catch (_) {
        newErrors.enlace = 'Ingresá una URL válida (ej: https://ejemplo.com).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setServerError('');

    try {
      const response = await fetch('/api/recursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const responseText = await response.text();
      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseErr) {
        throw new Error('El servidor backend no está respondiendo. Por favor reiniciá el comando "npm run dev" en tu terminal para iniciar el backend.');
      }

      if (response.ok && data.success) {
        // Notificar al componente padre el nuevo recurso creado
        onResourceAdded(data.data);
        
        // Resetear formulario y cerrar modal
        setFormData({
          titulo: '',
          materia: '',
          grado: '',
          descripcion: '',
          enlace: '',
          autor: ''
        });
        onClose();
      } else {
        throw new Error(data.message || `Error (${response.status}): No se pudo guardar el recurso.`);
      }
    } catch (err) {
      console.error('Error enviando el formulario:', err);
      setServerError(err.message || 'Error de conexión con el servidor.');
    } finally {
      setSubmitting(false);
    }

  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header del Modal */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <PlusCircle size={20} />
            </div>
            <h2>Agregar Nuevo Recurso</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        {/* Banner de error del servidor */}
        {serverError && (
          <div className="form-error-banner">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="resource-form" noValidate>
          <div className="form-grid">
            {/* Título (Obligatorio) */}
            <div className="form-group full-width">
              <label htmlFor="titulo">
                Título del Recurso <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                className={`form-input ${errors.titulo ? 'input-error' : ''}`}
                placeholder="Ej: Guía completa de HTML5 y accesibilidad web"
                value={formData.titulo}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.titulo && <span className="field-error-msg">{errors.titulo}</span>}
            </div>

            {/* Materia (Obligatorio) */}
            <div className="form-group">
              <label htmlFor="materia">
                <BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Materia <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="materia"
                name="materia"
                className={`form-input ${errors.materia ? 'input-error' : ''}`}
                placeholder="Ej: Desarrollo Web, Frontend, Matemáticas"
                value={formData.materia}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.materia && <span className="field-error-msg">{errors.materia}</span>}
            </div>

            {/* Grado (Obligatorio) */}
            <div className="form-group">
              <label htmlFor="grado">
                <GraduationCap size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Grado / Nivel <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="grado"
                name="grado"
                className={`form-input ${errors.grado ? 'input-error' : ''}`}
                placeholder="Ej: Nivel Básico, 9no Grado, Avanzado"
                value={formData.grado}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.grado && <span className="field-error-msg">{errors.grado}</span>}
            </div>

            {/* Autor (Obligatorio) */}
            <div className="form-group full-width">
              <label htmlFor="autor">
                <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Autor <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="autor"
                name="autor"
                className={`form-input ${errors.autor ? 'input-error' : ''}`}
                placeholder="Ingresá tu nombre y apellido"
                value={formData.autor}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.autor && <span className="field-error-msg">{errors.autor}</span>}
            </div>

            {/* Enlace (Opcional - URL) */}
            <div className="form-group full-width">
              <label htmlFor="enlace">
                <LinkIcon size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Enlace / URL del Recurso <span className="optional-tag">(Opcional)</span>
              </label>
              <input
                type="url"
                id="enlace"
                name="enlace"
                className={`form-input ${errors.enlace ? 'input-error' : ''}`}
                placeholder="https://ejemplo.com/recurso.pdf"
                value={formData.enlace}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.enlace && <span className="field-error-msg">{errors.enlace}</span>}
            </div>

            {/* Descripción (Opcional - Texto Largo) */}
            <div className="form-group full-width">
              <label htmlFor="descripcion">
                <FileText size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Descripción <span className="optional-tag">(Opcional)</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="3"
                className="form-textarea"
                placeholder="Escribí una breve descripción de los contenidos del recurso..."
                value={formData.descripcion}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Footer de Acciones del Formulario */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar Recurso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
