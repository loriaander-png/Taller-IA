// Variables globales
const API_BASE_URL = 'https://rickandmortyapi.com/api';
let currentPage = 1;
let totalPages = 1;
let currentSearch = '';
let currentStatusFilter = '';

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const searchBtn = document.getElementById('searchBtn');
const charactersGrid = document.getElementById('charactersGrid');
const pagination = document.getElementById('pagination');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const paginationInfo = document.getElementById('paginationInfo');

// Event Listeners
searchBtn.addEventListener('click', () => {
    currentSearch = searchInput.value.trim();
    currentStatusFilter = statusFilter.value;
    currentPage = 1;
    fetchCharacters();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentSearch = searchInput.value.trim();
        currentStatusFilter = statusFilter.value;
        currentPage = 1;
        fetchCharacters();
    }
});

statusFilter.addEventListener('change', () => {
    currentSearch = searchInput.value.trim();
    currentStatusFilter = statusFilter.value;
    currentPage = 1;
    fetchCharacters();
});

// Función principal para obtener personajes
async function fetchCharacters() {
    try {
        showLoading(true);
        hideError();
        charactersGrid.innerHTML = '';
        pagination.innerHTML = '';

        let url = `${API_BASE_URL}/character/?page=${currentPage}`;

        // Agregar búsqueda por nombre si existe
        if (currentSearch) {
            url += `&name=${encodeURIComponent(currentSearch)}`;
        }

        // Agregar filtro de estado si existe
        if (currentStatusFilter) {
            url += `&status=${encodeURIComponent(currentStatusFilter)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                showError('No se encontraron personajes con esos criterios de búsqueda.');
                showLoading(false);
                return;
            }
            throw new Error(`Error en la respuesta: ${response.status}`);
        }

        const data = await response.json();

        totalPages = data.info.pages;
        
        // Mostrar información de paginación
        displayPaginationInfo(data.info);

        // Renderizar tarjetas de personajes
        renderCharacters(data.results);

        // Renderizar controles de paginación
        renderPagination();

        showLoading(false);
    } catch (error) {
        console.error('Error fetching characters:', error);
        showError('Error al cargar los personajes. Intenta de nuevo.');
        showLoading(false);
    }
}

// Función para renderizar personajes
function renderCharacters(characters) {
    charactersGrid.innerHTML = '';

    characters.forEach(character => {
        const card = createCharacterCard(character);
        charactersGrid.appendChild(card);
    });
}

// Función para crear una tarjeta de personaje
function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';

    const statusClass = character.status.toLowerCase();
    const statusText = translateStatus(character.status);

    card.innerHTML = `
        <img 
            src="${character.image}" 
            alt="${character.name}" 
            class="character-image"
        >
        <div class="character-info">
            <h3>${character.name}</h3>
            <div class="info-item">
                <span class="info-label">Estado:</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Especie:</span>
                <span>${character.species}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Ubicación:</span>
                <span>${character.location.name}</span>
            </div>
        </div>
    `;

    return card;
}

// Función para traducir el estado
function translateStatus(status) {
    const statusMap = {
        'Alive': 'Vivo',
        'Dead': 'Muerto',
        'unknown': 'Desconocido'
    };
    return statusMap[status] || status;
}

// Función para renderizar controles de paginación
function renderPagination() {
    pagination.innerHTML = '';

    // Botón anterior
    const prevBtn = createPaginationButton('← Anterior', currentPage > 1);
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchCharacters();
            window.scrollTo(0, 0);
        }
    });
    pagination.appendChild(prevBtn);

    // Números de página
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        const firstBtn = createPaginationButton('1', true);
        firstBtn.addEventListener('click', () => {
            currentPage = 1;
            fetchCharacters();
            window.scrollTo(0, 0);
        });
        pagination.appendChild(firstBtn);

        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.style.color = 'white';
            dots.textContent = '...';
            pagination.appendChild(dots);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const btn = createPaginationButton(i.toString(), true);
        if (i === currentPage) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
            currentPage = i;
            fetchCharacters();
            window.scrollTo(0, 0);
        });
        pagination.appendChild(btn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.style.color = 'white';
            dots.textContent = '...';
            pagination.appendChild(dots);
        }

        const lastBtn = createPaginationButton(totalPages.toString(), true);
        lastBtn.addEventListener('click', () => {
            currentPage = totalPages;
            fetchCharacters();
            window.scrollTo(0, 0);
        });
        pagination.appendChild(lastBtn);
    }

    // Botón siguiente
    const nextBtn = createPaginationButton('Siguiente →', currentPage < totalPages);
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchCharacters();
            window.scrollTo(0, 0);
        }
    });
    pagination.appendChild(nextBtn);
}

// Función auxiliar para crear botones de paginación
function createPaginationButton(text, enabled) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.disabled = !enabled;
    return btn;
}

// Función para mostrar información de paginación
function displayPaginationInfo(info) {
    paginationInfo.textContent = `Página ${currentPage} de ${info.pages} | Total de personajes: ${info.count}`;
}

// Función para mostrar/ocultar loading
function showLoading(show) {
    loading.classList.toggle('active', show);
}

// Función para mostrar error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('active');
}

// Función para ocultar error
function hideError() {
    errorMessage.classList.remove('active');
}

// Cargar personajes al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchCharacters();
});
