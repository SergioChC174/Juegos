// Preguntas y respuestas
const questions = [
  { q: "Es contar una serie de acciones que pueden suceder en la vida real o ser imaginarias.", a: "Narración" },
  { q: "Grupo de sonidos que se pronuncian juntos en un solo golpe de voz.", a: "Sílaba" },
  { q: "Palabras que designan animales, cosas o plantas.", a: "Sustantivo" },
  { q: "Palabras que se usan para referirse a cualidades o características.", a: "Adjetivo calificativo" },
  { q: "Narración con animales que piensan y actúan como humanos.", a: "Fábula" },
  { q: "Canales que se usan para transmitir mensajes.", a: "Medios de comunicación" },
  { q: "Palabras que expresan lo mismo pero se escriben diferente.", a: "Sinónimos" },
  { q: "Palabras que expresan una acción.", a: "Verbo" },
  { q: "Palabras que expresan lo contrario de otra.", a: "Antónimos" },
  { q: "Sustantivos que expresan más de uno.", a: "Plurales" },
  { q: "Textos breves que buscan informar a un público no especializado.", a: "Textos expositivos" },
  { q: "Palabras que expresan que son de menor tamaño.", a: "Diminutivos" },
  { q: "Separa ideas dentro de un texto.", a: "Punto" },
  { q: "Interacción entre dos personas con preguntas y respuestas.", a: "Entrevista" },
  { q: "Palabras que describen las acciones del sujeto.", a: "Predicado" },
  { q: "Señalan características de personas, animales, objetos o lugares.", a: "Descripciones" },
  { q: "Expresan en singular una agrupación de elementos.", a: "Sustantivo colectivo" },
  { q: "Palabra con sílaba tónica en la última posición.", a: "Agudas" },
  { q: "Palabra con sílaba tónica en la penúltima posición.", a: "Graves" },
  { q: "Palabra con sílaba tónica en la antepenúltima posición.", a: "Esdrújulas" }
];

let score = 0;
let currentQ;
const answerZone = document.getElementById("answerZone");
const wordBank = document.getElementById("wordBank");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");

// Iniciar juego
function startGame() {
  score = 0;
  document.getElementById("score").textContent = "Puntos: 0";
  nextQuestion();
}

// Siguiente pregunta
function nextQuestion() {
  answerZone.innerHTML = "";
  wordBank.innerHTML = "";
  feedback.textContent = "";
  nextBtn.style.display = "none";

  currentQ = questions[Math.floor(Math.random() * questions.length)];
  document.getElementById("question").textContent = currentQ.q;

  let letters = currentQ.a.split("");
  letters.sort(() => Math.random() - 0.5);

  letters.forEach(letter => {
    let span = document.createElement("div");
    span.textContent = letter;
    span.classList.add("word", "bg-[#ffcc80]", "hover:bg-[#ff8c42]", "cursor-pointer", "select-none", "px-3", "py-2", "m-1", "rounded-md", "font-bold", "shadow-sm");
    span.addEventListener("click", selectLetter);
    wordBank.appendChild(span);
  });
}

// Seleccionar letra
function selectLetter(event) {
  const selectedLetter = event.target;

  selectedLetter.removeEventListener("click", selectLetter);
  answerZone.appendChild(selectedLetter);
  selectedLetter.classList.remove("hover:bg-[#ff8c42]", "cursor-pointer", "shadow-sm");
  selectedLetter.classList.add("bg-[#ff9800]", "text-white");

  checkAnswer();
}

// Verificar respuesta
function checkAnswer() {
  let formed = Array.from(answerZone.children).map(e => e.textContent).join("");

  if (formed === currentQ.a) {
    feedback.textContent = "✅ ¡Correcto!";
    feedback.style.color = "green";
    feedback.classList.add("correct");
    score += 10;
    document.getElementById("score").textContent = "Puntos: " + score;
    nextBtn.style.display = "inline-block";

    Array.from(answerZone.children).forEach(letterDiv => {
      letterDiv.removeEventListener("click", selectLetter);
    });
  } else if (formed.length >= currentQ.a.length) {
    feedback.textContent = "❌ Inténtalo de nuevo";
    feedback.style.color = "red";

    Array.from(answerZone.children).forEach(letterDiv => {
      wordBank.appendChild(letterDiv);
      letterDiv.addEventListener("click", selectLetter);
      letterDiv.classList.remove("bg-[#ff9800]", "text-white");
      letterDiv.classList.add("hover:bg-[#ff8c42]", "cursor-pointer", "shadow-sm");
    });

    answerZone.innerHTML = "";
  }
}

nextBtn.addEventListener("click", nextQuestion);

// Iniciar juego
startGame();
