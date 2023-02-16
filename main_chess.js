
let player_turn = '';
let board = [];
let board_copy;
let white_death = [];
let black_death = [];
let board_history;
let black_check;
let white_check;
let black_time;
let white_time;

Array.prototype.clone = function() {
    var arr = this.slice(0);
    for( var i = 0; i < this.length; i++ ) {
        if( this[i].clone ) {
            //recursion
            arr[i] = this[i].clone();
        }
    }
    return arr;
}

function InitBoard(){
    board_history = [];
    black_time = 3000;
    white_time = 3000;
    black_check = false;
    white_check = false;
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
    
    for(let i=0; i<8; i++){
        board[i] = [];
        for(let j=0; j<8; j++){
            board[i][j] = 0;
        }
    }
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
    white_death = [];
    black_death = [];
}

function getPieceColor(piece){
    if(0 < piece && piece <= 6){
        return 'black';
    }
    else if(piece >= 7){
        return 'white';
    }
    return 'nothing';
}

function HandlePawn(board, sr, sc, fr, fc, player_turn){
    let moveRow=fr-sr;
    let moveCol=fc-sc;

    if(player_turn === 'white'){
        if(moveRow==-1 &&
            Math.abs(moveCol)==1 &&
            getPieceColor(board[fr][fc]) == 'black'){
                return true;
        }
        if(board[fr][fc] != 0) {
            return false;
        }
        if(sr==6 &&
            moveCol==0 &&
            moveRow==-2 &&
            board[sr-1][sc] == 0){
                return true;
            }
        if(moveCol==0 && moveRow==-1){
            return true;
        }
    }
    if(player_turn == 'black'){
        if(moveRow==1 &&
            Math.abs(moveCol)==1 &&
            getPieceColor(board[fr][fc]) == 'white'){
                return true;
            }
        if(board[fr][fc] !== 0){
            return false;
        }
        if(sr==1 &&
            moveCol==0 &&
            moveRow==2 &&
            board[sr+1][sc]==0){
                return true;
            }
        if(moveCol==0&&moveRow==1){
            return true;
        }
    }
    return false;
}

function HandleRook(board, sr, sc, fr, fc, player_turn){
    let moveRow=fr-sr;
    let moveCol=fc-sc;
    let flag = false;
    // up/down
    if(Math.abs(moveRow) != 0 && moveCol == 0){
        flag = true;
        if(sr<fr){
            for(let i=sr+1; i<fr; i++){
                if(board[i][sc] != 0){
                    return false;
                }
            }
        }
        else{
            for(let i=sr-1; i>fr; i--){
                if(board[i][sc] != 0){
                    return false;
                }
            }
        }
    }
    // left/right
    if(Math.abs(moveCol)!=0 && moveRow == 0){
        flag = true;
        if(sc<fc){
            for(let i=sc+1; i<fc; i++){
                if(board[sr][i] != 0){
                    return false;
                }
            }
            for(let i=sc-1; i>fc; i--){
                if(board[sr][i] != 0){
                    return false;
                }
            }
        }
        else{
            for(let i=sc-1;i>fc;i--){
                if(board[sr][i] != 0) {
                    return false;
                }
            }
        }
    }

    if(!flag){
        return false;
    }
    return true;
}
function HandleKnight(board, sr, sc, fr, fc, player_turn){
    let moveRow=fr-sr;
    let moveCol=fc-sc;
    let flag = false;
    if(Math.abs(moveRow)==2 && Math.abs(moveCol)==1) flag = true;
    if(Math.abs(moveRow)==1 && Math.abs(moveCol)==2) flag = true;
    return flag;
}
function HandleBishop(board, sr, sc, fr, fc, player_turn){
    let moveRow=fr-sr;
    let moveCol=fc-sc;
    let i, j;
    let flag = false;
    if(moveRow != 0 && Math.abs(moveRow) == Math.abs(moveCol)){
        flag = true;
        if(sr<fr&&sc<fc){//우하향
            for(i=sr+1, j=sc+1;i<fr;i++,j++){
                if(board[i][j] != 0) {
                    return false;
                }
            }
        }
        else if(sr<fr&&sc>fc){//좌하향
            for(i=sr+1,j=sc-1;i<fr;i++,j--){
                if(board[i][j]!=0) {
                    return false;
                }
            }
        }
        else if(sr>fr&&sc<fc){//우상향
            for(i=sr-1,j=sc+1;i>fr;i--,j++){
                if(board[i][j]!=0) {
                    return false;
                }
            }
        }
        else{//좌상향
            for(i=sr-1,j=sc-1;i>fr;i--,j--){
                if(board[i][j]!=0) {
                    return false;
                }
            }
        }
    }
    if(!flag) return false;
    return true;
}
function HandleQueen(board, sr, sc, fr, fc, player_turn){
    let moveRow=fr-sr;
    let moveCol=fc-sc;
    let i, j;
    let flag = false;

    // 걍 룩 비숍 복사
    if(moveRow != 0 && Math.abs(moveRow) == Math.abs(moveCol)){
        flag = true;
        if(sr<fr&&sc<fc){//우하향
            for(i=sr+1, j=sc+1;i<fr;i++,j++){
                if(board[i][j] != 0) {
                    return false;
                }
            }
        }
        else if(sr<fr&&sc>fc){//좌하향
            for(i=sr+1,j=sc-1;i<fr;i++,j--){
                if(board[i][j]!=0) {
                    return false;
                }
            }
        }
        else if(sr>fr&&sc<fc){//우상향
            for(i=sr-1,j=sc+1;i>fr;i--,j++){
                if(board[i][j]!=0) {
                    return false;
                }
            }
        }
        else{//좌상향
            for(i=sr-1,j=sc-1;i>fr;i--,j--){
                if(board[i][j]!=0) {
                    return false;
                }
            }
        }
    }

    // up/down
    if(Math.abs(moveRow) != 0 && moveCol == 0){
        flag = true;
        if(sr<fr){
            for(let i=sr+1; i<fr; i++){
                if(board[i][sc] != 0){
                    return false;
                }
            }
        }
        else{
            for(let i=sr-1; i>fr; i--){
                if(board[i][sc] != 0){
                    return false;
                }
            }
        }
    }
    // left/right
    if(Math.abs(moveCol)!=0 && moveRow == 0){
        flag = true;
        if(sc<fc){
            for(let i=sc+1; i<fc; i++){
                if(board[sr][i] != 0){
                    return false;
                }
            }
            for(let i=sc-1; i>fc; i--){
                if(board[sr][i] != 0){
                    return false;
                }
            }
        }
        else{
            for(let i=sc-1;i>fc;i--){
                if(board[sr][i] != 0) {
                    return false;
                }
            }
        }
    }

    if(!flag){
        return false;
    }
    return true;
}
function HandleKing(board, sr, sc, fr, fc, player_turn){
    let moveRow=fr-sr;
    let moveCol=fc-sc;
    let flag = false;
    if(Math.abs(moveRow)==1&&moveCol==0) flag = true;
    if(Math.abs(moveCol)==1&&moveRow==0) flag = true;
    if(Math.abs(moveCol)==1&&Math.abs(moveRow)==1) flag = true;
    if(!flag) return false;
    return true;
}


function CanMove(board, sr, sc, fr, fc, player_turn){
    if(sc <0||sr>=8||sc<0||sc>=8||fr<0||fr>=8||fc<0||fc>=8){
        return false;
    }
    
    if(getPieceColor(board[sr][sc]) !== player_turn){
        return false;
    }

    if(getPieceColor(board[fr][fc]) === player_turn){
        return false;
    }
    
    // nothing on the board
    if(board[sr][sc] == 0){
        return false;
    }


    switch(board[sr][sc]%6){
        case 0: // PAWN
            return HandlePawn(board, sr, sc, fr, fc, player_turn);
        case 1: // ROOK
            return HandleRook(board, sr, sc, fr, fc, player_turn);
        case 2:
            return HandleKnight(board, sr, sc, fr, fc, player_turn);
        case 3:
            return HandleBishop(board, sr, sc, fr, fc, player_turn);
        case 4:
            return HandleQueen(board, sr, sc, fr, fc, player_turn);
        case 5:
            return HandleKing(board, sr, sc, fr, fc, player_turn);
    }

    return false;
}

// moves piece, and returns death piece code if dead
function MovePiece(board, sr, sc, fr, fc){
    let deathCode = 0;

    if(getPieceColor(board[fr][fc]) != 0){
        deathCode = board[fr][fc];
    }
    board[fr][fc] = board[sr][sc];
    board[sr][sc] = 0;
    
    // related to logic after the move
    // pawn
    if(board[fr][fc]%6 == 0){
        let check_row;

        if(player_turn == 'white') check_row = 0;
        else check_row = 7;

        if(fr == check_row) Promotion(fr, fc);
    }

    return deathCode;
}


function isFinish(player_turn){
    let false_flag = false;
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            // 상대방 말일 때 움직일 수 있는 거 다 움직여보고
            // 그래도 체크라면 체크메이트
            if(player_turn == 'white'){
                if(getPieceColor(board[i][j]) == 'black'){
                    let temp = getMoveablePosition(i, j, 'black');
                    temp.forEach(element => {
                        let board_clone = board.clone();
                        MovePiece(board_clone, i, j, element[0], element[1]);
                        if(isCheck(board_clone, 'black') == false){
                            false_flag = true;
                        }

                    });
                    if(false_flag == true){
                        return false;
                    }
                }
            }
            else if(player_turn == 'black'){
                if(getPieceColor(board[i][j]) == 'white'){
                    console.log('qqq');
                    let temp = getMoveablePosition(i, j, 'white');
                    temp.forEach(element => {
                        let board_clone = board.clone();
                        MovePiece(board_clone, i, j, element[0], element[1]);
                        if(isCheck(board_clone, 'white') == false){
                            false_flag = true;
                        }
                    });
                    
                    if(false_flag == true){
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

function isCheck(board, player_turn){
    let kwr, kwc, kbr, kbc;
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(board[i][j]%6 == 5){
                if(getPieceColor(board[i][j]) == 'white'){
                    kwr = i; kwc = j;
                }
                else{
                    kbr = i; kbc = j;
                }
            }
        }
    }
    // check if white king is being attacked
    if(player_turn == 'white'){
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                if(CanMove(board, i, j, kwr, kwc, 'black')){
                    return true;
                }
            }
        }
    }

    // check if black king is being attacked
    else{
        for(let i=0; i<8; i++){
            for(let j=0; j<8; j++){
                if(CanMove(board, i, j, kbr, kbc, 'white')){
                    return true;
                }
            }
        }
    }
    return false;
}

function getMoveablePosition(r, c, player_turn){
    can_pos = []
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(CanMove(board, r, c, i, j, player_turn) == true){
                let board_clone = board.clone();
                MovePiece(board_clone, r, c, i, j);
                if(!isCheck(board_clone, player_turn)){
                    can_pos.push([i, j]);
                }
            }
        }
    }
    return can_pos;
}

function ChangeTurn(){
    if(player_turn == 'white'){
        player_turn = 'black';
    }
    else{
        player_turn = 'white';
    }
}
function GameStart(){
    player_turn = 'white';
}

function ResetGame(){
    GameStart();
    InitBoard();
    onUpdate();
}

// TODO: has to undo death list
function UndoGame(){
    if(board_history.length > 0){
        board = board_history.pop().clone();
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
        onUpdate();
        ChangeTurn();
        
    }
}

function Promotion(r, c){
    
}

InitBoard();
GameStart();