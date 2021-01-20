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

function Game(user, ai) {
    this.user = user;
    this.ai = ai;
    this.whoseTurn = user; //It is the turn of the user by default
    this.leftGridCells = Array(9); // Contains the indexes of the cells that can be clicked
    this.grid = Array(9); // Represents the state of the grid. Each cell can contain the symbol of the player that played in this cell.
    this.gameStatus = GameStatus.PLAYING;

    this.initGame = () => {
        initView();

        for(let i=0; i < 9; i++) {
            document.getElementById("cell" + i).addEventListener("click", this.handleClick);

            this.leftGridCells[i] = i;
        }
    }

    this.start = (startingPlayer) => {
        this.initGame()

        if (startingPlayer !== undefined)
            this.whoseTurn = startingPlayer;

        if (this.whoseTurn === this.ai)
            this.handlePlay(this.AIPlay(this.leftGridCells));
    }

    // Returns the cell number that the AI wants to play
    this.AIPlay = () => {
        return this.leftGridCells[Math.floor(Math.random() * this.leftGridCells.length)];
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
        ]; //List of combinations that mean that the player won.
        // The numbers corresponds to the cells in the grid that must be filled in for the player to have won.
        const currentSymbol = this.whoseTurn.symbol;

        for (const indexes of winConditions) {
            if (this.grid[indexes[0]] === currentSymbol && this.grid[indexes[1]] === currentSymbol && this.grid[indexes[2]] === currentSymbol) {
                return GameStatus.WON;
            }
        }

        // If there are no grid cells left, the game is over and since the current player did not win, that means the game ended on a draw.
        return this.leftGridCells.length === 0 ? GameStatus.DRAW : GameStatus.PLAYING;
    }

    this.resetGame = () => {
        this.grid = Array(9);

        for (let i = 0; i < 9; i++) {
            this.leftGridCells[i] = i;

            document.getElementById("cell" + i).textContent = "";
        }

        this.gameStatus = GameStatus.PLAYING;

        document.getElementById(`won-lost`).textContent = "";
    }

    this.handleClick = (e) => {
        const cellNumber = parseInt(e.currentTarget.id.split('cell')[1]);

        if (this.whoseTurn !== user) {
            console.log("not your turn!");
        } else if(this.gameStatus !== GameStatus.PLAYING) {
            console.log("the game is already over");
        } else {
            if(this.leftGridCells.includes(cellNumber))
                this.handlePlay(cellNumber);
        }
    }

    this.handlePlay = (cellNumber) => {
        this.grid[cellNumber] = this.whoseTurn.symbol
        this.leftGridCells.splice(this.leftGridCells.indexOf(cellNumber), 1);
        this.updateGridView(cellNumber);
        this.gameStatus = this.checkGrid();

        if (this.gameStatus !== GameStatus.PLAYING) {
            if(this.gameStatus !== GameStatus.DRAW) {
                if(this.whoseTurn === user) {
                    user.score += 1
                } else {
                    ai.score += 1
                }
            }
            this.updateScoreView()
            this.updateWonLostView();
            setTimeout(() => {
                game.resetGame();
                this.switchPlayer()
            }, 2000);
        } else {
            this.switchPlayer()
        }
    }

    this.switchPlayer = () => {
        this.whoseTurn = this.whoseTurn === user ? ai : user;

        if (this.whoseTurn === ai) {
            this.handlePlay(this.AIPlay());
        }
    }

    this.updateGridView = (cellNumber) => {
        document.getElementById("cell" + cellNumber.toString()).textContent = this.whoseTurn.symbol;
    }

    this.updateScoreView = () => {
        document.getElementById(`score0`).textContent = this.user.score;
        document.getElementById(`score1`).textContent = this.ai.score;
    }

    this.updateWonLostView = () => {
        const message = this.gameStatus === GameStatus.WON && this.whoseTurn === user ? "🎉 Vous avez gagné 🎉" : this.gameStatus === GameStatus.DRAW ? "Égalité... 😬" : "Vous avez perdu 😢";
        document.getElementById(`won-lost`).textContent = message;
    }
}


function EmojiPicker(game, emojiList) {
    this.selectedId = 'emoji0';

    this.handleEmojiClick = (event) => {
        const element = event.currentTarget;

        // Checks if the player has already put a symbol on the grid
        if (game.leftGridCells.length !== 9 && (game.leftGridCells.length !== 8 || game.whoseTurn !== game.user)) {
            console.log("Cannot change emoji during a game");
            return;
        }


        document.getElementById(this.selectedId).classList.remove('selected');
        this.selectedId = element.id
        element.classList.add('selected')

        game.user.symbol = element.innerText
    }

    this.initEmojiPicker = () => {
        let k = 0;
        for (let i = 0; i < emojiList.length/3; i++) {
            const  table = document.getElementById("user-emoji-table")

            table.innerHTML += `<tr id='row${i}'></tr>`;
            for (let j = 0; j < 3; j++) {
                const row = document.getElementById(`row${i}`)

                if (emojiList[k] === undefined) {
                    row.innerHTML += `<td id='emoji${k}'></td>`
                } else {
                    row.innerHTML += `<td id='emoji${k}'>${emojiList[k]}</td>`;
                }

                k += 1;
            }
        }

        document.getElementById('emoji0').classList.add('selected');
        for (let i=0; i < emojiList.length; i++) {
            document.getElementById(`emoji${i}`).addEventListener("click", this.handleEmojiClick);
        }
    }

    //Initialization of EmojiPicker immediately when created
    this.initEmojiPicker();
}

const emojiList = ['👦', '👩', '👽', '🦝', '🦄', '🐬', '❌', '⭕', '✔', '😺', '🐶', '🐼'];

const user = new Player(0, emojiList[0]);
const ai = new Player(0, "💻");
const game = new Game(user, ai);
new EmojiPicker(game, emojiList);

game.start(ai);