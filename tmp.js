
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
let isCastling = [];//if data is 0, then this piece can be castling

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
    for(let i=0;i<6;i++){
        isCastling[i]=0;//has moved?
    }
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
    //if(castling(sr,sc,fr,fc,player_turn)) flag=true; //castling
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
    if(board[sr][sc]%6==5){//if king is selected, then no castling
        if(sr==4&&sc==0) isCastling[0]=1;
        if(sr==4&&sc==7) isCastling[3]=1;
    }
    if(board[sr][sc]&6==1){//if rook is selected, then no castling
        if(sr==0&&sc==0||fr==0&&fc==0) isCastling[1]=1;
        if(sr==0&&sc==7||fr==0&&fc==7) isCastling[2]=1;
        if(sr==7&&sc==0||fr==7&&fc==0) isCastling[4]=1;
        if(sr==7&&sc==7||fr==7&&fc==7) isCastling[5]=1;
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
        //여기서 캐슬링 가능한 좌표 푸시, 앙파상 가능한 좌표 푸시
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

/*function castling(kr,kc,rr,rc,player_turn){
//입력으로 들어온 왕과 룩의 좌표에서 케슬링이 가능하면 true 불가능하면 fasle 반환
//condition1. no pieces between Rook and King
//condition2. Rook and King haven't move
//condition3. the places where king is located and to be moved must be unattackable
//then, move king 2 spaces toward the RooK and move Rook next to the king's other side
//isCastling [0]bK [1]bLeftR [2]bRightR [3]wK [4]wLeftR [5]wRightR
    //condition1.
    if(kc<rc){
        for(let i=kc+1;i<rc;i++){
            if(board[kr][i]!=0) return false;
        }
    }
    else{
        for(let i=kc-1;i>rc;i--){
            if(board[kr][i]!=0) return false;
        }
    }
    //condition 2,3
    if(kr==0&&kc==4&&rr==0&&rc==0){
        if(isCastling[0]==1) return false;
        if(isCastling[1]==1) return false;
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                for(let k=4;k>0;k--){
                    //if(CanMove(board,i,j,0,k,'white')) return false;
                }
            }
        }
    }
    if(kr==0&&kc==4&&rr==0&&rc==7){
        if(isCastling[0]==1) return false;
        if(isCastling[2]==1) return false;
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                for(let k=4;k<7;k++){
                    //if(CanMove(board,i,j,0,k,'white')) return false;
                }
            }
        }
    }
    if(kr==7&&kc==4&&rr==7&&rc==0){
        if(isCastling[3]==1) return false;
        if(isCastling[4]==1) return false;
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                for(let k=4;k>0;k--){
                    //if(CanMove(board,i,j,7,k,'black')) return false;
                }
            }
        }
    }
    if(kr==7&&kc==4&&rr==7&&rc==7){
        if(isCastling[3]==1) return false;
        if(isCastling[5]==1) return false;
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                for(let k=4;k<7;k++){
                    //if(CanMove(board,i,j,0,k,'black')) return false;
                }
            }
        }
    }

    return true;
}

function enPassant(){
    //적 폰이 두칸 움직인 바로 다음, 적 폰이 한칸만 움직인 자리에 내 폰이 갈수 잇으면 그 폰을 잡을 권리가 주어짐
    //잡을지 말지 결정할수잇도록 해야함
}*/

InitBoard();
GameStart();