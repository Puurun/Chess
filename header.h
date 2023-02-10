#ifndef __HEADER__
#define __HEADER__

#include <iostream>
#include <algorithm>
#include <cstring>
#include <cmath>

#define NEWTRAL 0
#define PLAYER1 1
#define PLAYER2 2
#define COUTWIDTH 3
#define BLACK 3
#define WHITE 4
#define BOARD_SIZE 8 //보드 사이즈
#define PAWN 10 //폰
#define BISHOP 11 //비숍
#define KNIGHT 12 //나이트
#define ROOK 13 //룩 
#define QUEEN 14 //퀸
#define KING 15 //킹
using namespace std;

typedef struct player{
    string name;//플레이어 이름
    int player_code; //1p, 2p
    int color;//플레이어 색 3B4W
}player;

typedef struct board_piece{
    int player;//점령여부 : 0-중립, 1-p1, 2-p2
    int piece;//놓여 있는 말
}board_piece;

typedef struct deathNode{
    int deathList[3][BOARD_SIZE*2];//죽은 말의 코드를 저장([1] : p1, [2] : p2)
    int p1Num;//player1의 죽은 말의 개수
    int p2Num;//player2의 죽은 말을 개수
}deathNode;

typedef struct game{
    board_piece **chess_board;//체스 판
    player p1;//player 1
    player p2;//player 2
    int player_turn;//1이면 player1, 2이면 player 2차례
    deathNode DL;
    bool finishFlag;
}game;

/**void init(game*)
 * input : game*
 * output : x
 * chess_board 동적 할당 / chess_board에 말 생성 / player 정보 저장
*/
void init(game*);


/**void finish(game*)
 * input : game*
 * output : x
 * chess_board 동적 할당 해제
*/
void finish(game*);
/**void gameStart(game*)
 * input : game**
 * output : x
 * 게임 시작 / struct game에 저장된 player_turn에 따라 게임 진행, 한턴이 끝나면 player_turn 변경
*/
void gameStart(game*);

/**int isCheckMate(game*,int,int,int,int)
 * input : game*,선택한 말의 출발 row,col좌표, 선택한 말의 도착 row, col좌표
 * output : 내가 체크메이트를 당하면(이동 불가능) true반환, 상대방이 체크메이트를 당하거나, 상대방 왕이 이미 죽었거나, 체크메이트가 아니라면 false반환
 * 움직이려는 말을 미리 이동시켜보고, 모든 말이 상대편 킹을 잡을 수 있는지 조사, 이후 다시 말을 원위치로
*/
int isCheckMate(game*,int,int,int,int);

/**void getCommand(game*,int*,int*,int*,int*)
 * input : game*,선택한 말의 출발 row,col좌표, 선택한 말의 도착 row,col 좌표 
 * output : x
 * 움직일 말을 선택하고 그 말을 이동시킬 좌표를 입력받음. 말이 움직일 수 없는 곳이면 올바른 입력이 들어올 때 까지 입력 받음
*/
void getCommand(game*,int*,int*,int*,int*); 

/**bool isMove(game*,int,int,int,int)
 * input : game*,말의 출발 row,col, 말의 도착 row, col
 * output : 움직일 수 있으면 true, 없으면 false 반환
 * 입력된 좌표에 있는 말을 입력된 좌표로 이동할 수 있는지 여부 조사(보드판 밖, 같은편 말, 잘못된 이동 경로)
*/
bool isMove(game*,int,int,int,int,int);

/** int movePiece(game*,int,int,int,int,int);
 * input : game*,말의 출발 row,col, 말의 도착 row,col, 움직이는 플레이어
 * output : 상대방 말을 잡으면 해당 말의 코드, 없으면 0
 * 입력된 좌표로 말을 움직임, 해당 자리에 상대방 말이 있으면 상대방 말을 죽이고 그 자리를 차지함
*/
int movePiece(game*,int,int,int,int);

/**void printBoard(game*)
 * input : game*
 * output : x
 * 현재 보드판 출력 / 죽은 말 현황 출력 / 플레이어 순서 출력 / 
*/
void printBoard(game*);

/**bool isFinish(game*)
 * input : game*
 * output : 한쪽이라도 킹이 없으면 false(게임 종료), 아니면 true
 * 킹만 남았거나 킹이 체크메이트 일때, 모든 이동경로에서 체크메이트를 당하면 게임이 끝남
*/
bool isFinish(game*);

/**void addDeathList(game*,int)
 * input : game*,죽은 말의 코드
 * output : x
 * 죽은 말의 코드를 deathList에 추가함
*/
void addDeathList(game*,int);

/**
 * input :
 * output :
 * 말이 이동 가능한 경로를 표시함
*/
#endif
