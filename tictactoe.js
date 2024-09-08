


// token will be either 'O' or 'X'.
function createPlayer(playerName, playerToken) {
    const name = playerName;
    const token = playerToken;
    const getPlayerName = () => playerName;
    const getToken = () => token;
    const setPlayerName = (playerName) => name = playerName;

    return { getPlayerName, getToken, setPlayerName };
}

const Gameboard = (() => {
    const board = [];
    const tokens = { 1: 'X', 2: 'O' };

    const setBoard = () => {
        for (let i = 0; i < 3; i++) {
            board[i] = [];
            for (let j = 0; j < 3; j++) {
                board[i][j] = '';
            }
        }
    }

    // for console mode
    const printBoard = () => {
        console.log('######');
        for (row of board) {
            console.log(row.join('|'));
        }
        console.log('######');
    }

    const handleMove = (move, player) => {
        move = move.split('');
        // check if move is legal
        if (board[move[0]][move[1]] != '') {
            return false;
        }
        board[move[0]][move[1]] = player.getToken();
        return true;
    }

    const getBoard = () => board;



    return { getBoard, handleMove, printBoard, setBoard };
})();


const gameController = (() => {

    const playerOne = createPlayer('playerOne', 'X');
    const playerTwo = createPlayer('playerTwo', 'O');
    let currentPlayer = playerOne;
    const board = Gameboard.getBoard();
    let numMoves = 0;
    let ongoing = false; // track game state
    let result = null;



    const startGame = () => {
        numMoves = 0;
        ongoing = true;
        Gameboard.setBoard();
        Gameboard.printBoard();
    }

    const getCurrentPlayer = () => currentPlayer;
    const getPlayers = () => [playerOne, playerTwo];

    const testWin = () => {
        // test rows
        for (row of board) {
            if (row[0] != '' && row[0] === row[1] && row[1] === row[2]) {
                displayController.displayMessage(`${currentPlayer} won!`);
                ongoing = false;
            }
        }

        // test columns
        for (let j = 0; j < 3; j++) {
            if (board[0][j] != '' && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
                displayController.displayMessage(`${currentPlayer} won!`);
                ongoing = false;
            }
        }

        // test diagnoals
        if ((board[0][0] != '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
            (board[0][2] != '' &&  board[0][2]=== board[1][1] && board[1][1] === board[2][0])) {
            
            displayController.displayMessage(`${currentPlayer} won!`);
            ongoing = false;
        }

        if (numMoves === 9) {
            displayController.displayMessage("It's a draw!");
            ongoing = false;
        }
    }

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === playerOne ? playerTwo : playerOne);
        displayController.toggleCurrentPlayer();
    }

    /* ONLY RELEVANT FOR CONSOLE VERSION
    const getMove = () => {

        while (true) {
            const move = prompt(`${currentPlayer.getPlayerName()}, enter your move(use 2 digits to signify the location on the board):`);
            if (Gameboard.handleMove(move, currentPlayer)) {
                break;
            } else {
                console.log('Choose an empty cell');
                continue;
            }
        }
    }
    */


    const playRound = (cell) => {
        console.log(cell);
        //const move = getMove(); ONLY RELEVANT FOR CONSOLE VERSION
        if(Gameboard.handleMove(cell, currentPlayer)){
            displayController.displayBoard(Gameboard.getBoard());
            numMoves++;
            testWin();
            switchPlayer();
            displayController.toggleCurrentPlayer();
        }else{
            displayController.displayMessage('Choose an empty cell')
        }

    }

    const isOngoing = () => ongoing;

    return {playRound, startGame, isOngoing, getPlayers};
})();

const displayController = (() => {


    const boardElement = document.querySelector('#board');
    const displayBoard = (board) => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cellElement = document.querySelector(`.cell[data-index="${i}${j}"]`);
                if(board[i][j]){
                    const mark = board[i][j] === 'X' ? 'X' : 'O';
                    cellElement.innerHTML = `<img src="icons/${mark}.svg">`
                }
            }

        }
    }

    const displayPlayerName = (playerNum) => {
        const playerElement = document.querySelector(`".player#${playerNum}`);
        const playerName = gameController.getPlayers[playerNum - 1].getPlayerName();

        playerElement.textContent = playerName;
    }

    const toggleCurrentPlayer = () => {
        const currentPlayerElement = document.querySelector(".player[data-current=true");
        const newCurrentPlayer = document.querySelector(".player[data-current=false");

        currentPlayerElement.dataset.current = "false";
        newCurrentPlayer.dataset.current = "true";
    }

    // used to display various messages on the message display.

    const displayMessage = (message) => {

        const messageElement = document.querySelector("#message-display");
        messageElement.textContent = message;
    }



    return {
        displayBoard,
        displayPlayerName,
        toggleCurrentPlayer,
        displayMessage
    };
})();


const clickHandler = (() =>{
    const container = document.querySelector("#container");

    container.addEventListener("click", (e)=>{

        if(e.target.classList.contains("cell") && gameController.isOngoing()){
            console.log(`${e.target.dataset.index}`);
            gameController.playRound(e.target.dataset.index);
        } 
        //to do...
    })
})();

gameController.startGame();
/*
function mainLoop() {

    gameController.startGame();

    while (gameController.isOngoing()) {
        const played = gameController.playRound();
        if(!played){
            displayController.displayMessage('cellError');
            continue;
        }
        displayController.displayBoard();
        displayController.toggleCurrentPlayer();
    }
    displayController.displayMessage('result');

}

mainLoop(); */