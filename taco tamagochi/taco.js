// Taco Tamagotchi - Tu gato virtual estilo retro
// Sistema de estados: hambre, energía, felicidad

// Estados iniciales
let taco = {
    hambre: 50,
    energia: 80,
    felicidad: 70,
    vivo: true,
    nombre: 'Taco'
};

// Elementos del DOM
const hungerBar = document.getElementById('hungerBar');
const hungerValue = document.getElementById('hungerValue');
const energyBar = document.getElementById('energyBar');
const energyValue = document.getElementById('energyValue');
const happinessBar = document.getElementById('happinessBar');
const happinessValue = document.getElementById('happinessValue');
const catEmoji = document.getElementById('catEmoji');
const tacoSpeech = document.getElementById('tacoSpeech');
const gameOverDiv = document.getElementById('gameOver');

// Respuestas de Taco
const responses = {
    hungry: [
        '¡Dame comida YA!',
        '😼 ¡Estoy muerto de hambre!',
        '¿Dónde está mi comida?',
        '¡Miauuuuu! 🍖'
    ],
    tired: [
        'Estoy cansado 😴',
        'zzz... déjame dormir...',
        'No puedo más...',
        'Necesito descansar 😩'
    ],
    happy: [
        '¡Estoy feliz! 😻',
        'Purr purr purr 💕',
        '¡Eres el mejor! 😻',
        '¡Qué felicidad! 🎉'
    ],
    neutral: [
        'Miau 🐱',
        'Todo tranquilo',
        'Aquí ando, tranquilito',
        '*Ronronea* 😸',
        'Estoy bien, gracias por preguntar',
        'Mmmiau~ 🐱'
    ]
};

// Emojis según estado
const catEmojis = {
    happy: '😻',
    sad: '😿',
    normal: '😺',
    hungry: '😼',
    sleeping: '😴'
};

// ===================== FUNCIÓN PRINCIPAL =====================
function getTacoResponse() {
    if (!taco.vivo) return;

    let response = '';

    // Reglas de comportamiento
    if (taco.hambre > 70) {
        response = getRandomResponse(responses.hungry);
        catEmoji.textContent = catEmojis.hungry;
        catEmoji.classList.remove('sleeping', 'sad');
    } else if (taco.energia < 30) {
        response = getRandomResponse(responses.tired);
        catEmoji.textContent = catEmojis.sleeping;
        catEmoji.classList.add('sleeping');
    } else if (taco.felicidad > 80) {
        response = getRandomResponse(responses.happy);
        catEmoji.textContent = catEmojis.happy;
        catEmoji.classList.remove('sleeping', 'sad');
    } else {
        response = getRandomResponse(responses.neutral);
        catEmoji.textContent = catEmojis.normal;
        catEmoji.classList.remove('sleeping', 'sad');
    }

    tacoSpeech.textContent = response;
}

// ===================== ACCIONES =====================
function feed() {
    if (!taco.vivo) return;

    taco.hambre -= 30;
    taco.hambre = Math.max(0, taco.hambre);
    taco.energia -= 5;
    taco.felicidad += 10;

    updateStats();
    catEmoji.classList.remove('sleeping', 'sad');
    tacoSpeech.textContent = '¡Ñam ñam! 😋';
    catEmoji.textContent = '😸';

    setTimeout(() => {
        getTacoResponse();
    }, 1000);
}

function play() {
    if (!taco.vivo) return;

    if (taco.energia < 20) {
        tacoSpeech.textContent = 'Estoy muy cansado para jugar... 😩';
        return;
    }

    taco.hambre += 15;
    taco.energia -= 30;
    taco.felicidad += 30;

    updateStats();
    catEmoji.textContent = '🎮';
    catEmoji.classList.remove('sleeping', 'sad');
    tacoSpeech.textContent = '¡Weee! ¡Esto es divertido! 😻';

    setTimeout(() => {
        getTacoResponse();
    }, 1500);
}

function sleep() {
    if (!taco.vivo) return;

    catEmoji.textContent = '😴';
    catEmoji.classList.add('sleeping');
    tacoSpeech.textContent = 'Zzzzz... 💤';

    // Dormir recupera energía
    setTimeout(() => {
        taco.energia = 100;
        taco.energia = Math.min(100, taco.energia);
        taco.hambre += 10;
        taco.felicidad += 5;

        updateStats();
        getTacoResponse();
    }, 2000);
}

function resetTaco() {
    taco = {
        hambre: 50,
        energia: 80,
        felicidad: 70,
        vivo: true,
        nombre: 'Taco'
    };

    gameOverDiv.classList.remove('show');
    catEmoji.classList.remove('sleeping', 'sad');
    catEmoji.textContent = catEmojis.normal;
    tacoSpeech.textContent = '¡Hola de nuevo! 🐱';

    updateStats();
    getTacoResponse();
}

// ===================== UTILIDADES =====================
function getRandomResponse(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function updateStats() {
    // Limitar valores entre 0 y 100
    taco.hambre = Math.min(100, Math.max(0, taco.hambre));
    taco.energia = Math.min(100, Math.max(0, taco.energia));
    taco.felicidad = Math.min(100, Math.max(0, taco.felicidad));

    // Actualizar barras
    hungerBar.style.width = taco.hambre + '%';
    hungerValue.textContent = Math.round(taco.hambre);

    energyBar.style.width = taco.energia + '%';
    energyValue.textContent = Math.round(taco.energia);

    happinessBar.style.width = taco.felicidad + '%';
    happinessValue.textContent = Math.round(taco.felicidad);

    // Verificar si Taco sigue vivo
    checkIfAlive();
}

function checkIfAlive() {
    if (taco.hambre >= 100 || taco.energia <= 0 || taco.felicidad <= 0) {
        taco.vivo = false;
        gameOverDiv.classList.add('show');
        catEmoji.textContent = '😿';
        catEmoji.classList.add('sad');
        tacoSpeech.textContent = 'Zzzz... 💤';

        // Desactivar botones
        document.querySelectorAll('button:not(.reset-btn)').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
    }
}

// ===================== SIMULACIÓN DE TIEMPO =====================
// El tiempo pasa: aumenta hambre, disminuye energía gradualmente
setInterval(() => {
    if (taco.vivo) {
        taco.hambre += 1;
        taco.energia -= 0.5;
        taco.felicidad -= 0.3;

        updateStats();
    }
}, 3000); // Cada 3 segundos

// ===================== INICIALIZACIÓN =====================
window.addEventListener('DOMContentLoaded', () => {
    console.log('🐱 ¡Taco Tamagotchi iniciado!');
    updateStats();
    getTacoResponse();
});
