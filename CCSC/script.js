// Preguntas y respuestas del juego
const questions = [
    { q: '¿Cómo se llama el alcalde de Cobán?', a: 'Felipe Pop' },
    { q: '¿Cómo se llama el presidente de Guatemala?', a: 'Bernardo Arévalo' },
    { q: '¿En qué departamento se encuentra ubicada la ciudad de Cobán?', a: 'Alta Verapaz' },
    { q: '¿Nos ayudan a saber la orientación de diferentes lugares en relación al lugar donde nos encontramos?', a: 'Puntos cardinales' },
    { q: '¿Cómo se llama tu municipio?', a: 'Cobán' },
    { q: '¿Es un proceso que se activa cuando el organismo detecta algún peligro, amenaza o desequilibrio?', a: 'Emociones' },
    { q: '¿Son como fotografías de una parte de la Tierra?', a: 'Mapas' },
    { q: '¿En cuántos departamentos está dividida Guatemala?', a: '22 departamentos' },
    { q: '¿Son pequeños territorios de cada departamento?', a: 'Municipios' },
    { q: '¿Es un grupo de personas que viven cerca unas de otras y sus autoridades municipales son las mismas?', a: 'Comunidades' },
    { q: '¿Es la parte más antigua de una ciudad?', a: 'Centro Histórico' },
    { q: '¿Cuántas comunidades étnicas existen en Guatemala?', a: '4 etnias' },
    { q: 'Nombres de las 4 comunidades étnicas de Guatemala.', a: 'Maya, Xinca, Garífuna y Ladino' },
    { q: '¿Para qué sirven los medios de comunicación?', a: 'Sirven para entretener, informar y comunicar a las personas.' },
    { q: '¿Cuál es el nombre del ave nacional de Guatemala?', a: 'El Quetzal' },
    { q: 'Son gráficos que informan acerca de acciones que se pueden hacer o que evitan accidentes ocasionados por los conductores.', a: 'Señales de tránsito' },
    { q: 'Es un árbol frondoso de tronco grueso, representa la fuerza, la vida y la riqueza del suelo guatemalteco.', a: 'La ceiba' },
    { q: 'Es una ciudad ubicada en el departamento de Petén, es la más representativa del pueblo maya.', a: 'Tikal' },
    { q: 'Es considerado uno de los volcanes más emblemáticos del país, está activo, es decir mantiene constante erupción.', a: 'Volcán de Pacaya' },
    { q: 'Son elevaciones de terreno cubiertas de vegetación.', a: 'Las montañas' }
];

// Elementos del DOM
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const submitButton = document.getElementById('submit-button');
const scoreDisplay = document.getElementById('score-display');
const progressDisplay = document.getElementById('progress-display');
const messageBox = document.getElementById('message-box');
const messageText = document.getElementById('message-text');
const correctAnswerText = document.getElementById('correct-answer-text');
const closeMessageBtn = document.getElementById('close-message');

// Estado del juego
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Fisher-Yates shuffle para mezclar las preguntas
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Muestra la siguiente pregunta o finaliza el juego
function showNextQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length) {
        const question = shuffledQuestions[currentQuestionIndex];
        questionText.textContent = question.q;
        answerInput.value = '';
        progressDisplay.textContent = `Pregunta ${currentQuestionIndex + 1} / ${shuffledQuestions.length}`;
    } else {
        endGame();
    }
}

// Finaliza el juego y muestra el resultado final
function endGame() {
    questionText.textContent = `¡Juego terminado! Tu puntuación final es: ${score} de ${shuffledQuestions.length}. 🎉`;
    answerInput.style.display = 'none';
    submitButton.style.display = 'none';
    closeMessageBtn.textContent = 'Volver a jugar';
    showMessageBox('¡Juego Terminado!', `Tu puntuación final es: ${score}`);
}

// Muestra un mensaje en un cuadro de diálogo personalizado
function showMessageBox(title, message, answer = '') {
    messageText.textContent = title;
    if (answer) {
        correctAnswerText.textContent = `La respuesta era: ${answer}`;
    } else {
        correctAnswerText.textContent = '';
    }
    messageBox.classList.remove('hidden');
    messageBox.classList.add('flex');
    messageBox.querySelector('div').classList.remove('scale-95');
    messageBox.querySelector('div').classList.add('scale-100');
}

// Oculta el cuadro de diálogo
function hideMessageBox() {
    messageBox.querySelector('div').classList.remove('scale-100');
    messageBox.querySelector('div').classList.add('scale-95');
    messageBox.classList.remove('flex');
    messageBox.classList.add('hidden');
}

// Reinicia el juego
function resetGame() {
    score = 0;
    currentQuestionIndex = 0;
    shuffledQuestions = shuffle([...questions]);
    scoreDisplay.textContent = 'Puntuación: 0';
    answerInput.style.display = 'block';
    submitButton.style.display = 'block';
    closeMessageBtn.textContent = '¡Siguiente! ✨';
    showNextQuestion();
}

// Manejador del botón de envío
function handleSubmit() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.a.trim().toLowerCase();
    let feedbackTitle = '';

    if (userAnswer === correctAnswer) {
        score++;
        feedbackTitle = '¡Súper bien! ¡Respuesta correcta! 😊';
    } else {
        score--;
        feedbackTitle = '¡Ups! Intenta de nuevo. 😞';
    }

    scoreDisplay.textContent = `Puntuación: ${score}`;
    showMessageBox(feedbackTitle, '', currentQuestion.a);
    
    currentQuestionIndex++;
}

// Manejador del botón de cerrar el mensaje
function handleCloseMessage() {
    hideMessageBox();
    if (currentQuestionIndex < shuffledQuestions.length) {
        showNextQuestion();
    } else {
        resetGame();
    }
}
    
// Asigna los eventos
submitButton.addEventListener('click', handleSubmit);
closeMessageBtn.addEventListener('click', handleCloseMessage);
    
// Inicia el juego
window.onload = resetGame;