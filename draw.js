const canvas = document.getElementById("game_canvas");


const ctx = canvas.getContext("2d");

const rect_height = window.innerHeight/11;
const rect_width = rect_height;

const start_x = rect_height/5;
const start_y = start_x;

canvas.width = rect_width*8+start_x*2;
canvas.height = rect_height*8+start_y*2;

let black_time = 3000;
let white_time = 3000;
let can_move_position = [];
let selected_piece_row = -1;
let selected_piece_col = -1;
let last_time = Date.now();

let black_min = Math.floor(black_time/60).toLocaleString(undefined, {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
let black_sec = (black_time%60).toLocaleString(undefined, {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
let white_min = Math.floor(white_time/60).toLocaleString(undefined, {
minimumIntegerDigits: 2,
useGrouping: false
});
let white_sec = (white_time%60).toLocaleString(undefined, {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
document.getElementById("white_time").innerText = `${white_min}:${white_sec}`;
document.getElementById("black_time").innerText = `${black_min}:${black_sec}`;
setInterval(()=>{
    let cur_time = Date.now();
    if(player_turn == 'black'){
        let display_time = black_time - Math.round((cur_time-last_time)/1000);
        black_min = Math.floor(display_time/60).toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false
          });
        black_sec = (display_time%60).toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false
          });
        document.getElementById("black_time").innerText = `${black_min}:${black_sec}`;
        document.getElementById("black_time").style.color = "#F94A29";
    }
    else{
        let display_time = white_time - Math.round((cur_time-last_time)/1000);
        white_min = Math.floor(display_time/60).toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false
            });
        white_sec = (display_time%60).toLocaleString(undefined, {
            minimumIntegerDigits: 2,
            useGrouping: false
            });
        document.getElementById("white_time").innerText = `${white_min}:${white_sec}`;
        document.getElementById("white_time").style.color = "#F94A29";
    }
}, 100);

canvas.addEventListener('click', function(event){
    let rect = canvas.getBoundingClientRect();
    let mouse_x = event.clientX - rect.left;
    let mouse_y = event.clientY - rect.top;
    
    let cidx = Math.floor((mouse_x-start_x)/rect_width);
    let ridx = Math.floor((mouse_y-start_y)/rect_height);
    // prevent going over/down
    if(cidx<0) cidx = 0;
    if(ridx<0) ridx = 0;
    if(cidx>=8) cidx = 7;
    if(ridx>=8) cidx = 7;
    
    if(getPieceColor(board[ridx][cidx]) == player_turn){
        can_move_position = [];
        selected_piece_row = ridx;
        selected_piece_col = cidx;
        let checking;
        can_move_position = getMoveablePosition(ridx, cidx, player_turn);

        if(checking==1&&isFinish()){
            alert("CheckMate");
        }
    }
    else{
        // 움직일 수 있다는 표시가 떴다면
        let move_flag = false;
        can_move_position.forEach((arr)=>{
            i=arr[0]; j=arr[1];
            if(i==ridx && j==cidx){
                move_flag = true;
            }
        });
        // 움직여라
        if(move_flag){
            // move piece
            var death = MovePiece(board, selected_piece_row, selected_piece_col, ridx, cidx);
            can_move_position = [];
            
            // time
            if(player_turn == 'white'){
                white_time = white_time - Math.round((Date.now()-last_time)/1000);
                last_time=Date.now();
                document.getElementById("white_time").style.color = "#000000";
            }
            else{
                black_time = black_time - Math.round((Date.now()-last_time)/1000);
                last_time=Date.now();
                document.getElementById("black_time").style.color = "#000000"
            }

            // death list
            if(death != 0){
                if(player_turn == 'white') black_death.push(death);
                if(player_turn == 'black') white_death.push(death);
            }

            // check finish
            if(isFinish()){
                alert('checkmate');
            }
 
            ChangeTurn(); // 턴을 바꾼다     
        }
        else{
            can_move_position = []
        }
        
    }

    onUpdate();
});
document.getElementsByClassName('right_container').height = canvas.height;
document.getElementsByClassName('left_container').height = canvas.height;

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
        sprite: new Sprite('img/rook_b.png', ctx)
    },
    black_knight: {
        id: 2,
        src: 'img/Chess_ndt45.svg.png',
        sprite: new Sprite('img/knight_b.png', ctx)
    },
    black_bishop: {
        id: 3,
        src: 'img/Chess_bdt45.svg.png',
        sprite: new Sprite('img/bishop_b.png', ctx)
    },
    black_queen: {
        id: 4,
        src: 'img/Chess_qdt45.svg.png',
        sprite: new Sprite('img/queen_b.png', ctx)
    },
    black_king: {
        id: 5,
        src: 'img/Chess_kdt45.svg.png',
        sprite: new Sprite('img/king_b.png', ctx)
    },
    black_pawn:{
        id: 6,
        src: 'img/Chess_pdt45.svg.png',
        sprite: new Sprite('img/pawn_b.png', ctx)
    },
    white_rook: {
        id: 7,
        src: 'img/Chess_rlt45.svg.png',
        sprite: new Sprite('img/rook_w.png', ctx)
    },
    white_knight: {
        id: 8,
        src: 'img/Chess_nlt45.svg.png',
        sprite: new Sprite('img/knight_w.png', ctx)
    },
    white_bishop: {
        id: 9,
        src: 'img/Chess_blt45.svg.png',
        sprite: new Sprite('img/bishop_w.png', ctx)
    },
    white_queen: {
        id: 10,
        src: 'img/Chess_qlt45.svg.png',
        sprite: new Sprite('img/queen_w.png', ctx)
    },
    white_king: {
        id: 11,
        src: 'img/Chess_klt45.svg.png',
        sprite: new Sprite('img/king_w.png', ctx)
    },
    white_pawn: {
        id: 12,
        src: 'img/Chess_plt45.svg.png',
        sprite: new Sprite('img/pawn_w.png', ctx)
    }
}
checker_sprite = new Sprite('img/checker.png', ctx);

function DrawChessPieces(val, cx, cy){
    let w = rect_width;
    let h = rect_height;
    switch(val){
        case 1:
            chess_pieces.black_rook.sprite.DrawImage(cx, cy, w, h);  
            break;
        case 2:
            chess_pieces.black_knight.sprite.DrawImage(cx, cy, w, h);  
            break;
        case 3:
            chess_pieces.black_bishop.sprite.DrawImage(cx, cy, w, h);  
            break;
        case 4:
            chess_pieces.black_queen.sprite.DrawImage(cx, cy, w, h);  
            break;
        case 5:
            chess_pieces.black_king.sprite.DrawImage(cx, cy, w, h);  
            break;
        case 6:
            chess_pieces.black_pawn.sprite.DrawImage(cx, cy, w, h);  
            break;
        case 7:
            chess_pieces.white_rook.sprite.DrawImage(cx, cy, w, h);  
            break;
        case 8:
            chess_pieces.white_knight.sprite.DrawImage(cx, cy, w, h);  
            break;
        case 9:
            chess_pieces.white_bishop.sprite.DrawImage(cx, cy, w, h);  
            break;
        case 10:
            chess_pieces.white_queen.sprite.DrawImage(cx, cy, w, h);  
            break;
        case 11:
            chess_pieces.white_king.sprite.DrawImage(cx, cy, w, h);  
            break;
        case 12:
            chess_pieces.white_pawn.sprite.DrawImage(cx, cy, w, h);  
            break;
    }
}
function InitDraw(){
    ctx.beginPath();
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#D0B8A8"
    ctx.fill();
    ctx.closePath();
}

function DrawBoard() {
    // draw board
    board.forEach((row, ridx) =>{
        row.forEach((val, cidx)=>{
            if((ridx+cidx)%2 == 1){
                ctx.fillStyle = "#85586F";
            }
            else{
                ctx.fillStyle = "#f8ede3";
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
    
    // draw checker
    let checker_size = rect_width;
    can_move_position.forEach((pos, idx)=>{
        i = pos[0]; j = pos[1];
        checker_sprite.DrawImage(j*rect_width+start_x, i*rect_width+start_y, checker_size, checker_size);
    })
    
    // draw turn indicator bunnies
    if(player_turn == 'white'){
        document.getElementById('wh_bunny').src = "img/wh_bunny_turn.png";
        document.getElementById('bl_bunny').src = "img/bl_bunny.png";
    }
    else{
        document.getElementById('wh_bunny').src = "img/wh_bunny.png";
        document.getElementById('bl_bunny').src = "img/bl_bunny_turn.png";
    }
    
}
// 시간, 누구 턴인지, 
InitDraw();

function onUpdate(){
    DrawBoard();
}

setTimeout(()=>{
    onUpdate();
}, 100);





