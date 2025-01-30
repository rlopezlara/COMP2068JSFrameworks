const prompt = require('prompt');

function ComputerChoice() {
    // Generate a number between 0 and 1
    let randomNum = Math.random(); 
    if (randomNum <= 0.34) {
        return 'paper';
    } else if (randomNum <= 0.67) {
        return 'scissors';
    } else {
        return 'rock';
    }
}

function whoWin(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return "It's a tie!";
    }

    if (
        (userChoice === 'rock' && computerChoice === 'scissors') ||
        (userChoice === 'scissors' && computerChoice === 'paper') ||
        (userChoice === 'paper' && computerChoice === 'rock')
    ) {
        return "User Wins!";
    } else {
        return "Computer Wins!";
    }
}


function getUserChoice() {

console.log("Enter rock, paper, or scissors:"); 

prompt.get(['choice'], function (err, result) {
    if (err) {
        console.error(err);
        return;
    }

    const userChoice = result.choice.toLowerCase();
    const validChoices = ['rock', 'paper', 'scissors'];

    if (!validChoices.includes(userChoice)) {
        console.log("Invalid choice! Please choose rock, paper, or scissors.");
        getUserChoice();
        return;
    }

    const computerChoice = ComputerChoice();
    
    console.log(`User Selection: ${userChoice}`);
    console.log(`Computer Selection: ${computerChoice}`);
    console.log(whoWin(userChoice, computerChoice));
});
}
prompt.start();
getUserChoice();