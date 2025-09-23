// Arreglo de preguntas y respuestas sin imágenes
const questions = [
    { question: "¿Son los seres de la naturaleza que nacen, crecen, se reproducen y mueren?", answer: "Seres vivos", wrong1: "Seres no vivos", wrong2: "Ecosistema" },
    { question: "¿Son parte de la naturaleza, pero no tienen vida?", answer: "Seres no vivos", wrong1: "Seres vivos", wrong2: "La materia" },
    { question: "¿Se desarrolla por medio de huevos, fuera de la madre que los ha puesto?", answer: "Ovíparos", wrong1: "Vivíparos", wrong2: "Animales" },
    { question: "¿Se desarrollan dentro del cuerpo de la madre, hasta que están en condiciones de nacer?", answer: "Vivíparos", wrong1: "Ovíparos", wrong2: "Mamíferos" },
    { question: "¿Está formado por toda la comunidad de seres vivos que conviven en un ambiente con condiciones similares?", answer: "Ecosistema", wrong1: "Tierra", wrong2: "La comunidad" },
    { question: "¿Constituye el líquido más importante para la vida del planeta?", answer: "Agua", wrong1: "Aire", wrong2: "Savia" },
    { question: "¿Es fuente de energía ya que proporciona luz y calor?", answer: "El Sol", wrong1: "La luna", wrong2: "Las estrellas" },
    { question: "¿Está formado por gases, como el oxígeno, el cual permite la vida de los seres vivos?", answer: "Aire", wrong1: "Viento", wrong2: "Dióxido de carbono" },
    { question: "¿Es una cavidad donde inicia la transformación de los alimentos?", answer: "Boca", wrong1: "Estómago", wrong2: "Esófago" },
    { question: "¿Se encuentra dentro de la cabeza, está protegida por el cráneo?", answer: "Cerebro", wrong1: "Corazón", wrong2: "Ojo" },
    { question: "¿Es un órgano musculoso que se encuentra en la caja torácica o pecho?", answer: "Corazón", wrong1: "Cerebro", wrong2: "Riñón" },
    { question: "¿Se refiere al estado en el cual el ser humano puede realizar todas sus funciones con normalidad?", answer: "La salud", wrong1: "La vida", wrong2: "La fuerza" },
    { question: "¿Es un proceso biológico que le permite al organismo asimilar nutrientes necesarios para su crecimiento y buen funcionamiento?", answer: "La nutrición", wrong1: "La alimentación", wrong2: "El ejercicio" },
    { question: "¿Cómo se puede disminuir la desnutrición?", answer: "Dieta balanceada", wrong1: "Comer mucho", wrong2: "Dieta proteica" },
    { question: "¿Cuáles son las partes de la planta?", answer: "Tallo, raíz, hoja y flor", wrong1: "Tallo y hojas", wrong2: "Solo flor" },
    { question: "¿Cómo se conoce al espacio que ocupa todo cuerpo en el universo?", answer: "Materia", wrong1: "Gravedad", wrong2: "Volumen" },
    { question: "Mencione los tres estados de la materia.", answer: "Sólido, líquido y gaseoso", wrong1: "Grande, pequeño y mediano", wrong2: "Duro, suave y blando" },
    { question: "Es la capacidad que tienen los cuerpos para realizar un trabajo o desempeñar una función.", answer: "Energía", wrong1: "Fuerza", wrong2: "Poder" },
    { question: "Es la energía producida por la fuerza del viento.", answer: "Energía eólica", wrong1: "Energía solar", wrong2: "Energía del viento" },
    { question: "Es el tipo de energía que se obtiene directamente de la luz y el calor del sol.", answer: "Energía solar", wrong1: "Energía eólica", wrong2: "Energía nuclear" }
];

let currentQuestionIndex = 0;
const questionBox = document.getElementById('question-box');
const answerButtons = document.querySelectorAll('.answer-button');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const modalCloseBtn = document.getElementById('modal-close');

// Función para mezclar un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Función para mostrar el modal
function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = 'flex';
}

// Función para ocultar el modal
function hideModal() {
    modal.style.display = 'none';
}

modalCloseBtn.addEventListener('click', hideModal);

// Carga la siguiente pregunta
function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showModal('¡Felicidades! ¡Has completado el juego! 🎉');
        currentQuestionIndex = 0; // Reiniciar el juego
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionBox.textContent = currentQuestion.question;

    const options = [currentQuestion.answer, currentQuestion.wrong1, currentQuestion.wrong2];
    shuffleArray(options);

    answerButtons.forEach((button, index) => {
        button.textContent = options[index];
        button.classList.remove('bg-green-500', 'bg-red-500', 'animate-pulse', 'animate-shake');
        button.classList.add(index % 2 === 0 ? 'bg-pink-400' : 'bg-purple-400');
    });
}

// Maneja la selección de respuesta
answerButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedAnswer = e.target.textContent;
        const currentQuestion = questions[currentQuestionIndex];
        
        answerButtons.forEach(btn => btn.disabled = true);

        if (selectedAnswer === currentQuestion.answer) {
            button.classList.remove('bg-pink-400', 'bg-purple-400', 'hover:bg-pink-500', 'hover:bg-purple-500');
            button.classList.add('bg-green-500', 'animate-pulse');

            setTimeout(() => {
                showModal('¡Correcto! ¡Avanza a la siguiente pregunta! ✅');
                currentQuestionIndex++;
                setTimeout(() => {
                    hideModal();
                    loadQuestion();
                    answerButtons.forEach(btn => btn.disabled = false);
                }, 1500);
            }, 800);
            
        } else {
            button.classList.remove('bg-pink-400', 'bg-purple-400', 'hover:bg-pink-500', 'hover:bg-purple-500');
            button.classList.add('bg-red-500', 'animate-shake');
            
            showModal('¡Incorrecto! Inténtalo de nuevo. ❌');

            setTimeout(() => {
                hideModal();
                button.classList.remove('bg-red-500', 'animate-shake');
                button.classList.add(e.target.classList.contains('bg-pink-400') ? 'bg-pink-400' : 'bg-purple-400');
                answerButtons.forEach(btn => btn.disabled = false);
            }, 1500);
        }
    });
});

// Cargar la primera pregunta al inicio
loadQuestion();