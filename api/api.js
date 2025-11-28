// 🔴 Pokédex - Buscador de Pokémon con Grid, Paginación y Modal
// API: https://pokeapi.co/api/v2/

// ===== VARIABLES GLOBALES =====
let pokemonList = []; // Lista total de Pokémon
let filteredList = []; // Lista filtrada por búsqueda
let currentPage = 1;
const itemsPerPage = 20;

// Elementos DOM
const pokemonInput = document.getElementById('pokemonInput');
const btnBuscar = document.getElementById('btnBuscar');
const resultadoDiv = document.getElementById('resultado');
const paginacionDiv = document.getElementById('paginacion');
const modal = document.getElementById('modal');

/**
 * Obtiene lista de 898 Pokémon desde la PokeAPI
 * Realiza requests múltiples para obtener todos los datos
 * @returns {Promise<Array>} Array de objetos con nombre, id e imagen
 */
async function obtenerTodosPokemon() {
  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=898`);
    const datos = await respuesta.json();
    
    // Mapear resultados para obtener nombre, id e imagen
    const pokemons = datos.results.map((p, index) => ({
      name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
      id: index + 1,
      url: p.url
    }));
    
    return pokemons;
  } catch (error) {
    console.error('Error obteniendo Pokémon:', error);
    return [];
  }
}

/**
 * Obtiene detalles completos de un Pokémon (stats, tipos, altura, peso)
 * @param {string} url - URL de la PokeAPI del Pokémon
 * @returns {Promise<Object>} Datos completos del Pokémon
 */
async function obtenerDetallesPokemon(url) {
  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error('Error obteniendo detalles:', error);
    return null;
  }
}

/**
 * Renderiza el grid de Pokémon para la página actual
 */
function renderizarGrid() {
  resultadoDiv.innerHTML = '';
  
  // Calcular índices de inicio y fin
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pagina = filteredList.slice(start, end);
  
  if (pagina.length === 0) {
    resultadoDiv.innerHTML = '<p class="loading">No se encontraron Pokémon.</p>';
    return;
  }
  
  pagina.forEach(pokemon => {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.innerHTML = `
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}">
      <div class="pokemon-name">${pokemon.name}</div>
      <div class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</div>
    `;
    card.addEventListener('click', () => abrirModal(pokemon));
    resultadoDiv.appendChild(card);
  });
}

/**
 * Renderiza controles de paginación
 */
function renderizarPaginacion() {
  paginacionDiv.innerHTML = '';
  
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  
  if (totalPages <= 1) return; // No mostrar paginación si hay solo 1 página
  
  // Botón anterior
  const btnPrev = document.createElement('button');
  btnPrev.textContent = '← Anterior';
  btnPrev.disabled = currentPage === 1;
  btnPrev.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderizarGrid();
      renderizarPaginacion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  paginacionDiv.appendChild(btnPrev);
  
  // Información de página
  const info = document.createElement('span');
  info.className = 'info';
  info.textContent = `Página ${currentPage} de ${totalPages}`;
  paginacionDiv.appendChild(info);
  
  // Botón siguiente
  const btnNext = document.createElement('button');
  btnNext.textContent = 'Siguiente →';
  btnNext.disabled = currentPage === totalPages;
  btnNext.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderizarGrid();
      renderizarPaginacion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  paginacionDiv.appendChild(btnNext);
}

/**
 * Abre modal con detalles completos del Pokémon seleccionado
 * @param {Object} pokemon - Objeto con datos básicos del Pokémon
 */
async function abrirModal(pokemon) {
  modal.classList.add('active');
  
  // Obtener detalles completos
  const detalles = await obtenerDetallesPokemon(pokemon.url);
  
  if (!detalles) {
    document.getElementById('modalName').textContent = pokemon.name;
    document.getElementById('modalImg').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
    return;
  }
  
  // Llenar modal
  document.getElementById('modalName').textContent = pokemon.name;
  document.getElementById('modalImg').src = detalles.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  
  const statsDiv = document.getElementById('modalStats');
  statsDiv.innerHTML = '';
  
  // Agregar estadísticas principales
  const stats = [
    { label: 'ID', value: `#${String(pokemon.id).padStart(3, '0')}` },
    { label: 'Altura', value: `${(detalles.height / 10).toFixed(1)} m` },
    { label: 'Peso', value: `${(detalles.weight / 10).toFixed(1)} kg` },
    { label: 'Tipo(s)', value: detalles.types.map(t => t.type.name).join(', ') },
  ];
  
  // Agregar stats base
  detalles.stats.forEach(stat => {
    stats.push({
      label: stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1),
      value: stat.base_stat
    });
  });
  
  stats.forEach(stat => {
    const row = document.createElement('div');
    row.className = 'stat-row';
    row.innerHTML = `
      <span class="stat-label">${stat.label}:</span>
      <span class="stat-value">${stat.value}</span>
    `;
    statsDiv.appendChild(row);
  });
}

/**
 * Cierra el modal de detalles
 */
function cerrarModal() {
  modal.classList.remove('active');
}

/**
 * Filtra lista de Pokémon según término de búsqueda
 * @param {string} termino - Nombre o ID del Pokémon
 */
function filtrarPokemon(termino) {
  const term = termino.toLowerCase().trim();
  
  if (!term) {
    filteredList = pokemonList;
  } else {
    filteredList = pokemonList.filter(p => 
      p.name.toLowerCase().includes(term) || 
      String(p.id).includes(term)
    );
  }
  
  currentPage = 1; // Resetear a página 1
  renderizarGrid();
  renderizarPaginacion();
}

/**
 * Inicializa la aplicación
 * - Obtiene lista de Pokémon
 * - Configura event listeners
 */
async function inicializar() {
  resultadoDiv.innerHTML = '<p class="loading">Cargando Pokédex...</p>';
  
  pokemonList = await obtenerTodosPokemon();
  filteredList = pokemonList;
  
  renderizarGrid();
  renderizarPaginacion();
  
  // Event listeners
  btnBuscar.addEventListener('click', () => {
    const termino = pokemonInput.value;
    filtrarPokemon(termino);
  });
  
  pokemonInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const termino = pokemonInput.value;
      filtrarPokemon(termino);
    }
  });
  
  // Cerrar modal al hacer click fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });
}

// Iniciar app cuando DOM esté listo
document.addEventListener('DOMContentLoaded', inicializar); 
