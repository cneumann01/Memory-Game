const colorList = [
  'red',
  'darkorange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'pink',
  'black',
  'gray',
  'cyan',
  'purple',
  'teal',
  'lime',
  'navy',
  'maroon',
  'lavender',
  'peru',
  'salmon'
]

function colorGenerator(numberOfTiles) {
  let COLORS = [];
  for(color of shuffle(colorList).splice(0,numberOfTiles/2)){
    COLORS.push(color);
    COLORS.push(color);
  }
  return COLORS;
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
const gameContainer = document.getElementById("game");
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // Temporarily colors all game tiles at the start for testing
    // newDiv.style.backgroundColor = color;

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

let firstSelection = "";
let secondSelection = "";
let color1 = "";
let color2 = "";
let clickCounter = 0;
let score = 0;
let tilesFound = 0;

// TODO: Implement this function!
function handleCardClick(event) {
  // Checks if two cards are already selected.
  if (firstSelection === "" || secondSelection === "") {
    if (clickCounter === 0) {
      firstSelection = event.target.style;
      color1 = event.target.classList.value;
      firstSelection.backgroundColor = color1
      clickCounter++;
    } else {
      secondSelection = event.target.style;
      // Checks if the second card that's selected is the same as the first, and clears the second selection if it is.
      if (firstSelection !== secondSelection) {
        color2 = event.target.classList.value;
        secondSelection.backgroundColor = color2;
        clickCounter--;
        // Increments score after each pair of guesses.
        score++;
        document.querySelector(
          "h1"
        ).innerText = `Memory Game! --- Score: ${score}`;
        setTimeout(function () {
          // Checks if both guesses are the same color and a match was found.
          if (color1 === color2) {        
            // Removes click listener from the matched selections so they can't be selected again.
            for (node of document.querySelectorAll(`.${color1}`)) {
              node.removeEventListener("click", handleCardClick);
            }
            // Detects when the user has found all of the available matches.
            tilesFound += 2;
            if (tilesFound === parseInt(numberOfTiles)) {
              // Tracks the lowest score in localStorage, and updates it if the current game beats the existing record.
              let lowestScore = window.localStorage.getItem('lowestScore')
              if (lowestScore === null) {
                window.localStorage.setItem('lowestScore', score)
                lowestScore = score
              } else {
                if (score < parseInt(lowestScore)) {
                  console.log("new record")
                  window.localStorage.setItem('lowestScore', score)
                  lowestScore = score
                }
              }
              document.querySelector("h1").innerText = `Memory Game! --- You Won!\nYour final score is ${score}. The current record is ${lowestScore}!`;
            }
          } else {
            // Removes both guesses from the board if they don't match.
            firstSelection.backgroundColor = "";
            secondSelection.backgroundColor = "";
          }
          // Clears both selections from memory to prepare for the next set of guesses.
          firstSelection = "";
          secondSelection = "";
        }, 1000);
      } else {
        secondSelection = "";
      }
    }
  }
}

// Dynamically sets the game board width to be just enough space for the number of tiles the user selected.
function getBoardSizeDimensions(numberOfTiles) {
  const factors = []
  const dimensions = []
  const pixelsPerGameTileAndMargin = 175
  const gameBoard = document.querySelector("#game").style;
  let square = Math.sqrt(numberOfTiles);
  // If number of tiles can't divide into a perfect square, finds the two closest factors generating the most square like board.
  if (Number.isInteger(square) === false) {
    for(let i = 1; i <= numberOfTiles; i++) {
      if(numberOfTiles % i === 0) {
        factors.push(i)
      }
    }
    // Finds the two middle elements of the list of all possible factors.
    let sideX = factors[factors.length/2-1]
    let sideY = factors[factors.length/2]
    // Sets the game board width/height to the closest factors times the pixel constant.
    let widthPixels = `${sideX * pixelsPerGameTileAndMargin}px`
    let heightPixels = `${sideY * pixelsPerGameTileAndMargin}px`
    // Checks screen orientation and orients game board to match.
    if (visualViewport.width < visualViewport.height) {
      // Vertical layout.
      gameBoard.width = widthPixels
      gameBoard.height = heightPixels
    } else {
      // Horizontal layout.
      gameBoard.width = heightPixels
      gameBoard.height = widthPixels
    }
  } else {
    let widthPixels = `${square * pixelsPerGameTileAndMargin}px`
    gameBoard.width = widthPixels
    gameBoard.height = widthPixels
  }
}



// when the DOM loads
const slider = document.querySelector('input')
const label = document.querySelector('label')
const resetBtn = document.querySelector('#resetBtn')
const startBtn = document.querySelector('#startBtn')

slider.addEventListener('input', () => {
  label.innerText = `How many game tiles would you like?: ${slider.value}`
});

resetBtn.addEventListener('click', () => {
  location.reload()
});

startBtn.addEventListener('click', () => {
  numberOfTiles = slider.value
  label.remove()
  startBtn.remove()
  slider.remove()
  // Sets game board to proper dimensions.
  getBoardSizeDimensions(numberOfTiles)
  // Creates game board.
  createDivsForColors(shuffle(colorGenerator(numberOfTiles)))
});
/* */
