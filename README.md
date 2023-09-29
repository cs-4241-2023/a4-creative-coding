## ElixirChess

https://a4-michael-oliveira.glitch.me/

This project implements a multiplayer web game using canvas and websockets.

You can play by opening the above URL in two separate tabs.
If a pop up "Waiting for opponent" appears, you need to connect a second tab.
If a pop up "Lost WS connection" appears, either too many players are already connected or the websocket server is offline.

---

Elixir Chess is a variant of realtime chess.

Movement is restricted in two ways:
- A piece is put on "cooldown" after it is moved, and cannot be moved again for 2 seconds. This is denoted by the piece appearing transparent.
- An elixir/mana bar slowly fills up over time, and a piece can only be moved if you have enough elixir to cover its "move cost".

The move cost of each piece is as follows:
- Queen - 9
- Rook - 5
- Bishop - 3
- Knight - 3
- Knight - 3
- King/Castling - 2
- Pawn - 1

Pieces are moved by clicking and dragging them to a new square.
A move will only be considered "valid" if it is a legal chess move, the piece is not on cooldown, and the required elixir cost is satisfied.

This game does not include a "check/checkmate" mechanic due to the realtime nature of the game.
Instead, the game is won when a piece is able to capture the enemy king.
