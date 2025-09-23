/* Datos: preguntas y respuestas (20) */
const pairs = [
    { q: "¿Cómo se le llama al conjunto que tienen la misma cantidad de elementos?", a: "Conjuntos equivalentes" },
    { q: "Es un grupo o reunión de objetos que tienen algo en común. Para nombrarlos se utilizan letras mayúsculas.", a: "Conjunto" },
    { q: "Se utiliza para escribir en orden los números", a: "Recta numérica" },
    { q: "¿Cómo se le llama a un grupo de 10 unidades?", a: "Decena" },
    { q: "¿Cómo se le llama a un grupo de 100 unidades?", a: "Centena" },
    { q: "Es el valor propio de un número, por su figura y la cantidad que representa.", a: "Valor absoluto" },
    { q: "Es el valor que tiene un número según el lugar que ocupa en la cantidad, unidades, decenas o centenas.", a: "Valor relativo" },
    { q: "¿Cómo se les llama a los números en los cuales se indica orden?", a: "Números ordinales" },
    { q: "¿Cómo se le llama al sistema de numeración en la cual se utilizan letras?", a: "Números Romanos" },
    { q: "Es una operación que indica cuántos elementos hay cuando se unen dos cantidades.", a: "Adición" },
    { q: "Es una operación que indica cuando queda después de quitar una cantidad de otra.", a: "Sustracción" },
    { q: "¿Cómo se llama cuando agrupas de dos en dos y no sobra?", a: "Números pares" },
    { q: "Es un número que se obtiene al dividir un entero en partes iguales.", a: "Fracciones" },
    { q: "Es una forma abreviada de realizar una adición de sumandos iguales.", a: "Multiplicación" },
    { q: "Es una operación que consiste en repartir en partes iguales una cantidad.", a: "División" },
    { q: "Mide la estatura, el largo del pizarrón, la altura de la puerta del salón de clases o el ancho de la calle.", a: "Medidas de longitud" },
    { q: "Establece la cantidad de materia que contiene un cuerpo.", a: "Medidas de masa" },
    { q: "Parte de matemática que estudia la forma de los objetos.", a: "Geometría" },
    { q: "Como el cuadrado y el rectángulo tienen 4 lados rectos.", a: "Cuadrilátero" },
    { q: "No es un polígono, el contorno de la figura se llama circunferencia.", a: "Círculo" }
];

/* DOM */
const leftList = document.getElementById('leftList');
const rightList = document.getElementById('rightList');
const scoreBox = document.getElementById('scoreBox');
const resetBtn = document.getElementById('resetBtn');
const revealBtn = document.getElementById('revealBtn');
const board = document.getElementById('board');
const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');
// Modal DOM
const modalContainer = document.getElementById('modalContainer');
const modalText = document.getElementById('modalText');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');

/* estado */
let leftItems = [];
let rightItems = [];
let selectedLeft = null;
let score = 0;
let lines = []; // {fromId,toId,color}

/* util: mezclar */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}

/* configurar canvas tamaño */
function resizeCanvas() {
    canvas.width = board.offsetWidth;
    canvas.height = board.offsetHeight;
    drawAllLines();
}
window.addEventListener('resize', () => { setTimeout(resizeCanvas, 60); });

/* crear listas */
function initGame() {
    // reset
    leftList.innerHTML = '';
    rightList.innerHTML = '';
    selectedLeft = null;
    score = 0;
    lines = [];
    scoreBox.textContent = `Acertadas: ${score} / ${pairs.length}`;
    revealBtn.disabled = false;

    // prepare arrays
    const leftArr = pairs.map((p, i) => ({ id: 'L' + i, text: p.q, matchId: 'R' + i }));
    const rightArr = pairs.map((p, i) => ({ id: 'R' + i, text: p.a, matchId: 'L' + i }));
    shuffle(leftArr);
    shuffle(rightArr);
    leftItems = leftArr;
    rightItems = rightArr;

    // render left
    leftArr.forEach(item => {
        const el = document.createElement('div');
        el.className = 'item';
        el.id = item.id;
        el.innerHTML = `<div class="index">${parseInt(item.id.slice(1)) + 1}</div><div class="content">${item.text}</div>`;
        el.addEventListener('click', () => leftClicked(item.id));
        leftList.appendChild(el);
    });

    // render right
    rightArr.forEach(item => {
        const el = document.createElement('div');
        el.className = 'item';
        el.id = item.id;
        el.innerHTML = `<div class="content">${item.text}</div><div class="index">${parseInt(item.id.slice(1)) + 1}</div>`;
        el.addEventListener('click', () => rightClicked(item.id));
        rightList.appendChild(el);
    });
    resizeCanvas();
}

/* obtener centro absoluto de un elemento relativo al board container */
function centerOf(el) {
    const rect = el.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    return {
        x: rect.left - boardRect.left + rect.width / 2,
        y: rect.top - boardRect.top + rect.height / 2
    };
}

/* dibujo */
function drawLine(fromPt, toPt, color, width = 6, dash = false) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    if (dash) ctx.setLineDash([8, 8]); else ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(fromPt.x, fromPt.y);
    // curve for a nicer look
    const dx = (toPt.x - fromPt.x);
    const dy = (toPt.y - fromPt.y);
    const cx1 = fromPt.x + dx * 0.35;
    const cy1 = fromPt.y;
    const cx2 = toPt.x - dx * 0.35;
    const cy2 = toPt.y;
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, toPt.x, toPt.y);
    ctx.stroke();
    ctx.restore();
}

function drawAllLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(ln => {
        const elFrom = document.getElementById(ln.fromId);
        const elTo = document.getElementById(ln.toId);
        if (!elFrom || !elTo) return;
        const p1 = centerOf(elFrom);
        const p2 = centerOf(elTo);
        drawLine(p1, p2, ln.color, 7);
    });
}

/* handlers */
function leftClicked(id) {
    const el = document.getElementById(id);
    if (!el) return;
    
    // Check if it's already a correct pair
    const isCorrectlyPaired = lines.some(line => (line.fromId === id || line.toId === id) && line.color === '#2ecc71');
    if (isCorrectlyPaired) return;

    if (selectedLeft === id) {
        // Deselect
        el.style.outline = '3px solid transparent';
        el.style.transform = 'scale(1)';
        selectedLeft = null;
    } else {
        // Deselect previous if exists
        if (selectedLeft) {
            const prev = document.getElementById(selectedLeft);
            if (prev) {
                prev.style.outline = '3px solid transparent';
                prev.style.transform = 'scale(1)';
            }
        }
        selectedLeft = id;
        el.style.outline = '3px solid #ff5c8a';
        el.style.transform = 'scale(1.02)';
    }
}

function rightClicked(id) {
    const el = document.getElementById(id);
    if (!el) return;
    
    // Check if it's already a correct pair
    const isCorrectlyPaired = lines.some(line => (line.fromId === id || line.toId === id) && line.color === '#2ecc71');
    if (isCorrectlyPaired) return;

    if (!selectedLeft) {
        el.style.animation = 'shake 600ms ease';
        setTimeout(() => el.style.animation = 'none', 500);
        return;
    }

    const leftItem = leftItems.find(item => item.id === selectedLeft);
    if (leftItem && leftItem.matchId === id) {
        // Correct match
        const leftEl = document.getElementById(selectedLeft);
        const rightEl = el;

        // Add permanent line (green)
        lines.push({ fromId: selectedLeft, toId: id, color: '#2ecc71' });
        score++;
        scoreBox.textContent = `Acertadas: ${score} / ${pairs.length}`;
        drawAllLines();

        // Visual feedback
        leftEl.style.animation = 'pop 600ms ease';
        rightEl.style.animation = 'pop 600ms ease';
        setTimeout(() => {
            leftEl.style.animation = 'none';
            rightEl.style.animation = 'none';
            leftEl.style.opacity = '0.45';
            rightEl.style.opacity = '0.45';
        }, 600);
        
        // Deselect and disable
        leftEl.style.outline = '3px solid transparent';
        leftEl.style.transform = 'scale(1)';
        leftEl.style.pointerEvents = 'none';
        rightEl.style.pointerEvents = 'none';
        selectedLeft = null;
        
        if (score === pairs.length) {
            showModal('¡Felicidades! Has unido todas las parejas. Puntaje: ' + score + '/' + pairs.length, false);
        }
    } else {
        // Incorrect match
        const fromEl = document.getElementById(selectedLeft);
        const toEl = el;
        const p1 = centerOf(fromEl);
        const p2 = centerOf(toEl);
        
        drawAllLines();
        drawLine(p1, p2, '#ff595e', 7, true); // Temporary red dashed line
        
        fromEl.style.animation = 'shake 600ms ease';
        toEl.style.animation = 'shake 600ms ease';
        
        setTimeout(() => {
            fromEl.style.animation = 'none';
            toEl.style.animation = 'none';
            drawAllLines();
        }, 700);
    }
}

/* reveal answers: connect all correctly and disable items */
function revealAll() {
    lines = [];
    pairs.forEach((p, i) => {
        const qItem = leftItems.find(item => item.text === p.q);
        const aItem = rightItems.find(item => item.text === p.a);
        if (qItem && aItem) {
            const leftEl = document.getElementById(qItem.id);
            const rightEl = document.getElementById(aItem.id);
            if (leftEl) { leftEl.style.opacity = '0.45'; leftEl.style.pointerEvents = 'none'; }
            if (rightEl) { rightEl.style.opacity = '0.45'; rightEl.style.pointerEvents = 'none'; }
            lines.push({ fromId: qItem.id, toId: aItem.id, color: '#7ac7ff' });
        }
    });
    score = pairs.length;
    scoreBox.textContent = `Acertadas: ${score} / ${pairs.length}`;
    revealBtn.disabled = true;
    drawAllLines();
}

/* Modal Functions */
function showModal(message, isConfirm) {
    modalText.textContent = message;
    modalContainer.classList.add('visible');
    modalContent.style.transform = 'translateY(-20px)';
    
    if (isConfirm) {
        modalCancelBtn.textContent = 'No';
        modalConfirmBtn.style.display = 'inline-block';
    } else {
        modalCancelBtn.textContent = 'Ok';
        modalConfirmBtn.style.display = 'none';
    }
}

function hideModal() {
    modalContainer.classList.remove('visible');
    modalContent.style.transform = 'translateY(-50px)';
}

/* Event Listeners */
resetBtn.addEventListener('click', () => {
    showModal('¿Desea reiniciar el juego? Todo el progreso se perderá.', true);
    modalConfirmBtn.onclick = () => {
        initGame();
        hideModal();
    };
    modalCancelBtn.onclick = hideModal;
});

revealBtn.addEventListener('click', () => {
    showModal('¿Desea mostrar las respuestas y terminar el juego?', true);
    modalConfirmBtn.onclick = () => {
        revealAll();
        hideModal();
    };
    modalCancelBtn.onclick = hideModal;
});

modalCancelBtn.addEventListener('click', hideModal);

/* iniciar */
initGame();
window.onload = resizeCanvas;