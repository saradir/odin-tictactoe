


// token will be either 'O' or 'X'.
function createPlayer(playerName, id) {
    let name = playerName;
    const token = id === '1'? 'X': '0';
    const getPlayerName = () => name;
    const getToken = () => token;
    const setPlayerName = (playerName) => name = playerName;
    const getID = () => id;

    return { getPlayerName, getToken, setPlayerName, getID };
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

    /* for console mode
    const printBoard = () => {
        console.log('######');
        for (row of board) {
            console.log(row.join('|'));
        }
        console.log('######');
    }*/

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



    return { getBoard, handleMove, setBoard };
})();


const gameController = (() => {

    const playerOne = createPlayer('playerOne', '1');
    const playerTwo = createPlayer('playerTwo', '2');
    let currentPlayer = playerOne;
    let numMoves = 0;
    let ongoing = false; // track game state
    const board = Gameboard.getBoard();

    const startGame = () => {
        numMoves = 0;
        ongoing = true;
        Gameboard.setBoard();
        currentPlayer = playerOne;
        displayController.displayCurrentPlayer(currentPlayer.getID());
        displayController.displayBoard(board);
        displayController.displayMessage('');

    }

    const getCurrentPlayer = () => currentPlayer;
    const getPlayers = () => [playerOne, playerTwo];

    const testWin = () => {
        // test rows
        for (row of board) {
            if (row[0] != '' && row[0] === row[1] && row[1] === row[2]) {
                displayController.displayMessage(`${currentPlayer.getPlayerName()} won!`);
                ongoing = false;
                return;
            }
        }

        // test columns
        for (let j = 0; j < 3; j++) {
            if (board[0][j] != '' && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
                displayController.displayMessage(`${currentPlayer.getPlayerName()} won!`);
                ongoing = false;
                return;
            }
        }

        // test diagnoals
        if ((board[0][0] != '' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
            (board[0][2] != '' &&  board[0][2]=== board[1][1] && board[1][1] === board[2][0])) {
            
            displayController.displayMessage(`${currentPlayer.getPlayerName()} won!`);
            ongoing = false;
            return;
        }

        else if (numMoves === 9) {
            displayController.displayMessage("It's a draw!");
            ongoing = false;
            return;
        }
    }

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === playerOne ? playerTwo : playerOne);
        displayController.displayCurrentPlayer(currentPlayer.getID());
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
        //const move = getMove(); ONLY RELEVANT FOR CONSOLE VERSION
        if(Gameboard.handleMove(cell, currentPlayer)){
            displayController.displayBoard(Gameboard.getBoard());
            numMoves++;
            testWin();
            switchPlayer();
        }else{
            displayController.displayMessage('Choose an empty cell');
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
                    cellElement.innerHTML = `<img src="icons/${mark}.svg">`;
                }else {cellElement.innerHTML = '';}
            }

        }
    }

    const displayPlayerName = (playerID, name) => {
        const playerElement = document.getElementById(playerID);

        playerElement.textContent = name;
    }

    // display current player
    const displayCurrentPlayer = (playerID) => {
        const playerElements = document.querySelectorAll(".player");
        // reset current status
        for(player of playerElements){
            player.dataset.current ='';
        }
        const currentPlayerElement = document.getElementById(playerID);
        currentPlayerElement.dataset.current = "true";
    }

    // used to display various messages on the message display.
    const displayMessage = (message) => {

        const messageElement = document.querySelector("#message-display");
        messageElement.textContent = message;
    }



    return {
        displayBoard,
        displayPlayerName,
        displayCurrentPlayer: displayCurrentPlayer,
        displayMessage
    };
})();


const clickHandler = (() =>{
    const container = document.querySelector("#container");

    container.addEventListener("click", (e)=>{

        if(e.target.classList.contains("cell") && gameController.isOngoing()){
            gameController.playRound(e.target.dataset.index);
        } 

        if(e.target.id === "new-game"){
            gameController.startGame();
        }

        if(e.target.classList.contains("player")){
            const name = prompt(`Enter player ${e.target.id} name:`);
            const player = gameController.getPlayers()[Number(e.target.id)-1];  
            player.setPlayerName(name);
            displayController.displayPlayerName(e.target.id, name);
        }
        
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
        displayController.displayCurrentPlayer();
    }
    displayController.displayMessage('result');

}

mainLoop(); */