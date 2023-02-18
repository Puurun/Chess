
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
let promotion_r;
let promotion_c;
let castling_check= [];
let castling_flag;
let last_move = [];
let en_passant_flag;

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
    for(let i=0;i<=4;i++){
        last_move[i]=0;
    }
    for(let i=0;i<=5;i++){
        castling_check[i]=false;
    }
    en_passant_flag=false;
    castling_flag=false;
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
function MovePiece(board, sr, sc, fr, fc,option){
    let deathCode = 0;
    if(en_passant_flag){
        if(board[sr][sc]%6==0&&Math.abs(sc-fc)==1&&board[fr][fc]==0){
            if(player_turn=='black'){
                board[last_move[2]+1][last_move[3]]=board[last_move[2]][last_move[3]];
                board[last_move[2]][last_move[3]]=0;
            }
            if(player_turn=='white'){
                board[last_move[2]-1][last_move[3]]=board[last_move[2]][last_move[3]];
                board[last_move[2]][last_move[3]]=0;
            }
        }
    }
    if(castling_flag){
        if(sr==0&&sc==4&&fr==0&&fc==1){
            board[0][2]=board[0][0];
            board[0][0]=0;
        }
        if(sr==0&&sc==4&&fr==0&&fc==6){
            board[0][5]=board[0][7];
            board[0][7]=0;
        }
        if(sr==7&&sc==4&&fr==7&&fc==1){
            board[7][2]=board[7][0];
            board[7][0]=0;
        }
        if(sr==7&&sc==4&&fr==7&&fc==6){
            board[7][5]=board[7][7];
            board[7][7]=0;
        }
    }
    if(getPieceColor(board[fr][fc]) != 0){
        deathCode = board[fr][fc];
    }
    board[fr][fc] = board[sr][sc];
    board[sr][sc] = 0;
    if(option){
        last_move[0]=sr;
        last_move[1]=sc;
        last_move[2]=fr;
        last_move[3]=fc;
        last_move[4]=board[fr][fc];
        if(sr==0&&sc==0) castling_check[0]=true;//black left rook
        else if(sr==0&&sc==4) castling_check[1]=true;//black king
        else if(sr==0&&sc==7) castling_check[2]=true;//black right rook
        else if(sr==7&&sc==0) castling_check[3]=true;//white left rook
        else if(sr==7&&sc==4) castling_check[4]=true;//white king
        else if(sr==7&&sc==7) castling_check[5]=true;//white right rook
    }

    return deathCode;
}

function AfterMove(fr, fc){
    // related to logic after the move
    // pawn
    if(board[fr][fc] == 6 || board[fr][fc] == 12){
        let check_row;

        if(player_turn == 'white') check_row = 0;
        else check_row = 7;

        if(fr == check_row){
            promotion_r = fr;
            promotion_c = fc;
            DrawPromotion(player_turn);
        }
    }
}


function isFinish(player_turn){
    let false_flag = false;
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            // 상대방 말일 때 움직일 수 있는 거 다 움직여보고
            // 그래도 체크라면 체크메이트
            if(player_turn == 'white'){
                if(getPieceColor(board[i][j]) == 'black'){
                    let temp = getMoveablePosition(board,i, j, 'black');
                    temp.forEach(element => {
                        let board_clone = board.clone();
                        MovePiece(board_clone, i, j, element[0], element[1],false);
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
                    let temp = getMoveablePosition(board,i, j, 'white');
                    temp.forEach(element => {
                        let board_clone = board.clone();
                        MovePiece(board_clone, i, j, element[0], element[1],false);
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

function getMoveablePosition(board,r, c, player_turn){
    can_pos = []
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(CanMove(board, r, c, i, j, player_turn) == true){
                let board_clone = board.clone();
                MovePiece(board_clone, r, c, i, j,false);
                if(!isCheck(board_clone, player_turn)){
                    can_pos.push([i, j]);
                }
            }
        }
    }
    let En_passant_tmp=En_passant(r,c,player_turn);
    if(en_passant_flag){
        can_pos.push(En_passant_tmp.pop());
    }
    let Castling_tmp=Castling(board,r,c,player_turn);
    if(castling_flag){
        for(let i=0;i<Castling_tmp.length;i++){
            can_pos.push(Castling_tmp.pop());
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

function Promotion(r, c, id){
    console.log('hey');
    board[r][c] = id;
    promotion_flag = false;
    document.getElementById('promotion').innerHTML = '';
    onUpdate();

}

function Castling(board,r,c,player_turn){
    can_castling=[]
    if(player_turn=='white'){
        if(r==7&&c==4&&castling_check[4]==false){
            if(castling_check[3]==false){
                if(forCastling(board,7,3)&&forCastling(board,7,2)&&forCastling(board,7,1)){
                    can_castling.push([7,1]);
                }
            }
            if(castling_check[5]==false){
                if(forCastling(board,7,5)&&forCastling(board,7,6)){
                    can_castling.push([7,6]);
                }
            }
        }
    }
    if(player_turn=='black'){
        if(r==0&&c==4&&castling_check[1]==false){
            if(castling_check[0]==false){
                if(forCastling(board,0,1)&&forCastling(board,0,2)&&forCastling(board,0,3)){
                    can_castling.push([0,1]);
                }
            }
            if(castling_check[2]==false){
                if(forCastling(board,0,5)&&forCastling(board,0,6)){
                    can_castling.push([0,6]);
                }
            }
        }
    }
    if(can_castling.length==0){
        castling_flag=false;
    }else{
        castling_flag=true;
    }
    return can_castling;
}

function forCastling(board,row, col){
    let krow,kcol,kingID;
    if(board[row][col]!=0) {
        return false;
    }
    if(player_turn=='white'){
        krow=7;
        kcol=4;
    }
    else{
        krow=0;
        kcol=4;
    }
    board[row][col]=board[krow][kcol];
    kingID=board[krow][kcol];
    board[krow][kcol]=0;
    if(isCheck(board,player_turn)){
        board[row][col]=0;
        board[krow][kcol]=kingID;
        return false;
    }
    board[row][col]=0;
    board[krow][kcol]=kingID;
    return true;
}

function En_passant(last_row,last_col,player_turn){
    can_enpassant= []
    if(player_turn=='white'){
        if(last_move[0]==1&&last_move[2]==3&&last_move[4]%6==0){
            if(last_row==3&&Math.abs(last_col-last_move[3])==1){
                en_passant_flag=true;
                can_enpassant.push([last_row-1,last_move[3]]);
                return can_enpassant;
                //앙파상 조건 충족 [r-1][last_move[3]]으로 이동 가능
            }
        }
    }
    if(player_turn=='black'){
        if(last_move[0]==6&&last_move[2]==4&&last_move[4]%6==0){
            if(last_row==4&&Math.abs(last_col-last_move[3])==1){
                en_passant_flag=true;
                can_enpassant.push([last_row+1,last_move[3]]);
                return can_enpassant;
                //앙파상 조건 충족 [r+1][last_move[3]]으로 이동 가능
            }
        }
    }
    en_passant_flag=false;
    return can_enpassant;
}

InitBoard();
GameStart();