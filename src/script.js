import { words as INITIAL_WORDS } from './words.js'
const $time = document.querySelector('time');
const $paragraph = document.querySelector('p');
const $input = document.querySelector('input');
const $game = document.querySelector('#game');
const $results = document.querySelector('#results');
const $wpm = document.querySelector('h3');
const $accuracy = document.querySelector('h3:last-child')

const INITIAL_TIME = 30;

let words = [];
let currentTime = INITIAL_TIME;

initGame();
initEvents();

function initGame() {
  words = INITIAL_WORDS.toSorted(
    () => Math.random() - 0.5
  ).slice(0, 32);
  
  currentTime = INITIAL_TIME;

  $time.textContent = currentTime;

  $paragraph.innerHTML = words.map((word, index) => {
    const letters = word.split('')

    return `<word>
      ${letters
        .map(letter => `<letter>${letter}</letter>`)
        .join('')}</word>`
  }).join(' ')

  const $firstWord = $paragraph.querySelector('word')
  $firstWord.classList.add('active')
  $firstWord.querySelector('letter').classList.add('active')


  const intervalID = setInterval(()=>{
    currentTime--
    $time.textContent = currentTime

    if (currentTime === 0) {
      clearInterval(intervalID)
      gameOver()
    }
  }, 1000)
}

function initEvents() {
  document.addEventListener('keydown', () =>{
    $input.focus()
  })

  $input.addEventListener('keydown', onKeyDown)
  $input.addEventListener('keyup', onKeyUp)
}

function onKeyDown (event) {

  const $currentWord = $paragraph.querySelector('word.active')
  const $currentLetter = $currentWord.querySelector('letter.active')

  const { key } = event
  if (key === ' '){
    event.preventDefault()

    const $nextWord = $currentWord.nextElementSibling
    const $nextLetter = $nextWord.querySelector('letter')

    $currentWord.classList.remove('active', 'marked')
    $currentLetter.classList.remove('active')

    $nextWord.classList.add('active')
    $nextLetter.classList.add('active')

    $input.value = ''

    const hasMisedLetters = $currentWord.querySelectorAll('letter:not(.correct)').length > 0
    
    const classToAdd = hasMisedLetters ? 'marked' : 'correct'
    $currentWord.classList.add(classToAdd)
    return
  }
  if (key === 'Backspace'){
    const $prevWord = $currentWord.previousElementSibling
    const $prevLetter = $currentLetter.previousElementSibling

    if (!$prevWord && !$prevLetter){
      event.preventDefault()
      return
    }

    const $wordMarked = $paragraph.querySelector('word.marked')
    if($wordMarked && !$prevLetter){
      event.preventDefault()
      $prevWord.classList.remove('marked')
      $prevWord.classList.add('active')

      const $letterToGo = $prevWord.querySelector('letter:last-child')

      $currentLetter.classList.remove('active')
      $letterToGo.classList.add('active')

      $input.value = [
        ...$prevWord.querySelectorAll('letter.correct, letter.incorrect')
      ].map($el => {
        return $el.classList.contains('correct') ? $el.innerHTML : '*'
      })
        .join('')
    }  
  }
}

function onKeyUp () {
  const $currentWord = $paragraph.querySelector('word.active')
  const $currentLetter = $currentWord.querySelector('letter.active')

  const currentWord = $currentWord.innerText.trim()
  $input.maxLength = currentWord.length

  console.log({value: $input.value, currentWord})

  const $allLetters = $currentWord.querySelectorAll('letter')

  $allLetters.forEach($letter => $letter.classList.remove('correct', 'incorrect'))

  $input.value.split('').forEach((char, index) => {
    const $letter = $allLetters[index]
    const letterToCheck = currentWord[index]

    const isCorrect = char === letterToCheck
    const letterClass = isCorrect ? 'correct' : 'incorrect'
    $letter.classList.add(letterClass)
  })

  $currentLetter.classList.remove('active', 'is-last')
  const inputLenght = $input.value.length
  const $newActiveLetter = $allLetters[inputLenght]

  if ($newActiveLetter){
    $allLetters[inputLenght].classList.add('active')
  }else {
    $currentLetter.classList.add('active', 'is-last')
  }

}

function gameOver () {

  $game.style.display = 'none';
  $results.style.display = 'flex';

  const correctWords = $paragraph.querySelectorAll('word.correct').length;
  const correctLetters = $paragraph.querySelectorAll('letter.correct').length;
  const incorrectLetters = $paragraph.querySelectorAll('letter.incorrect').length;
  const totalLetters = correctLetters + incorrectLetters;

  const accuracy = totalLetters > 0
    ? (correctLetters / totalLetters) * 100
    : 0;

  const wpm = (correctWords / INITIAL_TIME) * 60

  $wpm.textContent = wpm.toFixed(2)
  $accuracy.textContent = `${accuracy.toFixed(2)}%`
}