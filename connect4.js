/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor (p1, p2, height, width) {
    this.p1 = p1;
    this.p2 = p2;
    this.WIDTH = width;
    this.HEIGHT = height;
    this.currPlayer = this.p1; // active player: 1 or 2
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.beginGame();
  }

  beginGame() {
    // start new game
    const btnSTART = document.getElementById('newGame');
    btnSTART.addEventListener('click', (e) => {
      const gameplay = document.querySelector('#board');
      gameplay.innerHTML = '';
      this.board = []
      this.currPlayer = this.p1;
      this.makeBoard();
      this.makeHtmlBoard();
    })

  }
  
  makeBoard() { //create board structure, board = array of rows, each row is array of cells  (board[y][x])
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  makeHtmlBoard() { // make HTML table and row of column tops
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
    
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        cell.setAttribute('class', 'piece');
        row.append(cell);
      }

      board.append(row);
    }
  }

  findSpotForCol(x) { // given column x, return top empty y (null if filled)
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) { // update DOM to place piece into HTML table of board
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) { // announce game ends
    document.querySelector('#column-top').setAttribute('id', 'done');
    alert(msg);
  }

  handleClick(evt) { // handle click of column top to play piece
    // get x from ID of clicked cell

    if (!!(document.getElementById('done'))) {
      return
    } else {
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
    
      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        return this.endGame(`The ${this.currPlayer.color} player won!`);
      }
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }
        
      // switch players
      this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
    
    }
  }

  checkForWin() { // check board cell-by-cell for "does a win start here?"

    const _win = cells => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }
  
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

}

class Player { 
  constructor (color) {
    this.color = color;
  }
}

document.getElementById('playerColors').addEventListener('click', (e) => {
  const p1 = new Player(document.getElementById('player1Color').value);
  const p2 = new Player(document.getElementById('player2Color').value);
  document.getElementById('player1Color').style.backgroundColor = document.getElementById('player1Color').value;
  document.getElementById('player2Color').style.backgroundColor = document.getElementById('player2Color').value;
  new Game(p1, p2, 6, 7);
});