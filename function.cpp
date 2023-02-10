#include "header.h"

void init(game* gv){
    gv->chess_board=new board_piece*[BOARD_SIZE];
    for(int i=0;i<BOARD_SIZE;i++){
        gv->chess_board[i]=new board_piece[BOARD_SIZE];
    }
    for(int i=0;i<BOARD_SIZE;i++){
        gv->chess_board[7][i].player=PLAYER1;
    }
    gv->chess_board[7][0].piece=gv->chess_board[7][7].piece=ROOK;
    gv->chess_board[7][1].piece=gv->chess_board[7][6].piece=KNIGHT;
    gv->chess_board[7][2].piece=gv->chess_board[7][5].piece=BISHOP;
    gv->chess_board[7][3].piece=KING;
    gv->chess_board[7][4].piece=QUEEN;
    for(int i=0;i<BOARD_SIZE;i++){
        gv->chess_board[6][i].player=PLAYER1;
        gv->chess_board[6][i].piece=PAWN;
    }
    for(int i=0;i<BOARD_SIZE;i++){
        gv->chess_board[0][i].player=PLAYER2;
    }
    gv->chess_board[0][0].piece=gv->chess_board[0][7].piece=ROOK;
    gv->chess_board[0][1].piece=gv->chess_board[0][6].piece=KNIGHT;
    gv->chess_board[0][2].piece=gv->chess_board[0][5].piece=BISHOP;
    gv->chess_board[0][3].piece=QUEEN;
    gv->chess_board[0][4].piece=KING;
    for(int i=0;i<BOARD_SIZE;i++){
        gv->chess_board[1][i].player=PLAYER2;
        gv->chess_board[1][i].piece=PAWN;
    }
    
    for(int i=2;i<BOARD_SIZE-2;i++){
        for(int j=0;j<BOARD_SIZE;j++){
            gv->chess_board[i][j].piece=NEWTRAL;
            gv->chess_board[i][j].player=NEWTRAL;
        }
    }
    //board판 설정 완료
    cout<<"player1의 이름을 입력하시오 : ";
    cin>>gv->p1.name;
    gv->p1.player_code=PLAYER1;
    gv->p1.color=WHITE;
    //player1 설정 완료
    cout<<"player2의 이름을 입력하시오 : ";
    cin>>gv->p2.name;
    gv->p2.player_code=PLAYER2;
    gv->p2.color=BLACK;
    //player2 설정 완료
    gv->player_turn=PLAYER1;
    //player순서 설정 완료. WHITE(1p)선공
    gv->DL.p1Num=0;
    gv->DL.p2Num=0;
    //deathNode설정 완료
    gv->finishFlag=false;
}

void finish(game* gv){
    int winner=gv->player_turn;
    cout<<"\n\n###################\n"<<winner<<" win.\n";
    cout<<"Game Over!\n###################\n";
    for(int i=0;i<BOARD_SIZE;i++){
        delete[] gv->chess_board[i];
    }
    delete[] gv->chess_board;
}

void gameStart(game* gv){
    cout<<"GameStart\n";
    while(!(gv->finishFlag)){
        printBoard(gv); //순서, 체스보드, 죽은 말 출력
        int startR,finishR,startC,finishC;
        getCommand(gv,&startR,&startC,&finishR,&finishC);//이동 좌표 입력(항상 올바른 값)
        if(startR==-1&&startC==-1&&finishR==-1&&finishC==-1) {//기권
            gv->player_turn=PLAYER1?PLAYER2:PLAYER1;
            break;
        }
        int death=movePiece(gv,startR,startC,finishR,finishC);//말을 이동시킴, 죽으면 죽은 값 반환
        if(death!=0){//죽은 말이 있다면
            addDeathList(gv,death);//죽은 말을 deathList에 추가
        }
        if(gv->player_turn==1) gv->player_turn=2;
        else gv->player_turn=1;
        //player 순서를 바꿔줌
        cout<<"\n=================================\n";
    }    
}

int isCheckMate(game* gv,int startR,int startC,int finishR, int finishC){
    int flag=2;//내가 당하면 0, 상대방 킹을 체크메이트 1, 체크메이트 없으면 2, 상대방을 잡으면 3
    int K1row,K1col,K2row,K2col;
    game copy_gv;
    copy_gv.player_turn=gv->player_turn;
    copy_gv.chess_board=new board_piece*[BOARD_SIZE];
    for(int i=0;i<BOARD_SIZE;i++){
        copy_gv.chess_board[i]=new board_piece[BOARD_SIZE];
        for(int j=0;j<BOARD_SIZE;j++){
            copy_gv.chess_board[i][j].piece=gv->chess_board[i][j].piece;
            copy_gv.chess_board[i][j].player=gv->chess_board[i][j].player;
        }
    }

    int tmp=movePiece(&copy_gv,startR,startC,finishR,finishC);
    if(tmp==KING) flag=3;
    if(flag!=3){//두 왕이 모두 살아있다면
        for(int i=0;i<BOARD_SIZE;i++){//왕 좌표 저장
            for(int j=0;j<BOARD_SIZE;j++){
                if(copy_gv.chess_board[i][j].piece==KING){
                    if(copy_gv.chess_board[i][j].player==PLAYER1){
                        K1row=i;
                        K1col=j;
                    }
                    else{
                        K2row=i;
                        K2col=j;
                    }
                }
            }
        }   
        for(int i=0;i<BOARD_SIZE;i++){
            for(int j=0;j<BOARD_SIZE;j++){
                if(copy_gv.chess_board[i][j].player==PLAYER1&&isMove(&copy_gv,i,j,K2row,K2col,PLAYER1)) {//PLAYER2의 왕이 죽을 수 있음
                    if(gv->player_turn==PLAYER1) flag=1;//상대방 왕 체크 메이트
                    else flag=0; //내 왕이 죽을 수 있음
                }
                else if(copy_gv.chess_board[i][j].player==PLAYER2&&isMove(&copy_gv,i,j,K1row,K1col,PLAYER2)){//PLAYER1의 왕이 죽을 수 있음
                    if(gv->player_turn==PLAYER2) flag=1; //상대방 왕 체크 메이트
                    else flag=0; //내 왕이 죽을 수 있음
                }
            }
        } 
    }
    for(int i=0;i<BOARD_SIZE;i++){
        delete[] copy_gv.chess_board[i];
    }
    delete[] copy_gv.chess_board;
    
    return flag;
    
    /*cout<<"flag="<<flag<<"\n";
    if(flag==0){
        cout<<"CHECK MATE!MY KING COULD DIE.\n";
        return true;
    }
    else if(flag==1){
        cout<<"CHECK MATE!YOUR KING COULD DIE\n";
        return false;
    }
    else if(flag==2){
        return false;
    }
    else{
        cout<<"YOUR KING IS DEAD!\n";
        return false;
    }*/
}

void getCommand(game* gv,int* startR,int* startC,int* finishR,int* finishC){
    int sr,sc,fr,fc;
    int checking;
    while(true){
        cout<<"이동좌표 입력(출발행 출발열 도착행 도착열 / 기권은 -1 -1 -1 -1) : ";
        cin>>sr>>sc>>fr>>fc;
        if(sr==-1&&sc==-1&&fr==-1&&fc==-1) break;
        
        if(isMove(gv,sr,sc,fr,fc,gv->player_turn)){
            checking=isCheckMate(gv,sr,sc,fr,fc);
            if(checking==0) cout<<"CHECK MATE!MY KING COULD DIE.\n";
            else if(checking==1) cout<<"CHECK MATE!YOUR KING COULD DIE.\n";
            if(checking>=1){
                break;
            }
        }//움직일 수 있는 곳이고, 체크메이트가 아니면
    }
    if(checking==1&&isFinish(gv)){
        gv->finishFlag=true;
    }
    *startR=sr;
    *startC=sc;
    *finishR=fr;
    *finishC=fc;
}

bool isMove(game* gv,int sr,int sc ,int fr,int fc,int pt){
    if(sr<0||sr>=BOARD_SIZE||sc<0||sc>=BOARD_SIZE||fr<0||fr>=BOARD_SIZE||fc<0||fc>=BOARD_SIZE){
        return false;
    }
    //움직인 위치가 보드 범위 밖일 때
    if(pt!=gv->chess_board[sr][sc].player){
        return false;
    }
    //자신의 말이 아닌데 옮기려 할 때
    if(gv->chess_board[fr][fc].player==pt){
        return false;
    }
    //움직인 위치에 자신의 말이 있을 때
    if(gv->chess_board[sr][sc].piece==PAWN){
        int moveRow=fr-sr;
        int moveCol=fc-sc;
        if(pt==PLAYER1){
            if(moveRow==-1&&abs(moveCol)==1&&gv->chess_board[fr][fc].player==PLAYER2) return true; //상대방 말이 있어서 대각선 이동
            if(gv->chess_board[fr][fc].piece!=NEWTRAL) return false;
            if(sr==BOARD_SIZE-2&&moveCol==0&&moveRow==-2&&gv->chess_board[sr-1][sc].piece==NEWTRAL) return true;// 빈공간일때만 이동 가능하게 변경
            if(moveCol==0&&moveRow==-1) return true;
        }
        if(pt==PLAYER2){
            if(moveRow==1&&abs(moveCol)==1&&gv->chess_board[fr][fc].player==PLAYER1) return true; //상대방 말이 있어서 대각선 이동
            if(gv->chess_board[fr][fc].piece!=NEWTRAL) return false;
            if(sr==1&&moveCol==0&&moveRow==2&&gv->chess_board[sr+1][sc].piece==NEWTRAL) return true;// 빈공간일때만 이동 가능하게 변경
            if(moveCol==0&&moveRow==1) return true;
        }
        return false;
    }
    if(gv->chess_board[sr][sc].piece==BISHOP){
        int moveRow=fr-sr;
        int moveCol=fc-sc;
        bool flag=false;
        if(moveRow!=0&&(abs(moveRow)==abs(moveCol))){//대각선 무제한 이동
            flag=true;
            if(sr<fr&&sc<fc){//우하향
                for(int i=sr+1,j=sc+1;i<fr;i++,j++){
                    if(gv->chess_board[i][j].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
            else if(sr<fr&&sc>fc){//좌하향
                for(int i=sr+1,j=sc-1;i<fr;i++,j--){
                    if(gv->chess_board[i][j].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
            else if(sr>fr&&sc<fc){//우상향
                for(int i=sr-1,j=sc+1;i>fr;i--,j++){
                    if(gv->chess_board[i][j].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
            else{//좌상향
                for(int i=sr-1,j=sc-1;i>fr;i--,j--){
                    if(gv->chess_board[i][j].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
        }
        if(!flag) return false;
    }
    if(gv->chess_board[sr][sc].piece==KNIGHT){
        int moveRow=fr-sr;
        int moveCol=fc-sc;
        bool flag=false;
        if(abs(moveRow)==2&&abs(moveCol)==1) flag=true;
        if(abs(moveRow)==1&&abs(moveCol)==2) flag=true;
        if(!flag) return false;
    }
    if(gv->chess_board[sr][sc].piece==ROOK){
        int moveRow=fr-sr;
        int moveCol=fc-sc;
        bool flag=false;
        if(abs(moveRow)!=0&&moveCol==0) {//상하 무제한 이동
            flag=true;
            if(sr<fr){
                for(int i=sr+1;i<fr;i++){
                    if(gv->chess_board[i][sc].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
            else{
                for(int i=sr-1;i>fr;i--){
                    if(gv->chess_board[i][sc].player!=NEWTRAL) {
                        return false;
                    }
                }
            }        
        }
        if(abs(moveCol)!=0&&moveRow==0){//좌우 무제한 이동
            flag=true;
            if(sc<fc){
                for(int i=sc+1;i<fc;i++){
                    if(gv->chess_board[sr][i].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
            else{
                for(int i=sc-1;i>fc;i--){
                    if(gv->chess_board[sr][i].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
        }
        if(!flag) return false;
    }
    if(gv->chess_board[sr][sc].piece==QUEEN){
        int moveRow=fr-sr;
        int moveCol=fc-sc;
        bool flag=false;
        if(abs(moveRow)!=0&&moveCol==0) {//상하 무제한 이동
            flag=true;
            if(sr<fr){
                for(int i=sr+1;i<fr;i++){
                    if(gv->chess_board[i][sc].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
            else{
                for(int i=sr-1;i>fr;i--){
                    if(gv->chess_board[i][sc].player!=NEWTRAL) {
                        return false;
                    }
                }
            }        
        }
        if(abs(moveCol)!=0&&moveRow==0){//좌우 무제한 이동
            flag=true;
            if(sc<fc){
                for(int i=sc+1;i<fc;i++){
                    if(gv->chess_board[sr][i].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
            else{
                for(int i=sc-1;i>fc;i--){
                    if(gv->chess_board[sr][i].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
        } 
        if(moveRow!=0&&(abs(moveRow)==abs(moveCol))){//대각선 무제한 이동
            flag=true;
            if(sr<fr&&sc<fc){//우하향
                for(int i=sr+1,j=sc+1;i<fr;i++,j++){
                    if(gv->chess_board[i][j].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
            else if(sr<fr&&sc>fc){//좌하향
                for(int i=sr+1,j=sc-1;i<fr;i++,j--){
                    if(gv->chess_board[i][j].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
            else if(sr>fr&&sc<fc){//우상향
                for(int i=sr-1,j=sc+1;i>fr;i--,j++){
                    if(gv->chess_board[i][j].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
            else{//좌상향
                for(int i=sr-1,j=sc-1;i>fr;i--,j--){
                    if(gv->chess_board[i][j].player!=NEWTRAL) {
                        return false;
                    }
                }
            }
        }
        if(!flag) return false; 
    }
    if(gv->chess_board[sr][sc].piece==KING){
        int moveRow=fr-sr;
        int moveCol=fc-sc;
        bool flag=false;
        if(abs(moveRow)==1&&moveCol==0) flag=true; //상하 한칸 이동
        if(abs(moveCol)==1&&moveRow==0) flag=true; //좌우 한칸 이동
        if(abs(moveRow)==1&&abs(moveCol)==1) flag=true;
        if(!flag) return false;
    }
    //움직일 수 있는 방법이 아닐 때(경로상 말이 있거나, 경로가 잘못 됨)  
    return true;
}

int movePiece(game* gv,int sr,int sc,int fr,int fc){
    int deathCode=NEWTRAL;
    if(gv->chess_board[fr][fc].player!=NEWTRAL){
        deathCode=gv->chess_board[fr][fc].piece;
    }
    gv->chess_board[fr][fc].piece=gv->chess_board[sr][sc].piece;
    gv->chess_board[fr][fc].player=gv->chess_board[sr][sc].player;
    gv->chess_board[sr][sc].piece=NEWTRAL;
    gv->chess_board[sr][sc].player=NEWTRAL;
    return deathCode;
}

void printBoard(game* gv){
    cout<<"CHESS BOARD\n";
    cout<<"PLAYER ORDER : "<<(gv->player_turn)<<"P\n";
    //플레이어 순서 출력 완료
    cout<<"  ";
    for(int i=0;i<BOARD_SIZE;i++){
        cout.width(COUTWIDTH);
        cout<<i;
    }
    cout<<"\n";
    for(int i=0;i<BOARD_SIZE;i++){
        for(int j=0;j<BOARD_SIZE;j++){
            if(j==0){
                cout<<i<<" ";
            }
            string str="";
            if(gv->chess_board[i][j].player==PLAYER1){
                str+="1";
                if(gv->chess_board[i][j].piece==PAWN) str+="P";
                if(gv->chess_board[i][j].piece==BISHOP) str+="B";
                if(gv->chess_board[i][j].piece==KNIGHT) str+="N";
                if(gv->chess_board[i][j].piece==ROOK) str+="R";
                if(gv->chess_board[i][j].piece==QUEEN) str+="Q";
                if(gv->chess_board[i][j].piece==KING) str+="K";
            }
            else if(gv->chess_board[i][j].player==PLAYER2){
                str+="2";
                 if(gv->chess_board[i][j].piece==PAWN) str+="P";
                if(gv->chess_board[i][j].piece==BISHOP) str+="B";
                if(gv->chess_board[i][j].piece==KNIGHT) str+="N";
                if(gv->chess_board[i][j].piece==ROOK) str+="R";
                if(gv->chess_board[i][j].piece==QUEEN) str+="Q";
                if(gv->chess_board[i][j].piece==KING) str+="K";
            }
            else{
                str="()";
            }
            cout.width(COUTWIDTH);
            cout<<str;
        }
        cout<<"\n";
    }
    cout<<"\n\n";
    //chess_board 출력 완료
    cout<<"Death List\n";
    cout<<"1P : ";
    for(int i=0;i<gv->DL.p1Num;i++){
        if(gv->DL.deathList[PLAYER1][i]==0) break;
        cout.width(COUTWIDTH);
        if(gv->DL.deathList[PLAYER1][i]==PAWN) cout<<"P";
        if(gv->DL.deathList[PLAYER1][i]==BISHOP) cout<<"B";
        if(gv->DL.deathList[PLAYER1][i]==KNIGHT) cout<<"N";
        if(gv->DL.deathList[PLAYER1][i]==ROOK) cout<<"R";
        if(gv->DL.deathList[PLAYER1][i]==QUEEN) cout<<"Q";
        if(gv->DL.deathList[PLAYER1][i]==KING) cout<<"K";
    }
    cout<<"\n";
    cout<<"2P : ";
    for(int i=0;i<gv->DL.p2Num;i++){
        if(gv->DL.deathList[PLAYER2][i]==0) break;
        cout.width(COUTWIDTH);
        if(gv->DL.deathList[PLAYER2][i]==PAWN) cout<<"P";
        if(gv->DL.deathList[PLAYER2][i]==BISHOP) cout<<"B";
        if(gv->DL.deathList[PLAYER2][i]==KNIGHT) cout<<"N";
        if(gv->DL.deathList[PLAYER2][i]==ROOK) cout<<"R";
        if(gv->DL.deathList[PLAYER2][i]==QUEEN) cout<<"Q";
        if(gv->DL.deathList[PLAYER2][i]==KING) cout<<"K";
    }
    cout<<"\n\n\n";
    //죽은 말 현황 출력 완료
}

bool isFinish(game* gv){
    int krow,kcol;//현재 플레이어의 왕의 좌표
    int dir[8][2]={{-1,-1},{-1,0},{-1,1},{0,1},{1,1},{1,0},{1,-1},{0,-1}};//8곳으로 이동 좌표
    bool flag=false;//게임이 끝나는지여부

    for(int i=0;i<BOARD_SIZE;i++){
        for(int j=0;j<BOARD_SIZE;j++){
            if(gv->chess_board[i][j].piece==KING){
                if(gv->chess_board[i][j].player==gv->player_turn){//왕찾기
                    krow=i;
                    kcol=j;
                }
            }
        }
    }

    for(int i=0;i<8;i++){//상하좌우대각으로
        int newRow=krow+dir[i][0];
        int newCol=kcol+dir[i][1];
        if(isMove(gv,krow,kcol,newRow,newCol,gv->player_turn)&&isCheckMate(gv,krow,kcol,newRow,newCol)!=0){//움직있고, 체크가 아니면
            flag=true; //체크 메이트가 아님
            break;
        }
    }
    return flag;
}

void addDeathList(game*gv ,int deathCode){
    if(gv->player_turn==PLAYER1){
        gv->DL.deathList[PLAYER2][(gv->DL.p2Num)++]=deathCode;
    }
    else if(gv->player_turn==PLAYER2){
        gv->DL.deathList[PLAYER1][(gv->DL.p1Num)++]=deathCode;
    }
}