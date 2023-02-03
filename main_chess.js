
let player_turn = '';
let board = [];

for(let i=0; i<8; i++){
    board[i] = [];
    for(let j=0; j<8; j++){
        board[i][j] = 0;
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


function GetCommand(){
    
}

function getPieceColor(piece){
    if(0 < piece && piece <= 6){
        return 'black';
    }
    else if(piece > 7){
        return 'white';
    }
    return 'nothing';
}

function HandlePawn(sr, sc, fr, fc, player_turn){
    let moveRow=fr-sr;
    let moveCol=fc-sc;

    console.log(sr, moveCol, moveRow);
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

function HandleBishop(sr, sc, fr, fc, player_turn){

}

function CanMove(sr, sc, fr, fc, player_turn){
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
            return HandlePawn(sr, sc, fr, fc, player_turn);
        case 1:
            break;
    }

    return false;
}

// moves piece, and returns death piece code if dead
function MovePiece(sr, sc, fr, fc){
    let deathCode = 0;

    if(getPieceColor(board[fr][fc]) != 0){
        deathCode = board[fr][fc];
    }
    board[fr][fc] = board[sr][sc];
    board[sr][sc] = 0;
    
    return deathCode;
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

InitBoard();
GameStart();