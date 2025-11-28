/* quiz.js - Lógica del quíz
   - Array de preguntas (mínimo 5)
   - Mostrar pregunta actual
   - Validar respuesta y mostrar feedback inmediato
   - Contador de puntos y cálculo de porcentaje
   - Deshabilitar botones tras respuesta
   - Transición entre preguntas con delay
*/

// Array de preguntas (tema: JavaScript básico)
const questions = [
  {
    pregunta: '¿Cuál es la forma correcta de declarar una variable que no cambiará su valor?',
    opciones: ['var miVar', 'let miVar', 'const miVar', 'variable miVar'],
    correcta: 2
  },
  {
    pregunta: '¿Qué método convierte una cadena a un número entero?',
    opciones: ['toInt()', 'parseInt()', 'Number.parse()', 'int()'],
    correcta: 1
  },
  {
    pregunta: '¿Cómo se añade un elemento al final de un arreglo `arr`?',
    opciones: ['arr.push(elem)', 'arr.add(elem)', 'arr.pushBack(elem)', 'arr.append(elem)'],
    correcta: 0
  },
  {
    pregunta: '¿Qué operador se utiliza para comparar igualdad estricta (valor y tipo)?',
    opciones: ['==', '=', '===', '!='],
    correcta: 2
  },
  {
    pregunta: '¿Qué devuelve `typeof null` en JavaScript?',
    opciones: ['"null"', '"object"', '"undefined"', '"number"'],
    correcta: 1
  }
];

// Estado del quíz
let currentIndex = 0;
let score = 0;
const totalQuestions = questions.length;
let answered = false;

// Elementos del DOM
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const retryBtn = document.getElementById('retryBtn');
const questionNumberEl = document.getElementById('question-number');
const questionTextEl = document.getElementById('questionText');
const optionsEl = document.getElementById('options');
const progressBar = document.getElementById('progressBar');
const scoreText = document.getElementById('scoreText');
const percentText = document.getElementById('percentText');
const resultMessage = document.getElementById('resultMessage');

// Iniciar quíz
startBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  questionScreen.classList.remove('hidden');
  questionScreen.setAttribute('aria-hidden', 'false');
  startQuiz();
});

// Mostrar siguiente pregunta manualmente (si el usuario quiere saltar después del delay)
nextBtn.addEventListener('click', () => {
  goToNextQuestion();
});

// Reintentar el quíz
retryBtn.addEventListener('click', () => {
  resetQuiz();
});

/**
 * Inicia variables y muestra la primera pregunta
 */
function startQuiz() {
  currentIndex = 0;
  score = 0;
  answered = false;
  showQuestion(currentIndex);
  updateProgress();
}

/**
 * Muestra la pregunta indicada por index
 * @param {number} index
 */
function showQuestion(index) {
  // Limpiar opciones previas
  optionsEl.innerHTML = '';
  nextBtn.disabled = true;
  answered = false;

  const q = questions[index];

  // Actualizar número y texto
  questionNumberEl.textContent = `Pregunta ${index + 1} de ${totalQuestions}`;
  questionTextEl.textContent = q.pregunta;

  // Generar botones de opciones
  q.opciones.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.setAttribute('role', 'listitem');
    btn.disabled = false;
    // Manejar clic en opción
    btn.addEventListener('click', () => handleAnswer(btn, i));
    optionsEl.appendChild(btn);
  });
}

/**
 * Maneja la selección de respuesta
 * @param {HTMLElement} btn - Botón seleccionado
 * @param {number} selectedIndex - Índice de opción seleccionada
 */
function handleAnswer(btn, selectedIndex) {
  if (answered) return; // prevenir doble respuesta
  answered = true;

  const q = questions[currentIndex];
  const correctIndex = q.correcta;

  // Desactivar todos los botones y marcar feedback
  const optionButtons = Array.from(optionsEl.querySelectorAll('button'));
  optionButtons.forEach((b, i) => {
    b.disabled = true;
    if (i === correctIndex) {
      b.classList.add('correct');
    }
    if (i === selectedIndex && i !== correctIndex) {
      b.classList.add('incorrect');
    }
  });

  // Actualizar puntaje si fue correcta
  if (selectedIndex === correctIndex) {
    score++;
  }

  // Mostrar botón siguiente tras respuesta
  nextBtn.disabled = false;

  // Actualizar barra de progreso
  updateProgress();

  // Transición automática a la siguiente pregunta después de 1200 ms
  setTimeout(() => {
    goToNextQuestion();
  }, 1200);
}

/**
 * Avanza a la siguiente pregunta o muestra resultados
 */
function goToNextQuestion() {
  currentIndex++;
  if (currentIndex < totalQuestions) {
    showQuestion(currentIndex);
    updateProgress();
  } else {
    // Fin del quíz
    showResults();
  }
}

/**
 * Actualiza la barra de progreso según la pregunta actual
 */
function updateProgress() {
  const percent = Math.round((currentIndex / totalQuestions) * 100);
  progressBar.style.width = percent + '%';
}

/**
 * Muestra pantalla de resultados con puntaje y mensaje
 */
function showResults() {
  questionScreen.classList.add('hidden');
  questionScreen.setAttribute('aria-hidden', 'true');
  resultScreen.classList.remove('hidden');
  resultScreen.setAttribute('aria-hidden', 'false');

  scoreText.textContent = `${score} de ${totalQuestions} correctas`;
  const percent = calcularPorcentaje(score, totalQuestions);
  percentText.textContent = `${percent}%`;
  resultMessage.textContent = mensajePorDesempeño(percent);
}

/**
 * Calcula porcentaje de aciertos
 * @param {number} puntos
 * @param {number} total
 * @returns {number}
 */
function calcularPorcentaje(puntos, total) {
  return Math.round((puntos / total) * 100);
}

/**
 * Retorna mensaje según desempeño
 */
function mensajePorDesempeño(pct) {
  if (pct >= 80) return 'Excelente ✅';
  if (pct >= 50) return 'Bien 👍';
  return 'Puedes mejorar 💡';
}

/**
 * Reinicia el quíz para reintentar
 */
function resetQuiz() {
  currentIndex = 0;
  score = 0;
  resultScreen.classList.add('hidden');
  resultScreen.setAttribute('aria-hidden', 'true');
  startScreen.classList.remove('hidden');
}

// Comentario: Inicialización ligera (no iniciar automáticamente)
// Las acciones se disparan desde los botones del DOM.
