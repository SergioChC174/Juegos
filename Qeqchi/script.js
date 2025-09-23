// Pares de palabras para el juego.
const pairs = [
    { es: 'avión', q: 'So sol chiich' },
    { es: 'mono', q: 'Max' },
    { es: 'cantar', q: 'B\'ichank' },
    { es: 'mariposa', q: 'Peepem' },
    { es: 'pescado', q: 'Kar' },
    { es: 'culebra', q: 'kant\'i' },
    { es: 'nos vemos', q: 'Inwan' },
    { es: 'gracias', q: 'b\'antiox' },
    { es: 'Uno', q: 'Jun' },
    { es: 'Tres', q: 'oxib\'' },
    { es: 'cuatro', q: 'kaahib\'' },
    { es: 'sombrero', q: 'punit' },
    { es: 'zapato', q: 'xaab\'' },
    { es: 'mamá', q: 'na\'' },
    { es: 'carro', q: 'Belebalchiich' },
    { es: 'barco', q: 'Jukub' },
    { es: 'bicicleta', q: 'Baq laq chiich' },
    { es: 'verano', q: 'saqehil' },
    { es: 'Invierno', q: 'habalqe' },
    { es: 'Nos vemos más tarde', q: 'Jokuan chik' }
];

// Elementos del DOM
const espanolColumn = document.getElementById('espanol-column');
const qeqchiColumn = document.getElementById('qeqchi-column');
const messageEl = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score-display');

if (!espanolColumn || !qeqchiColumn || !messageEl || !restartButton || !scoreDisplay) {
    throw new Error('Uno o más elementos del DOM no existen. Verifica los IDs en tu HTML.');
}

// Variables de estado del juego
let selectedCards = [];
let matchedPairs = 0;
let canSelect = true;
let score = 0;

// Algoritmo de barajado Fisher-Yates
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para actualizar el marcador
function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}

// Función para crear el tablero de juego
function createBoard() {
    espanolColumn.innerHTML = '';
    qeqchiColumn.innerHTML = '';
    messageEl.textContent = '';
    restartButton.style.display = 'none'; // Oculta el botón usando style.display
    selectedCards = [];
    matchedPairs = 0;
    score = 0;
    updateScoreDisplay();

    const espanolWords = shuffle(pairs.map(p => ({ value: p.es, matchValue: p.es })));
    const qeqchiWords = shuffle(pairs.map(p => ({ value: p.q, matchValue: p.es })));

    // Rellenar la columna de español
    espanolWords.forEach(cardData => {
        const card = document.createElement('div');
        card.classList.add('card', 'bg-purple-200', 'hover:bg-purple-300', 'transition-colors', 'duration-200', 'rounded-xl', 'text-xl', 'font-bold', 'text-gray-700', 'p-4', 'text-center', 'cursor-pointer', 'select-none', 'shadow-sm');
        card.textContent = cardData.value;
        card.dataset.matchValue = cardData.matchValue;
        card.dataset.type = 'espanol';
        card.addEventListener('click', selectCard);
        espanolColumn.appendChild(card);
    });

    // Rellenar la columna de Q'eqchi'
    qeqchiWords.forEach(cardData => {
        const card = document.createElement('div');
        card.classList.add('card', 'bg-purple-200', 'hover:bg-purple-300', 'transition-colors', 'duration-200', 'rounded-xl', 'text-xl', 'font-bold', 'text-gray-700', 'p-4', 'text-center', 'cursor-pointer', 'select-none', 'shadow-sm');
        card.textContent = cardData.value;
        card.dataset.matchValue = cardData.matchValue;
        card.dataset.type = 'qeqchi';
        card.addEventListener('click', selectCard);
        qeqchiColumn.appendChild(card);
    });
}

// Función para manejar la selección de tarjetas
function selectCard() {
    if (!canSelect || this.classList.contains('selected') || this.classList.contains('matched')) return;

    if (selectedCards.length > 0 && selectedCards[0].dataset.type === this.dataset.type) {
        selectedCards[0].classList.remove('selected', 'bg-purple-500', 'text-white');
        selectedCards = [];
    }

    this.classList.add('selected', 'bg-purple-500', 'text-white');
    selectedCards.push(this);

    if (selectedCards.length === 2) {
        canSelect = false;
        checkMatch();
    }
}

// Función para verificar si las dos tarjetas seleccionadas coinciden
function checkMatch() {
    const [card1, card2] = selectedCards;

    if (card1.dataset.matchValue === card2.dataset.matchValue) {
        messageEl.textContent = '¡Pareja encontrada! 🎉';
        score += 10;
        setTimeout(() => {
            messageEl.textContent = '';
            card1.classList.add('matched', 'opacity-0', 'transition-opacity', 'duration-500', 'pointer-events-none');
            card2.classList.add('matched', 'opacity-0', 'transition-opacity', 'duration-500', 'pointer-events-none');

            card1.classList.remove('selected', 'bg-purple-500', 'text-white');
            card2.classList.remove('selected', 'bg-purple-500', 'text-white');

            matchedPairs++;
            selectedCards = [];
            canSelect = true;
            updateScoreDisplay();

            if (matchedPairs === pairs.length) {
                messageEl.textContent = '¡Felicidades Ian! 🎉';
                restartButton.style.display = 'block'; // Muestra el botón usando style.display
            }
        }, 800);
    } else {
        messageEl.textContent = '¡Incorrecto! 😞';
        score -= 5;
        setTimeout(() => {
            messageEl.textContent = '';
            card1.classList.remove('selected', 'bg-purple-500', 'text-white');
            card2.classList.remove('selected', 'bg-purple-500', 'text-white');
            selectedCards = [];
            canSelect = true;
            updateScoreDisplay();
        }, 1000);
    }
}

// Añade el evento de clic al botón de reinicio
restartButton.addEventListener('click', createBoard);

// Inicializar el juego cuando la página se carga
createBoard();