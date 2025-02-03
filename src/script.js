const $time = document.querySelector('time');
const $paragraph = document.querySelector('p');
const $input = document.querySelector('input');

const INITIAL_TIME = 30;

let words = [];
let currentTime = INITIAL_TIME;

async function loadWords() {
  try{
    const response = await fetch("./src/words.json");
    const data = await response.json();
    words = data.words;
    displayWords();

  }catch (error){
    console.error("Error al cargar las palabras:", error);
  };
};

function getRandom(count){
  const shuffled = words.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function displayWords() {
  if (words.length > 0) {
    const selectedWords = getRandomWords(32);
    $paragraph.textContent = selectedWords.join(" ");
  } else {
    $paragraph.textContent = "No hay palabras disponibles.";
  }
}

loadWords()
