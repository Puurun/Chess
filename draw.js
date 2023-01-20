
let board = [];
for(let i=0; i<8; i++){
    board[i] = [];
    for(let j=0; j<8; j++){
        board[i][j] = 0;
    }
}

const canvas = document.getElementById("game_canvas");
const ctx = canvas.getContext("2d");
const start_x = 10;
const start_y = 10;
const rect_width = 50;
const rect_height = 50;

class Sprite {
    constructor(src, ctx){
        this.img = new Image();
        this.img.src = src;
        this.img.onload = () => {
            this.loaded = true;
        }
        this.ctx = ctx;
    }

    DrawImage(xpos, ypos, width, height){
        if(!this.loaded){
            return;
        }
        this.ctx.drawImage(this.img, 
            xpos, ypos,
            width, height);
    }
}

chess_pieces = {
    black_rook: {
        id: 1,
        src: 'img/Chess_rdt45.svg.png',
        sprite: new Sprite('img/Chess_rdt45.svg.png', ctx)
    },
    black_knight: {
        id: 2,
        src: 'img/Chess_ndt45.svg.png',
        sprite: new Sprite('img/Chess_ndt45.svg.png', ctx)
    },
    black_bishop: {
        id: 3,
        src: 'img/Chess_bdt45.svg.png',
        sprite: new Sprite('img/Chess_bdt45.svg.png', ctx)
    },
    black_queen: {
        id: 4,
        src: 'img/Chess_qdt45.svg.png',
        sprite: new Sprite('img/Chess_qdt45.svg.png', ctx)
    },
    black_king: {
        id: 5,
        src: 'img/Chess_kdt45.svg.png',
        sprite: new Sprite('img/Chess_kdt45.svg.png', ctx)
    },
    black_pawn:{
        id: 6,
        src: 'img/Chess_pdt45.svg.png',
        sprite: new Sprite('img/Chess_pdt45.svg.png', ctx)
    },
    white_rook: {
        id: 7,
        src: 'img/Chess_rlt45.svg.png',
        sprite: new Sprite('img/Chess_rlt45.svg.png', ctx)
    },
    white_knight: {
        id: 8,
        src: 'img/Chess_nlt45.svg.png',
        sprite: new Sprite('img/Chess_nlt45.svg.png', ctx)
    },
    white_bishop: {
        id: 9,
        src: 'img/Chess_blt45.svg.png',
        sprite: new Sprite('img/Chess_blt45.svg.png', ctx)
    },
    white_queen: {
        id: 10,
        src: 'img/Chess_qlt45.svg.png',
        sprite: new Sprite('img/Chess_qlt45.svg.png', ctx)
    },
    white_king: {
        id: 11,
        src: 'img/Chess_klt45.svg.png',
        sprite: new Sprite('img/Chess_klt45.svg.png', ctx)
    },
    white_pawn: {
        id: 12,
        src: 'img/Chess_plt45.svg.png',
        sprite: new Sprite('img/Chess_plt45.svg.png', ctx)
    }
}

function DrawChessPieces(val, cx, cy){
    switch(val){
        case 1:
            chess_pieces.black_rook.sprite.DrawImage(cx, cy, rect_width, rect_height);  
            break;
        case 2:
            chess_pieces.black_knight.sprite.DrawImage(cx, cy, rect_width, rect_height);  
            break;
        case 3:
            chess_pieces.black_bishop.sprite.DrawImage(cx, cy, rect_width, rect_height);  
            break;
        case 4:
            chess_pieces.black_queen.sprite.DrawImage(cx, cy, rect_width, rect_height);  
            break;
        case 5:
            chess_pieces.black_king.sprite.DrawImage(cx, cy, rect_width, rect_height);  
            break;
        case 6:
            chess_pieces.black_pawn.sprite.DrawImage(cx, cy, rect_width, rect_height);  
            break;
        case 7:
            chess_pieces.white_rook.sprite.DrawImage(cx, cy, rect_width, rect_height);  
            break;
        case 8:
            chess_pieces.white_knight.sprite.DrawImage(cx, cy, rect_width, rect_height);  
            break;
        case 9:
            chess_pieces.white_bishop.sprite.DrawImage(cx, cy, rect_width, rect_height);  
            break;
        case 10:
            chess_pieces.white_queen.sprite.DrawImage(cx, cy, rect_width, rect_height);  
            break;
        case 11:
            chess_pieces.white_king.sprite.DrawImage(cx, cy, rect_width, rect_height);  
            break;
        case 12:
            chess_pieces.white_pawn.sprite.DrawImage(cx, cy, rect_width, rect_height);  
            break;
    }
}
function InitBoard(){
    board[0][0] = board[0][7] = 1;
    board[0][1] = board[0][6] = 2;
    board[0][2] = board[0][5] = 3;
    board[0][3] = 4;
    board[0][4] = 5;
    for(let i=0; i<8; i++){
        board[1][i] = 6;
    }

    board[7][0] = board[7][7] = 7;
    board[7][1] = board[7][6] = 8;
    board[7][2] = board[7][5] = 9;
    board[7][3] = 10;
    board[7][4] = 11;
    for(let i=0; i<8; i++){
        board[6][i] = 12;
    }
}

function DrawBoard() {
    board.forEach((row, ridx) =>{
        row.forEach((val, cidx)=>{
            if((ridx+cidx)%2 == 1){
                ctx.fillStyle = "#f7f5ed";
            }
            else{
                ctx.fillStyle = "#9bbf9c";
            }
            let cx = start_x+cidx*rect_width;
            let cy = start_y+ridx*rect_height;
            ctx.beginPath();
            ctx.rect(cx, cy, rect_width, rect_height);
            ctx.fill();
            ctx.closePath();
            DrawChessPieces(val,cx ,cy);
        })
    })
}

function onUpdate(){
    InitBoard();
    DrawBoard();
}

setInterval(() => {
    onUpdate();
}, 1);


