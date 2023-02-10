#include "header.h"


int main(int argc, char *argv[]){
    game gv;
    init(&gv);
    gameStart(&gv);
    finish(&gv);

    return 0;
}