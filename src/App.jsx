import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RotateCcw, 
  AlertCircle, 
  BookOpen, 
  Layers, 
  Award,
  Sparkles,
  Database,
  PlusCircle
} from 'lucide-react';
import ResourceCard from './components/ResourceCard';
import AddResourceModal from './components/AddResourceModal';

export default function App() {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [selectedGrado, setSelectedGrado] = useState('');

  // Estado del modal para agregar recurso
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Cargar recursos desde el backend Express
  const fetchRecursos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/recursos');
      const responseText = await response.text();
      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseErr) {
        throw new Error('El servidor backend en el puerto 5000 no está respondiendo. Por favor reiniciá el comando "npm run dev".');
      }

      if (response.ok && data.success) {
        setRecursos(data.data || []);
      } else {
        throw new Error(data.message || 'Error al obtener los recursos');
      }
    } catch (err) {
      console.error('Error fetching recursos:', err);
      setError(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRecursos();
  }, []);

  // Agregar recurso recién insertado al estado sin recargar la página
  const handleResourceAdded = (nuevoRecurso) => {
    setRecursos((prevRecursos) => [nuevoRecurso, ...prevRecursos]);
    setToastMessage('¡Nuevo recurso agregado con éxito!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Materias y grados únicos para desplegables de filtro
  const materiasDisponibles = Array.from(
    new Set(recursos.map((r) => r.materia).filter(Boolean))
  );
  
  const gradosDisponibles = Array.from(
    new Set(recursos.map((r) => r.grado).filter(Boolean))
  );

  // Filtrado reactivo en tiempo real
  const recursosFiltrados = recursos.filter((recurso) => {
    const matchesSearch = 
      (recurso.titulo && recurso.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (recurso.descripcion && recurso.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (recurso.autor && recurso.autor.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMateria = selectedMateria === '' || recurso.materia === selectedMateria;
    const matchesGrado = selectedGrado === '' || recurso.grado === selectedGrado;

    return matchesSearch && matchesMateria && matchesGrado;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedMateria('');
    setSelectedGrado('');
  };

  return (
    <div className="app-container">
      {/* Toast de confirmación de éxito */}
      {toastMessage && (
        <div className="toast-notification">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Encabezado Principal */}
      <header className="app-header">
        <div className="brand-badge">
          <Sparkles size={14} />
          <span>MINED • Banco de Recursos Educativos</span>
        </div>
        <h1 className="app-title">Recursos Académicos & Didácticos</h1>
        <p className="app-subtitle">
          Explora la biblioteca digital de guías, tutoriales y herramientas educativas conectadas en tiempo real con nuestra base de datos PostgreSQL.
        </p>

        {/* Botón Principal para Agregar Recurso */}
        <div className="header-action-wrapper">
          <button 
            className="btn-add-resource" 
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle size={18} />
            <span>Agregar Nuevo Recurso</span>
          </button>
        </div>

        {/* Barra de Estadísticas Rápida */}
        {!loading && !error && (
          <div className="stats-bar">
            <div className="stat-chip">
              <Database size={16} color="#6366F1" />
              <span>Total Recursos: <strong>{recursos.length}</strong></span>
            </div>
            <div className="stat-chip">
              <BookOpen size={16} color="#06B6D4" />
              <span>Materias: <strong>{materiasDisponibles.length}</strong></span>
            </div>
            <div className="stat-chip">
              <Award size={16} color="#10B981" />
              <span>Niveles/Grados: <strong>{gradosDisponibles.length}</strong></span>
            </div>
          </div>
        )}
      </header>

      {/* Barra de Controles: Búsqueda y Filtros */}
      <section className="controls-section">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por título, descripción o autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          {/* Filtro por Materia */}
          <select
            className="select-filter"
            value={selectedMateria}
            onChange={(e) => setSelectedMateria(e.target.value)}
          >
            <option value="">Todas las Materias</option>
            {materiasDisponibles.map((mat) => (
              <option key={mat} value={mat}>
                {mat}
              </option>
            ))}
          </select>

          {/* Filtro por Grado */}
          <select
            className="select-filter"
            value={selectedGrado}
            onChange={(e) => setSelectedGrado(e.target.value)}
          >
            <option value="">Todos los Grados/Niveles</option>
            {gradosDisponibles.map((grado) => (
              <option key={grado} value={grado}>
                {grado}
              </option>
            ))}
          </select>

          {/* Botón para reiniciar filtros */}
          {(searchTerm || selectedMateria || selectedGrado) && (
            <button className="btn-reset" onClick={resetFilters} title="Limpiar filtros">
              <RotateCcw size={15} />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </section>

      {/* Contenido Principal: Grilla de Tarjetas / Skeletons / Estado de Error / Vaciado */}
      <main>
        {/* Estado de Carga (Skeletons) */}
        {loading && (
          <div className="resources-grid">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="skeleton-card">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div className="skeleton-line" style={{ width: '80px', height: '22px' }}></div>
                  <div className="skeleton-line" style={{ width: '90px', height: '22px' }}></div>
                </div>
                <div className="skeleton-line" style={{ width: '85%', height: '28px', margin: '8px 0' }}></div>
                <div className="skeleton-line" style={{ width: '100%', height: '16px' }}></div>
                <div className="skeleton-line" style={{ width: '90%', height: '16px' }}></div>
                <div className="skeleton-line" style={{ width: '60%', height: '16px' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <div className="skeleton-line" style={{ width: '100px', height: '20px' }}></div>
                  <div className="skeleton-line" style={{ width: '80px', height: '20px' }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado de Error */}
        {!loading && error && (
          <div className="state-box">
            <div className="state-icon error">
              <AlertCircle size={28} />
            </div>
            <h2 className="state-title">Error al Cargar Recursos</h2>
            <p className="state-message">{error}</p>
            <button className="btn-retry" onClick={fetchRecursos}>
              Reintentar Conexión
            </button>
          </div>
        )}

        {/* Estado Sin Resultados */}
        {!loading && !error && recursosFiltrados.length === 0 && (
          <div className="state-box">
            <div className="state-icon empty">
              <Layers size={28} />
            </div>
            <h2 className="state-title">No se encontraron recursos</h2>
            <p className="state-message">
              No hay recursos que coincidan con la búsqueda o filtros seleccionados.
            </p>
            <button className="btn-retry" onClick={resetFilters}>
              Mostrar Todos los Recursos
            </button>
          </div>
        )}

        {/* Renderizado de Tarjetas de Recursos */}
        {!loading && !error && recursosFiltrados.length > 0 && (
          <div className="resources-grid">
            {recursosFiltrados.map((recurso) => (
              <ResourceCard key={recurso.id} recurso={recurso} />
            ))}
          </div>
        )}
      </main>

      {/* Modal para Agregar Recurso */}
      <AddResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onResourceAdded={handleResourceAdded}
      />

      {/* Pie de página */}
      <footer className="app-footer">
        <p>
          MINED • Banco de Recursos Educativos © {new Date().getFullYear()} — Conectado a PostgreSQL (Railway)
        </p>
      </footer>
    </div>
  );
}
