import express from 'express';
import http from 'http'
import { WebSocketServer } from 'ws';
import { Game, Pawn, Rook, Queen, King, Color } from './game.js';


let game = new Game();

let lastTime = performance.now();

const updateGame = () => {
    let time = performance.now();
    let diff = (time - lastTime) / 16.66;
    lastTime = time;;
    if (!game.started || game.winner !== null) {
        return;
    }
    game.pieces.forEach((piece) => {
        piece.cooldown = Math.max(piece.cooldown - diff, 0);
    })
    game.elixir[0] = Math.min(game.elixir[0] + diff, game.elixir_per_unit * 10);
    game.elixir[1] = Math.min(game.elixir[1] + diff, game.elixir_per_unit * 10);
}
setInterval(updateGame, 16);

// HTTP server logic
const app = express();
const port = 3000;

app.use((request, response, next) => {
    console.log("url:", request.url);
    next();
});

app.use(express.static('public'));
app.use(express.json());

const server = http.createServer(app);

// Websocket logic
const wss = new WebSocketServer({server});

let connections = [null, null];

const updateWebsockets = () => {
    connections.forEach((ws, idx) => {
        if (ws !== null) {
            let stringified = JSON.stringify({
                game: game,
                player: idx,
            })
            ws.send(stringified);
        }
    });
}

const resetGame = () => {
    game = new Game();
    if (connections[0] !== null && connections[1] !== null) {
        game.started = true;
    }
    updateWebsockets();
}

wss.on('connection', function connection(ws) {
    console.log("Received connection...");
    let player;
    if (connections[0] === null) {
        connections[0] = ws;
        player = 0;
    } else if (connections[1] === null) {
        connections[1] = ws;
        player = 1;
    } else {
        console.log("Game is full, rejecting");
        ws.close();
        return;
    }
    if (connections[0] !== null && connections[1] !== null) {
        game.started = true;
    }
 
    ws.on('error', console.error);

    ws.on('message', (data) => {
        let move = JSON.parse(data);
        let piece = game.pieces.find(
            (piece) => piece.id === move.id
        );
        if (piece === undefined) {
            return;
        }
        if (piece.color !== player) {
            return;
        }
        if (!piece.moveValid(game, move.x, move.y)) {
            return;
        }
        if (game.elixir[player] < (piece.cost * game.elixir_per_unit)) {
            return;
        }
        if (!game.started || game.winner !== null) {
            return;
        }
        game.elixir[player] -= piece.cost * game.elixir_per_unit;
        
        game.en_passantable_pawns[piece.color] = [];
        
        let conflictingPiece = game.pieces.find(
            (piece) => piece.x === move.x && piece.y === move.y
        );
        if (conflictingPiece !== undefined) {
            if (conflictingPiece instanceof King) {
                game.winner = conflictingPiece.color ? 0 : 1;
                setTimeout(() => resetGame(), 10000);
            }
            let idx = game.pieces.indexOf(conflictingPiece);
            game.pieces.splice(idx, 1);
        }
        if (piece instanceof King) {
            game.can_castle_short[player] = false;
            game.can_castle_long[player] = false;
            if (piece.x - move.x === -2) {
                let castledRook = game.pieces.find(
                    (p) => p.x === 8 && p.y === piece.y && p.color === piece.color
                );
                castledRook.x = 5;
                castledRook.cooldown = 120;
            } else if (piece.x - move.x === 2) {
                let castledRook = game.pieces.find(
                    (p) => p.x === 1 && p.y === piece.y && p.color === piece.color
                );
                castledRook.x = 3;
                castledRook.cooldown = 120;
            }
        }
        if (piece instanceof Rook) {
            if ((piece.y === 1 && player === Color.WHITE) || (piece.y === 8 && player === Color.BLACK)) {
                if (piece.x === 1) {
                    game.can_castle_long[player] = false;
                } else if (piece.x === 8) {
                    game.can_castle_short[player] = false;
                }
            }
        }
        if ([1, 8].includes(move.y) && piece instanceof Pawn) {
            let new_piece = new Queen(piece.id, piece.color, move.x, move.y);
            let idx = game.pieces.indexOf(piece);
            game.pieces.splice(idx, 1);
            game.pieces.push(new_piece);
            piece = new_piece;
        } else {
            piece.x = move.x;
            piece.y = move.y;
        }
        piece.cooldown = 120;
        updateWebsockets();
    });

    ws.on('close', () => {
        console.log("Connection closed...");
        if (connections[player] === ws) {
            connections[player] = null;
            game.started = false;
        }
        updateWebsockets();
    });

    updateWebsockets();
});

server.listen(port);

console.log("Booted.")
