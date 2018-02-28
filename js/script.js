// Simon Game webapp functionality
// M Allen: Freelance Web Developer - 2017

// Setup global scope variables

// Game state variables
var gameOnState = false;
var gameStart = false;
var gameStarting = false;
var strictState = false;
var playerTurn = false;
var playerCanPressButton = true;

// Normal button colours
var startBtnPlain = "#E60000";
var strictBtnPlain = "#FFFF00";
var greenBtnPlain = "green";
var redBtnPlain = "red";
var blueBtnPlain = "blue";
var yellowBtnPlain = "yellow";

// Button flash colours
var startBtnFlash = "#FECCCE, #D51E27";
var strictBtnFlash = "#FCFDCB, #928300";
var greenBtnFlash = "#E2FDCB, #316D01";
var redBtnFlash = "#FDD5CB, #7C1402";
var blueBtnFlash = "#CBDEFD, #02317D";
var yellowBtnFlash = "#FCFDCB, #928300";

// Game play sounds
var greenBtnSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
var redBtnSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
var blueBtnSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
var yellowBtnSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
var successSound = new Audio("./media/ding.mp3");
var failSound = new Audio("./media/failbuzzer.mp3");
var winSound = new Audio("./media/winner.mp3");

// Game play variables
var playerStepCount;
var score;
var sequenceArray;
var displayScore;

// Populate array with random sequence of 20 colours
function populateArray() {
  sequenceArray = [];
  for (i=0; i < 20; i++) {
    var randomNumber = Math.floor(Math.random() * 4);
    switch (randomNumber) {
      case 0:
        sequenceArray.push("green");
        break;
      case 1:
        sequenceArray.push("red");
        break;
      case 2:
        sequenceArray.push("blue");
        break;
      case 3:
        sequenceArray.push("yellow");
        break;
    }
  }
}

// Reset game to game beginning run state
function resetGame() {
  score = 1;
  playerStepCount = 0;
  gameStart = true;
  playerTurn = false;
  populateArray();
}

// Make selected button flash with sound on button click
function flashButton(buttonID) {
   playerCanPressButton = false;
  // Change button background to flash colour
  $("#" + buttonID).css("background", "radial-gradient(circle, " + eval(buttonID + "Flash") + ")");
  if (buttonID == "greenBtn" || buttonID == "redBtn" || buttonID == "blueBtn" || buttonID == "yellowBtn") {
    eval(buttonID + "Sound").play();
  }
  // After delay reset button background colour to normal
  setTimeout(function (){
    $("#" + buttonID).css("background", eval(buttonID + "Plain").toString());
    playerCanPressButton = true;
  }, 500);
}

// Show pattern up to current move point (score)
function showPattern() {
  var sequenceElementColour;
  // Disable player moves while sequence is displayed
  playerTurn = false;
  // Enable player to move once moves are displayed
  setTimeout(function() {
    playerTurn = true;
  }, (1000 * score) + 500);
  // Cycle through each element of the array up to current game point and flash the button with a delay for each
  var cycleStepCount = 1;
  var cycle = setInterval(function() {
    sequenceElementColour = sequenceArray[cycleStepCount - 1].toString() + "Btn";
    flashButton(sequenceElementColour);
    cycleStepCount++;
    // When sequence up to current game point is reached cancel repeating interval
    if (cycleStepCount > score) {
      clearInterval(cycle);
      cycleStepCount = 1;
    }
  }, 1000);
}

// Game play logic
function gamePlay(button) {
  // Check sequence entry
  // If button clicked matched current element in sequence
  if (button == sequenceArray[playerStepCount].toString()) {
    playerStepCount++;
    // On entry of a matching sequence ...
    if ((playerStepCount + 1) > score) {
      // Play success sound and increment score
      successSound.play();
      score++;
      // Game win if score is now greater than 20 - disable game play, play win sound and display "Win!"
      if (score > 20) {
        playerTurn = false;
        gameStart = false;
        winSound.play();
        $("#score").html("Win!");
      }
      // If game is not over
      if (gameStart) {
        // Display current score with leading "0" if required and show pattern
        if (score < 10) {
          displayScore = "0" + score.toString();
        } else {
          displayScore = score.toString();
        }
        $("#score").html(displayScore);
        playerStepCount = 0;
        showPattern();
      }
    }
  // If clicked button doesn't match current step in the sequence or when game first starts ...
  } else {
    if (!gameStarting) {  // This is not the beginning of game before pattern has first been shown
      failSound.play();
    }
    // If strict setting is on
    if (strictState && !gameStarting) {
      resetGame();
      $("#score").html("01");
      gameStarting = true;
      gamePlay();
    }
    gameStarting = false;
    playerStepCount = 0;
    showPattern();
  }
}

// Enable functionality when document has loaded
$(document).ready(function() {
  // Behaviour is driven by button clicks ...
  // On/Off switch behaviour
  $("#onButton").on("click", function() {
    gameOnState = !gameOnState;
    if (gameOnState) {
      // Move switch to right, change display background colour, show "--" in display and reset game state
      $("#onBtn").css("left", "1.6vw");
      $("#scoreboard").css("background", "#054701");
      $("#score").html("--");
    } else {
      // Move switch to left, clear game state, clear display and change display background colour
      $("#onBtn").css("left", "0.18vw");
      gameStart = false;
      strictState = false;
      $("#score").html("");
      $("#scoreboard").css("background", "#63393E");
      $("#startBtn").css("background","#E60000");
      $("#light").css("background", "#000000");
      $("#strictBtn").css("background","#FFFF00");
    }
  });
  // Start/Restart button
  $("#startButton").on("click", function() {
    if (gameOnState) {
      flashButton("startBtn");
      resetGame();
      $("#score").html("01");
      gameStarting = true;
      gamePlay();
    }
  });
  // Strict button
  $("#strictButton").on("click", function() {
    if (gameOnState) {
      strictState = !strictState;
      flashButton("strictBtn");
      if (strictState) {
        $("#light").css("background", "#E60000");
      } else {
        $("#light").css("background", "#000000");
      }
    }
  });
  // Setup colour buttons
  $("#greenBtn").on("click", function() {
    if (gameOnState && gameStart && playerTurn && playerCanPressButton) {
      flashButton("greenBtn");
      gamePlay("green");
    }
  });
  $("#redBtn").on("click", function() {
    if (gameOnState && gameStart && playerTurn && playerCanPressButton) {
      flashButton("redBtn");
      gamePlay("red");
    }
  });
  $("#blueBtn").on("click", function() {
    if (gameOnState && gameStart && playerTurn && playerCanPressButton) {
      flashButton("blueBtn");
      gamePlay("blue");
    }
  });
  $("#yellowBtn").on("click", function() {
    if (gameOnState && gameStart && playerTurn && playerCanPressButton) {
      flashButton("yellowBtn");
      gamePlay("yellow");
    }
  });
});
