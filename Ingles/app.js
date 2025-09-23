// ------------------- VARIABLES GLOBALES -------------------
let currentQuestion = null;

// Recupera puntuación de localStorage o inicia en 0
let score = Number(localStorage.getItem('spanish_quiz_score')) || 0;

// DOM elements
const questionBox = document.getElementById('question-box');
const optionsContainer = document.getElementById('options-container');
const scoreBox = document.getElementById('score-box');
const messageModal = document.getElementById('message-modal');
const modalMessage = document.getElementById('modal-message');

// Actualiza la puntuación en pantalla
scoreBox.textContent = `Puntuación: ${score}`;

// ------------------- BANCO DE PREGUNTAS -------------------
const questions = [
    { q: "¿Cómo se dice la palabra regla en inglés?", a: "Ruler", distractors: ["Pen", "Pencil", "Eraser"] },
    { q: "¿Cómo se dice la palabra escritorio en inglés?", a: "Desk", distractors: ["Table", "Chair", "Door"] },
    { q: "¿Cómo se dice la palabra cuadrado en inglés?", a: "Square", distractors: ["Circle", "Triangle", "Rectangle"] },
    { q: "¿Cómo se dice la palabra goma en inglés?", a: "Glue", distractors: ["Eraser", "Tape", "Marker"] },
    { q: "¿Cuál de los siguientes es un verbo?", a: "Eat", distractors: ["Pen", "Bed", "Shape"] },
    { q: "¿Cómo se dice la palabra amarillo en inglés?", a: "Yellow", distractors: ["Red", "Blue", "Green"] },
    { q: "¿Cómo se dice pescado en inglés?", a: "Fish", distractors: ["Bird", "Dog", "Cat"] },
    { q: "¿Si mezclamos los colores blue y yellow, formamos el color?", a: "Green", distractors: ["Red", "Orange", "Purple"] },
    { q: "¿Cómo se dice hermano en inglés?", a: "Brother", distractors: ["Sister", "Mother", "Father"] },
    { q: "¿Cuál de las siguientes oraciones significa 'ella está bailando'?", a: "She is dancing", distractors: ["She dance", "She dancing", "He is dancing"] },
    { q: "¿Cómo se dice mono en inglés?", a: "Monkey", distractors: ["Lion", "Tiger", "Giraffe"] },
    { q: "¿Cómo se dice triste en inglés?", a: "Sad", distractors: ["Happy", "Angry", "Tired"] },
    { q: "Si mezclamos los colores red y yellow, formamos el color.", a: "Orange", distractors: ["Green", "Purple", "Brown"] },
    { q: "Di las cuatro estaciones del año en inglés.", a: "Summer, Winter, Fall, Spring", distractors: ["January, July, October", "Hot, Cold, Rainy, Sunny", "Spring, Fall, Summer, Winter"] },
    { q: "¿Cómo se dice papas fritas en inglés?", a: "French fries", distractors: ["Hamburger", "Pizza", "Hot dog"] },
    { q: "¿Cómo se dice manzana en inglés?", a: "Apple", distractors: ["Banana", "Orange", "Grape"] },
    { q: "¿Cómo se dice bailar en inglés?", a: "Dance", distractors: ["Run", "Sing", "Sleep"] },
    { q: "Di los siguientes números en inglés. 9, 12 y 25.", a: "Nine, twelve, twenty five", distractors: ["Nine, twenty-five, twelve", "Twenty five, nine, twelve", "Twelve, nine, twenty-five"] },
    { q: "¿Cómo se dice cama en inglés?", a: "Bed", distractors: ["Chair", "Table", "Sofa"] }
];

// Copia de preguntas para ir eliminando las usadas
let remainingQuestions = [...questions];

// ------------------- FUNCIONES DEL JUEGO -------------------

// Carga una pregunta aleatoria sin repetir
const loadRandomQuestion = () => {
    if (remainingQuestions.length === 0) {
        showModal(`¡Felicidades! Has completado todas las preguntas. Tu puntuación final es: ${score}`);
        return;
    }

    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    currentQuestion = remainingQuestions.splice(randomIndex, 1)[0]; // elimina la pregunta usada
    showQuestion();
};

// Muestra la pregunta y opciones
function showQuestion() {
    if (!currentQuestion) return;
    questionBox.textContent = currentQuestion.q;
    optionsContainer.innerHTML = '';

    const shuffledOptions = shuffle([...currentQuestion.distractors, currentQuestion.a]);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'px-4 py-3 bg-blue-100 text-blue-800 rounded-lg font-bold text-lg hover:bg-blue-200 transition-colors duration-200';
        button.addEventListener('click', () => handleAnswerClick(option, button));
        optionsContainer.appendChild(button);
    });
}

// Maneja la selección del usuario
function handleAnswerClick(selectedAnswer, button) {
    const optionButtons = optionsContainer.querySelectorAll('button');
    optionButtons.forEach(btn => btn.disabled = true);

    if (selectedAnswer === currentQuestion.a) {
        button.classList.add('bg-green-500', 'text-white');
        showModal("¡Correcto!");
        updateScore(1);
    } else {
        button.classList.add('bg-red-500', 'text-white');
        showModal("¡Incorrecto!");
        optionButtons.forEach(btn => {
            if (btn.textContent === currentQuestion.a) {
                btn.classList.add('bg-green-500', 'text-white');
            }
        });
    }

    setTimeout(() => loadRandomQuestion(), 2000);
}

// Mezcla un array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ------------------- PUNTUACIÓN -------------------
function updateScore(points) {
    score += points;
    scoreBox.textContent = `Puntuación: ${score}`;
    localStorage.setItem('spanish_quiz_score', score);
}

// Botón para reiniciar puntuación
const resetBtn = document.createElement('button');
resetBtn.textContent = "Reiniciar Puntuación";
resetBtn.className = "mt-4 px-4 py-2 reset-btn text-white rounded";
resetBtn.addEventListener('click', () => {
    score = 0;
    scoreBox.textContent = `Puntuación: ${score}`;
    localStorage.setItem('spanish_quiz_score', score);
    remainingQuestions = [...questions]; // reinicia preguntas
    loadRandomQuestion();
});
document.getElementById('quiz-container').appendChild(resetBtn);

// ------------------- MODAL -------------------
// Muestra un mensaje en el modal
function showModal(message) {
    modalMessage.textContent = message;
    messageModal.classList.add('active');
}

// Cierra el modal
window.closeModal = () => {
    messageModal.classList.remove('active');
};


// ------------------- INICIALIZACIÓN -------------------
loadRandomQuestion();
