const $time = document.querySelector('time');
const $paragraph = document.querySelector('p');
const $input = document.querySelector('input');

const INITIAL_TIME = 30;

const TEXT = 'lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit similique aperiam reiciendis rerum facilis nisi eveniet, quos inventore quam optio laudantium blanditiis. Harum quis quia explicabo eos praesentium, dolorum velit!'

let words = [];
let currentTime = INITIAL_TIME;

initGame();
initEvents();

function initGame() {
  const textContent = $paragraph.textContent;
  words = TEXT.split(' ').slice(0, 32);
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

function gameOver () {}