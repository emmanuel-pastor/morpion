function initView() {
    for (let i = 0; i < 3; i++) {
        document.getElementById("grid").innerHTML += `<tr id="line${i}">`
        for (let j = 0; j < 3; j++) {
            const cellNumber = j + i*3;
            document.getElementById("line" + i).innerHTML +=
                `<th id="cell${cellNumber}"></th>`;
        }
        document.getElementById("line" + i).innerHTML += "</tr>";
    }
}

const GameStatus = {
    PLAYING: 0,
    WON: 1,
    DRAW: 2
}

function Player(initialScore, symbol) {
    this.score = initialScore;
    this.symbol = symbol;
}

// returns cell number that is AI wants to play
function IAPlay(leftCells) {
    return leftCells[Math.floor(Math.random() * leftCells.length)];
}

function Game(user, ai) {
    this.user = user
    this.ai = ai
    this.whoseTurn = user;
    this.leftGridCells = Array(9);
    this.grid = Array(9);

    this.initGame = () => {
        initView();

        for(let i=0; i < 9; i++) {
            document.getElementById("cell" + i).addEventListener("click", this.handleClick);
        }

        for (let i = 0; i < 9; i++) {
            this.leftGridCells[i] = i;
        }
    }

    this.start = (startingPlayer) => {
        this.initGame()
        if (startingPlayer !== undefined)
            this.whoseTurn = startingPlayer;

        if (this.whoseTurn === this.ai) {
            this.handlePlay(IAPlay(this.leftGridCells));
        }
    }

    this.checkGrid = () => {
        const winConditions = [
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,4,8],
            [2,4,6]
        ]
        const currentSymbol = this.whoseTurn.symbol;

        for (const indexes of winConditions) {
            if (this.grid[indexes[0]] === currentSymbol && this.grid[indexes[1]] === currentSymbol && this.grid[indexes[2]] === currentSymbol) {
                return GameStatus.WON;
            }
        }
        return this.leftGridCells.length === 0 ? GameStatus.DRAW : GameStatus.PLAYING;
    }

    this.resetView = () => {
        this.grid = Array(9);
        for (let i = 0; i < 9; i++) {
            this.leftGridCells[i] = i;
        }
        for(let i=0; i < 9; i++) {
            document.getElementById("cell" + i).textContent = "";
        }

        document.getElementById(`won-lost`).textContent = "";
    }

    this.handleClick = (e) => {
        const cellNumber = parseInt(e.currentTarget.id.split('cell')[1]);
        if (this.whoseTurn !== user) {
            console.log("not your turn!");
        } else {
            if(this.leftGridCells.includes(cellNumber))
                this.handlePlay(cellNumber);
        }
    }

    this.handlePlay = (cellNumber) => {
        this.grid[cellNumber] = this.whoseTurn.symbol
        this.leftGridCells.splice(this.leftGridCells.indexOf(cellNumber), 1);
        this.updateGridView(cellNumber);
        const gameStatus = this.checkGrid();
        if (gameStatus !== GameStatus.PLAYING) {
            if(gameStatus !== GameStatus.DRAW) {
                if(this.whoseTurn === user) {
                    user.score += 1
                } else {
                    ai.score += 1
                }
            }
            this.updateScoreView()
            this.updateWonLostView(gameStatus);
            setTimeout(() => {
                game.resetView();
                this.switchPlayer()
            }, 2000);
        } else {
            this.switchPlayer()
        }
    }

    this.switchPlayer = () => {
        this.whoseTurn = this.whoseTurn === user ? ai : user ;
        if (this.whoseTurn === ai) {
            this.handlePlay(IAPlay(this.leftGridCells));
        }
    }

    this.updateGridView = (cellNumber) => {
        document.getElementById("cell" + cellNumber.toString()).textContent = this.whoseTurn.symbol;
    }

    this.updateScoreView = () => {
        document.getElementById(`score0`).textContent = this.user.score;
        document.getElementById(`score1`).textContent = this.ai.score;
    }

    this.updateWonLostView = (gameStatus) => {
        const message = gameStatus === GameStatus.WON && this.whoseTurn === user ? "Vous avez Gagné !" : gameStatus === GameStatus.DRAW ? "Égalité..." : "Vous avez perdu :(";
        document.getElementById(`won-lost`).textContent = message;
    }
}

const user = new Player(0, "👦");
const ai = new Player(0, "💻");
const game = new Game(user, ai);
game.start(ai);