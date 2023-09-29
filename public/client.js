const IMAGES = {
    Pawn: [
        new Image(),
        new Image(),
    ],
    Knight: [
        new Image(),
        new Image(),
    ],
    Bishop: [
        new Image(),
        new Image(),
    ],
    Rook: [
        new Image(),
        new Image(),
    ],
    Queen: [
        new Image(),
        new Image(),
    ],
    King: [
        new Image(),
        new Image(),
    ],
};
IMAGES.Pawn[0].src = "https://raw.githubusercontent.com/Flame442/ElixirChess/main/assets/white_pawn.png";
IMAGES.Pawn[1].src = "https://raw.githubusercontent.com/Flame442/ElixirChess/main/assets/black_pawn.png";
IMAGES.Knight[0].src = "https://raw.githubusercontent.com/Flame442/ElixirChess/main/assets/white_knight.png";
IMAGES.Knight[1].src = "https://raw.githubusercontent.com/Flame442/ElixirChess/main/assets/black_knight.png";
IMAGES.Bishop[0].src = "https://raw.githubusercontent.com/Flame442/ElixirChess/main/assets/white_bishop.png";
IMAGES.Bishop[1].src = "https://raw.githubusercontent.com/Flame442/ElixirChess/main/assets/black_bishop.png";
IMAGES.Rook[0].src = "https://raw.githubusercontent.com/Flame442/ElixirChess/main/assets/white_rook.png";
IMAGES.Rook[1].src = "https://raw.githubusercontent.com/Flame442/ElixirChess/main/assets/black_rook.png";
IMAGES.Queen[0].src = "https://raw.githubusercontent.com/Flame442/ElixirChess/main/assets/white_queen.png";
IMAGES.Queen[1].src = "https://raw.githubusercontent.com/Flame442/ElixirChess/main/assets/black_queen.png";
IMAGES.King[0].src = "https://raw.githubusercontent.com/Flame442/ElixirChess/main/assets/white_king.png";
IMAGES.King[1].src = "https://raw.githubusercontent.com/Flame442/ElixirChess/main/assets/black_king.png";

const Color = {
	WHITE: 0,
	BLACK: 1,
}


class Client {
    constructor(ctx, ws) {
        this.ctx = ctx;
        this.ws = ws;

        this.ws.addEventListener("open", this.ws_open.bind(this));
        this.ws.addEventListener("message", this.ws_message.bind(this));
        this.ws.addEventListener("close", this.ws_close.bind(this));
        document.getElementById("board").addEventListener("mousemove", this.event_mouse_move.bind(this));
        document.getElementById("board").addEventListener("mousedown", this.event_mouse_down.bind(this));
        document.getElementById("board").addEventListener("mouseup", this.event_mouse_up.bind(this));
        
        this.game = null;
        this.player = Color.WHITE;
        this.holding = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastTime = performance.now();

        window.requestAnimationFrame(this.draw.bind(this));
        window.setInterval(this.updateGame.bind(this), 16);
    }

    draw(timestamp) {
        window.requestAnimationFrame(this.draw.bind(this));

        // Background
        this.ctx.fillStyle = "#C0C0C0";
        this.ctx.fillRect(0, 0, 900, 1000);
    
        // Tiles
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                this.ctx.fillStyle = ((x + y) % 2) ? "#78402D" : "#C1965E";
                this.ctx.fillRect((x * 100) + 50, (y * 100) + 50, 100, 100);
            }
        }

        if (this.game === null) {
            return;
        }

        // Pieces
        this.game.pieces.forEach((piece) => {
            if (piece !== this.holding) {
                this.drawPiece(piece);
            }
        });
        if (this.holding !== null) {
            this.drawPiece(this.holding);
        }

        // Elixir bar
        this.ctx.fillStyle = "#3C3C3C";
        this.ctx.fillRect(50, 875, 800, 50);

        this.ctx.fillStyle = "#646464";
        this.ctx.fillRect(55, 880, 790, 40);

        let bar_px = Math.round((this.game.elixir[this.player] / (this.game.elixir_per_unit * 10)) * 790);
        this.ctx.fillStyle = "#D638D6";
        this.ctx.fillRect(55, 880, bar_px, 40);

        for (let px = 79; px < 790; px += 79) {
            this.ctx.fillStyle = px <= bar_px ? "#8E438E" : "#4C4C4C";
            this.ctx.fillRect(55 + px, 880, 2, 10);
        }

        this.ctx.fillStyle = "#8E438E";
        this.ctx.font = "25px serif";
        let textString = String(Math.floor(this.game.elixir[this.player] / (this.game.elixir_per_unit)));
        let textSize = this.ctx.measureText(textString);
        this.ctx.fillText(textString, 25 - Math.round(textSize.width / 2), 908);
        
        // Other pop up states
        // Lost WS
        if ([this.ws.CLOSING, this.ws.CLOSED].includes(this.ws.readyState)) {
            this.ctx.globalAlpha = 0.9;
            
            this.ctx.fillStyle = "#A0A0A0";
            this.ctx.fillRect(200, 360, 500, 80);

            this.ctx.fillStyle = "#000000"
            let waitingTextString = "Lost WS connection...";
            this.ctx.font = "50px serif";
            let waitingTextSize = this.ctx.measureText(waitingTextString);
            this.ctx.fillText(waitingTextString, 450 - Math.round(waitingTextSize.width / 2), 415);
            
            this.ctx.globalAlpha = 1.0;
        } else if (this.game.winner !== null) {
            this.ctx.globalAlpha = 0.9;
            this.ctx.fillStyle = "#A0A0A0";
            this.ctx.fillRect(300, 360, 300, 80);

            let winnerTextString;
            if (this.game.winner === Color.WHITE) {
                this.ctx.fillStyle = "#FFFFFF"
                winnerTextString = "White wins!";
            } else {
                this.ctx.fillStyle = "#000000"
                winnerTextString = "Black wins!";
            }
            this.ctx.font = "50px serif";
            let winnerTextSize = this.ctx.measureText(winnerTextString);
            this.ctx.fillText(winnerTextString, 450 - Math.round(winnerTextSize.width / 2), 415);
            this.ctx.globalAlpha = 1.0;
        } else if (!this.game.started && this.game.winner === null) {
            this.ctx.globalAlpha = 0.9;
            
            this.ctx.fillStyle = "#A0A0A0";
            this.ctx.fillRect(200, 360, 500, 80);

            this.ctx.fillStyle = "#000000"
            let waitingTextString = "Waiting for opponent...";
            this.ctx.font = "50px serif";
            let waitingTextSize = this.ctx.measureText(waitingTextString);
            this.ctx.fillText(waitingTextString, 450 - Math.round(waitingTextSize.width / 2), 415);
            
            this.ctx.globalAlpha = 1.0;
        }
    }

    drawPiece(piece) {
        let img = IMAGES[piece.type][piece.color];
		if (piece.cooldown) {
			this.ctx.globalAlpha = 0.5;
		}
		if (this.holding?.id === piece.id) {
			this.ctx.drawImage(img, this.mouseX - Math.round(img.width / 2), this.mouseY - Math.round(img.height / 2));
		} else {
			this.ctx.drawImage(img, this.xCordToPixel(piece.x) + 50 - Math.round(img.width / 2), this.yCordToPixel(piece.y) + 50 - Math.round(img.height / 2));
		}
		this.ctx.globalAlpha = 1.0;
	}

	isClicked(piece) {
        if (piece.color !== this.player) {
            return false;
        }
		if (!(this.xCordToPixel(piece.x) < this.mouseX && this.mouseX < this.xCordToPixel(piece.x) + 100)) {
			return false;
		}
		if (!(this.yCordToPixel(piece.y) < this.mouseY && this.mouseY < this.yCordToPixel(piece.y) + 100)) {
			return false;
		}
		return true;
	}

    xCordToPixel(x) {
		let translatedX = x;
		if (this.player === Color.WHITE) {
			translatedX = 8 - translatedX + 1;
		}
		return translatedX * 100 - 50;
	}

	yCordToPixel(y) {
		let translatedY = y;
		if (this.player === Color.WHITE) {
			translatedY = 8 - translatedY + 1;
		}
		return (translatedY * 100 - 50);
	}
    
    updateGame() {
        let time = performance.now();
        let diff = (time - this.lastTime) / 16.66;
        this.lastTime = time;
        if (!this.game.started || this.game.winner !== null) {
            return;
        }
        this.game.pieces.forEach((piece) => {
            piece.cooldown = Math.max(piece.cooldown - diff, 0);
        });
        this.game.elixir[0] = Math.min(this.game.elixir[0] + diff, this.game.elixir_per_unit * 10);
        this.game.elixir[1] = Math.min(this.game.elixir[1] + diff, this.game.elixir_per_unit * 10);
    }

    event_mouse_move(event) {
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
    }

    event_mouse_down(event) {
        this.holding = this.game.pieces.find(
            (piece) => this.isClicked(piece)
        ) || null;
    }

    event_mouse_up(event) {
        if (this.holding === null) {
            return;
        }
        let x = Math.round((event.offsetX) / 100);
        let y = Math.round((event.offsetY) / 100);
        if (this.player === Color.WHITE){
            x = 8 - x + 1;
            y = 8 - y + 1;
        }
        let move = {
            id: this.holding.id,
            x: x,
            y: y,
        }
        this.ws.send(JSON.stringify(move));
        this.holding = null;
    }

    ws_open(event) {
        console.log("Established WS connection.");
    }

    ws_message(event) {
        let data = JSON.parse(event.data);
        this.game = data.game;
        this.player = data.player;
    }

    ws_close(event) {
        console.log("Closed WS connection.");
    }
}


window.addEventListener("load", () => {
    ctx = document.getElementById("board").getContext("2d");
    
    const socket = new WebSocket("ws://localhost:3000");

    new Client(ctx, socket);
})
