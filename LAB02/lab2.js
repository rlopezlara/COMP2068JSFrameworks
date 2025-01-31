
//calling the prompt module
const prompt = require('prompt');

//function to generate a random choice for the computer Statistical required
function computerSelection() {
    // Generate a number between 0 and 1
    let randomComputerSelection = Math.random(); 
    // 0.34 = 34% chance of selecting paper
    if (randomComputerSelection <= 0.34) {
        return 'paper';
    // 0.67 = 33% chance of selecting scissors
    } else if (randomComputerSelection <= 0.67) {
        return 'scissors';
    // 1.0 = 33% chance of selecting rock
    } else {
        return 'rock';
    }
}
//function to determine the winner with all the possible options
function whoWin(userSelection, computerSelection) {
    // If the user and computer selections are the same, it's a tie
    if (userSelection === computerSelection) {
        return "It's a tie!";
    }
    // If the user wins, return "User Wins!"
    if (
        (userSelection === 'rock' && computerSelection === 'scissors') ||
        (userSelection === 'scissors' && computerSelection === 'paper') ||
        (userSelection === 'paper' && computerSelection === 'rock')
    ) {
        return "User Wins!";
        
        // otherwise the computer wins, return "Computer Wins!"
    } else {
        return "Computer Wins!";
    }
    
}

//function to start the game
function startTheGame() {
// Start the prompt
console.log("Enter rock, paper, or scissors:"); 
// Get the user's selection
prompt.get(['selection'], function (err, result) {
    // Log the user's selection
    if (err) {
        console.error(err);
        return;
    }
    // Convert the user's selection to lowercase
    const userSelection = result.selection.toLowerCase();
    // Check if the user's selection is valid
    const validSelection = ['rock', 'paper', 'scissors'];
    // If the user's selection is not valid, log an error and restart the game
    if (userSelection !== validSelection[0] && userSelection !== validSelection[1] && userSelection !== validSelection[2]) {
        console.log("Invalid selection! type the correct option.");
        startTheGame();
        return;
    }
    // Get the computer's selection
    const computerChoice = computerSelection();
    // Log the user and computer selections amd the winner result
    console.log(`User Selection: ${userSelection}`);
    console.log(`Computer Selection: ${computerChoice}`);
    console.log(whoWin(userSelection, computerChoice));
});
}
// Start the prompt
prompt.start();
// Start the game
startTheGame();