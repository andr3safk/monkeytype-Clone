const $time = document.querySelector('time');
const $paragraph = document.querySelector('p');
const $input = document.querySelector('input');

const INITIAL_TIME = 30;

const TEXT = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit similique aperiam reiciendis rerum facilis nisi eveniet, quos inventore quam optio laudantium blanditiis. Harum quis quia explicabo eos praesentium, dolorum velit!'

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
        .join('')
      }
    </word>`
  }).join('')

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

function initEvents() {}

function gameOver() {}
