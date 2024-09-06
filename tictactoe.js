


// token will be either 'O' or 'X'.
function createPlayer(playerName, playerToken) {
    const name = playerName;
    const token = playerToken;
    const getPlayerName = () => playerName;
    const getToken = () => token;
    const setPlayerName = (playerName) => this.playerName = playerName;

    return { getPlayerName, getToken, setPlayerName };
}

const Gameboard = (() => {
    const board = [];
    const tokens = { 1: 'X', 2: 'O' };

    const setBoard = () => {
        for (let i = 0; i < 3; i++) {
            board[i] = [];
            for (let j = 0; j < 3; j++) {
                board[i][j] = '_';
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
        if (board[move[0]][move[1]] != '_') {
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



    const startGame = () => {
        numMoves = 0;
        ongoing = true;
        Gameboard.setBoard();
        Gameboard.printBoard();
    }

    const getCurrentPlayer = () => currentPlayer;

    const testWin = () => {
        // test rows
        for (row of board) {
            if (row[0] != '_' && row[0] === row[1] && row[1] === row[2]) {
                console.log(`${currentPlayer} won!`);
                ongoing = false;
                return;
            }
        }

        // test columns
        for (let j = 0; j < 3; j++) {
            if (board[0][j] != '_' && board[0][j] === board[1][j] && board[1][j] === board[2][j]  ) {
                console.log(`${currentPlayer} won!`);
                ongoing = false;
                return;
            }
        }

        // test diagnoals
        if ((board[0][0] != '_' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
            (board[0][2] === board[1][1] && board[1][1] === board[2][0])){
            console.log(`${currentPlayer} won!`);
            ongoing = false;
            return;
        }

        if (numMoves === 9) {
            console.log("It's a draw!");
            ongoing = false;
            return;
        }
    }

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === playerOne ? playerTwo : playerOne);
    }

    const getMove = () => {

        while(true){
            const move = prompt(`${currentPlayer.getPlayerName()}, enter your move(use 2 digits to signify the location on the board):`);
            if(Gameboard.handleMove(move, currentPlayer)){
                break;
            } else{
                console.log('Choose an empty cell');
                continue;
            }
        }
    }


    const playRound = () => {
        const move = getMove();
        Gameboard.printBoard();
        numMoves++;
        testWin();
        switchPlayer();
    }

    const isOngoing = () => ongoing;

    return { playRound, startGame, isOngoing };
})();


function mainLoop() {

    gameController.startGame();

    while (gameController.isOngoing()) {
        gameController.playRound();
    }

}

mainLoop();