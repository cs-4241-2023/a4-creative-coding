export const Color = {
    WHITE: 0,
    BLACK: 1,
}


export class Piece {
    constructor(id, color, x, y) {
        this.id = id;
        this.color = color;
        this.x = x;
        this.y = y;
        this.cooldown = 0;
        this.cost = 0;
        this.type = "";
    }
    
    setX(newX) {
        if (newX < 1) {
            return;
        }
        if (newX > 8){
            return;
        }
        this.x = newX;
    }

    setY(newY) {
        if (newY < 1) {
            return;
        }
        if (newY > 8){
            return;
        }
        this.y = newY;
    }

    noPiecesBetween(game, x, y) {
        let deltaX = x - this.x;
        let deltaY = y - this.y;
        let signX = deltaX < 0 ? -1 : 1;
        let signY = deltaY < 0 ? -1 : 1;
        deltaX = Math.abs(deltaX);
        deltaY = Math.abs(deltaY);
        // across y
        if (!deltaX) {
            for (let i = 1; i < deltaY; i++) {
                let conflictingPiece = game.pieces.find(
                    (piece) => piece.x === this.x && piece.y === this.y + (i * signY)
                );
                if (conflictingPiece !== undefined) {
                    return false;
                }
            }
            return true;
        }
        // across x
        if (!deltaY) {
            for (let i = 1; i < deltaX; i++) {
                let conflictingPiece = game.pieces.find(
                    (piece) => piece.x === this.x + (i * signX) && piece.y === this.y
                );
                if (conflictingPiece !== undefined) {
                    return false;
                }
            }
            return true;
        }
        // across diagonal
        for (let i = 1; i < deltaX; i++) {
            let conflictingPiece = game.pieces.find(
                (piece) => piece.x === this.x + (i * signX) && piece.y === this.y + (i * signY)
            );
            if (conflictingPiece !== undefined) {
                return false;
            }
        }
        return true;
    }

    moveValid(game, x, y) {
        if (this.cooldown) {
            return false;
        }
        if (x < 1 || x > 8 || y < 1 || y > 8) {
            return false;
        }
        let conflictingPiece = game.pieces.find(
            (piece) => piece.x === x && piece.y === y && piece.color === this.color
        );
        if (conflictingPiece !== undefined) {
            return false;
        }
        return true;
    }
}

export class King extends Piece {
    constructor(id, color, x, y) {
        super(id, color, x, y);
        this.cost = 2;
        this.type = "King";
    }

    moveValid(game, x, y) {
        if (!super.moveValid(game, x, y)) {
            return false;
        }
        if (Math.abs(this.x - x) <= 1 && Math.abs(this.y - y) <= 1) {
            return true;
        }
        if ((this.color === Color.WHITE && y === 1) || (this.color === Color.BLACK && y === 8)) {
            if (game.can_castle_short[this.color] && x === 2) {
                let conflictingPiece = game.pieces.find(
                    (piece) => [2, 3].includes(piece.x) && piece.y === y
                );
                return conflictingPiece === undefined;
            }
            if (game.can_castle_long[this.color] && x === 6) {
                let conflictingPiece = game.pieces.find(
                    (piece) => [5, 6, 7].includes(piece.x) && piece.y === y
                );
                return conflictingPiece === undefined;
            }
        }
        return false;
    }
}


export class Queen extends Piece {
    constructor(id, color, x, y) {
        super(id, color, x, y);
        this.cost = 9;
        this.type = "Queen";
    }
    
    moveValid(game, x, y) {
        if (!super.moveValid(game, x, y)) {
            return false;
        }
        if (!(Math.abs(this.x - x) === 0 || Math.abs(this.y - y) === 0 || Math.abs(this.x - x) === Math.abs(this.y - y))) {
            return false;
        }
        if (!this.noPiecesBetween(game, x, y)) {
            return false;
        }
        return true;
    }
}


export class Rook extends Piece {
    constructor(id, color, x, y) {
        super(id, color, x, y);
        this.cost = 5;
        this.type = "Rook";
    }
    
    moveValid(game, x, y) {
        if (!super.moveValid(game, x, y)) {
            return false;
        }
        if (Math.abs(this.x - x) && Math.abs(this.y - y)) {
            return false;
        }
        if (!this.noPiecesBetween(game, x, y)) {
            return false;
        }
        return true;
    }
}


export class Bishop extends Piece {
    constructor(id, color, x, y) {
        super(id, color, x, y);
        this.cost = 3;
        this.type = "Bishop";
    }
    
    moveValid(game, x, y) {
        if (!super.moveValid(game, x, y)) {
            return false;
        }
        if (Math.abs(this.x - x) !== Math.abs(this.y - y)) {
            return false;
        }
        if (!this.noPiecesBetween(game, x, y)) {
            return false;
        }
        return true;
    }
}


export class Knight extends Piece {
    constructor(id, color, x, y) {
        super(id, color, x, y);
        this.cost = 3;
        this.type = "Knight";
    }
    
    moveValid(game, x, y) {
        if (!super.moveValid(game, x, y)) {
            return false;
        }
        const deltaX = Math.abs(this.x - x);
        const deltaY = Math.abs(this.y - y);
        if (deltaX === 1 && deltaY === 2) {
            return true;
        }
        if (deltaX === 2 && deltaY === 1) {
            return true;
        }
        return false;
    }
}


export class Pawn extends Piece {
    constructor(id, color, x, y) {
        super(id, color, x, y);
        this.cost = 1;
        this.type = "Pawn";
    }
    
    moveValid(game, x, y) {
        if (!super.moveValid(game, x, y)) {
            return false;
        }
        let deltaX = Math.abs(this.x - x);
        let deltaY = Math.abs(this.y - y);

        // Move forward
        if (!deltaX) {
            // Pawns cannot capture the way they traditionally move, unlike other pieces
            let conflictingPiece = game.pieces.find(
                (piece) => piece.x === x && piece.y === y
            );
            if (conflictingPiece !== undefined) {
                return false;
            }

            // Move two squares
            if (((this.color === Color.WHITE && this.y === 2) || (this.color === Color.BLACK && this.y === 7)) && deltaY === 2) {
                if (!this.noPiecesBetween(game, x, y)) {
                    return false;
                }
                game.en_passantable_pawns[this.color ? 0 : 1].push(this);
                return true;
            }
            return deltaY === 1;
        }
        // Capture diagonal
        if (Math.abs(deltaX) === 1 && deltaY === 1) {
            let conflictingPiece = game.pieces.find(
                (piece) => piece.x === x && piece.y === y && piece.color !== this.color
            );
            if (conflictingPiece !== undefined) {
                return true;
            }
            // En Passant
            

            let enPassantablePiece = game.en_passantable_pawns[this.color].find(
                (piece) => piece.x === x && piece.y + (this.color === Color.WHITE ? 1 : -1) === y && piece.color !== this.color
            );
            if (enPassantablePiece !== undefined) {
                let idx = game.pieces.indexOf(enPassantablePiece);
                game.pieces.splice(idx, 1);
                return true;
            }
        }
        return false;
    }
}


export class Game {
    constructor() {
        this.pieces = [
            new Rook  (0,  Color.WHITE, 1, 1),
            new Knight(1,  Color.WHITE, 2, 1),
            new Bishop(2,  Color.WHITE, 3, 1),
            new King  (3,  Color.WHITE, 4, 1),
            new Queen (4,  Color.WHITE, 5, 1),
            new Bishop(5,  Color.WHITE, 6, 1),
            new Knight(6,  Color.WHITE, 7, 1),
            new Rook  (7,  Color.WHITE, 8, 1),
            
            new Pawn  (8,  Color.WHITE, 1, 2),
            new Pawn  (9,  Color.WHITE, 2, 2),
            new Pawn  (10, Color.WHITE, 3, 2),
            new Pawn  (11, Color.WHITE, 4, 2),
            new Pawn  (12, Color.WHITE, 5, 2),
            new Pawn  (13, Color.WHITE, 6, 2),
            new Pawn  (14, Color.WHITE, 7, 2),
            new Pawn  (15, Color.WHITE, 8, 2),
            
            new Pawn  (16, Color.BLACK, 1, 7),
            new Pawn  (17, Color.BLACK, 2, 7),
            new Pawn  (18, Color.BLACK, 3, 7),
            new Pawn  (19, Color.BLACK, 4, 7),
            new Pawn  (20, Color.BLACK, 5, 7),
            new Pawn  (21, Color.BLACK, 6, 7),
            new Pawn  (22, Color.BLACK, 7, 7),
            new Pawn  (23, Color.BLACK, 8, 7),
            
            new Rook  (24, Color.BLACK, 1, 8),
            new Knight(25, Color.BLACK, 2, 8),
            new Bishop(26, Color.BLACK, 3, 8),
            new King  (27, Color.BLACK, 4, 8),
            new Queen (28, Color.BLACK, 5, 8),
            new Bishop(29, Color.BLACK, 6, 8),
            new Knight(30, Color.BLACK, 7, 8),
            new Rook  (31, Color.BLACK, 8, 8),
        ];
        this.can_castle_short = [true, true];
        this.can_castle_long = [true, true];
        this.en_passantable_pawns = [[], []]; // List of pawns that have moved two squares SINCE THIS COLOR MOVED LAST
        this.started = false;
        this.winner = null;
        this.elixir = [0, 0];
        this.elixir_per_unit = 90;
    }
}
