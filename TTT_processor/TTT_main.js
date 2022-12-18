//Global variable
var GameActions = ["C11","C12","C13","C21","C22","C23","C31","C32","C33"];
var GameState = [[0,0,0],[0,0,0],[0,0,0]];
var GameMode = -1;  //-1: no Mode; 0: PvP; 1:PvC; 2:CvC (Training Mode)
var GameTurn = 1;   //1: PlayerX; -1:PlayerO
var PlayerPiece = 1;    //Piece controlled by player when playing with AI. 1:X, -1:O
var ENABLE_BOARD = false;

var PlayerX = 0;    //1: Player-Controlled, -1: AI-Controlled
var PlayerO = 0;    //1: Player-Controlled, -1: AI-Controlled

//AI Agents
var AI01 = new QLearn();    //AI for PlayerX control
var AI02 = new QLearn();    //AI for PlayerO control
const TRAINING_RUN = 1000000;  //AI runs per training session
var BoardList = [];

const AI_WIN_SELF = 0.00001;         //AI feedback score when it wins to itself
const AI_LOOSE_SELF = -1;         //AI feedback score when it loose to itself
const AI_TIE_SELF = 0.00001;         //AI feedback score when it is a tie to itself

const AI_WIN_HUMAN = 1;         //AI feedback score when it wins against player
const AI_LOOSE_HUMAN = -1;         //AI feedback score when it looses against player
const AI_TIE_HUMAN = 0.5;         //AI feedback score when it is a tie to player

//Description: Resets the GameState
function resetGameState(){
    GameState = [[0,0,0],[0,0,0],[0,0,0]];
    GameTurn = 1;
}

//Description: updates GameState
function updateGS(cellName,showErr = true){
    if(ENABLE_BOARD){
        //Identify if X or O is playing
        var PLAY_X = true;
        if(GameTurn == -1)
            PLAY_X = false;
        
        //Identify if Human or AI Player
        var PLAYER_HUMAN = true;
        if((PLAY_X && PlayerX == -1) || (!PLAY_X && PlayerO == -1))
            PLAYER_HUMAN = false;
        
        if(PLAYER_HUMAN){
            //Decode cellName and check if valid
            var XY = decodeMove(cellName);
            if(GameState[XY[0]][XY[1]] == 0){
                //If Move is valid, update the GameState and AI StateChain. Then, check for winning condition.
                var tmp_GameState = concatGameState();
                tmp_GameState.push(GameTurn);
                switch(GameTurn){
                    case  1: AI01.addtoStateChain(tmp_GameState,GameActions,cellName);break;
                    case -1: AI02.addtoStateChain(tmp_GameState,GameActions,cellName);break;
                }
                return updateGS2(XY,PLAYER_HUMAN,PLAY_X,showErr);
                
            }
        }
        else{
            //Execute an AI Move
            var AIMove = "";
            var tmp_GameState = concatGameState();
            tmp_GameState.push(GameTurn);
            if(PLAY_X)
                AIMove = AI01.chooseState(tmp_GameState,GameActions);
            else
                AIMove = AI02.chooseState(tmp_GameState,GameActions);
            
            var AIXY = decodeMove(AIMove);
            if(GameState[AIXY[0]][AIXY[1]] == 0){
                return updateGS2(AIXY,PLAYER_HUMAN,PLAY_X,showErr);
            }
            else{
                //invalid AI move
                if(showErr){
                    if(PLAY_X)
                        console.log("Invalid AI move on " + AIMove + " by X");
                    else
                        console.log("Invalid AI move on " + AIMove + " by O");
                }
                if(PLAY_X){
                    AI01.feedback(AI_LOOSE_SELF);
                    AI02.feedback(AI_WIN_SELF);
                }
                else{
                    AI01.feedback(AI_WIN_SELF);
                    AI02.feedback(AI_LOOSE_SELF);
                }
                postGameCode(); 
                return -GameTurn;
            }
        }
        
    }
}

//Description: Update GameState2
function updateGS2(XYa,HUM,XO,showErr=true){
    GameState[XYa[0]][XYa[1]] = GameTurn;
    var tmp_result = winCheck();
    var AI_WIN,AI_LOOSE;

    switch(GameMode){
        case 0: case 1: AI_WIN = AI_WIN_HUMAN; AI_LOOSE=AI_LOOSE_HUMAN; AI_TIE=AI_TIE_HUMAN;break;
        case 2:         AI_WIN = AI_WIN_SELF; AI_LOOSE=AI_LOOSE_SELF;AI_TIE=AI_TIE_SELF;break;
    }

    switch(tmp_result){
        case 1: //PlayerX wins
            //Update QLearn Agents
            AI01.feedback(AI_WIN);
            AI02.feedback(AI_LOOSE);
            postGameCode(); 
            return tmp_result;
        case -1://PlayerO wins
            //Update QLearn Agents
            AI01.feedback(AI_LOOSE);
            AI02.feedback(AI_WIN);
            postGameCode(); 
            return tmp_result;
        case 2: //Tie Game
            AI01.feedback(AI_TIE);
            AI02.feedback(AI_TIE);
            postGameCode(); 
            return tmp_result;
    }
    GameTurn = -GameTurn;

    //If the next Player is an AI, then run it
    if((XO && PlayerO ==-1)||(!XO && PlayerX==-1)){
        return updateGS("X",showErr);
    }
    else return tmp_result;
}

//Description: GameMode Selection
function selectGameMode(gMode){
    resetGameState();
    GameMode = gMode;
    ENABLE_BOARD = true;
    AI01.clearStateChain();
    AI02.clearStateChain();
    switch(gMode){
        case 0: PlayerX = 1; PlayerO = 1; PlayerPiece = 1;
            break;
        case 1: PlayerX = 1*PlayerPiece; PlayerO = 1*-PlayerPiece;
            if(PlayerPiece == -1)
                updateGS("X");
            break;
        case 2: PlayerX = -1; PlayerO = -1; PlayerPiece = 1;
            console.log("TRAINING_START: " + QLearn.computeDeviation());
            //postMsg("TRAINING at 0%");
            console.time("Training_Time");
            for(var i=0;i<TRAINING_RUN;i++){
                resetGameState();
                GameMode = gMode;
                ENABLE_BOARD = true;
                AI01.clearStateChain();
                AI02.clearStateChain();
                updateGS("X",false);
                
                //record board config
                if(!BoardList.includes(JSON.stringify(GameState)))
                    BoardList.push(JSON.stringify(GameState));
                
            }
            alert("TRAINING DONE");
            console.log("Training State: " + QLearn.computeDeviation());
            console.timeEnd("Training_Time");
            break;
    }
}

//Description: Endgame code
function postGameCode(){
    ENABLE_BOARD = false;
    if(GameMode == 1)  //Switch Player Piece on next round
        PlayerPiece = -PlayerPiece;
}

//Description: provides GameTurn
function getGameTurn(){
    return GameTurn;
}

//Description: provides GameState
function getGameState(){
    return GameState;
}

//Description: provides ENABLE_BOARD
function checkGameEnabled(){
    return ENABLE_BOARD;
}

//Description:  Decodes target cell
function decodeMove(cName){
    switch(cName){
        case "C11": return [0,0];
        case "C12": return [0,1];
        case "C13": return [0,2];

        case "C21": return [1,0];
        case "C22": return [1,1];
        case "C23": return [1,2];

        case "C31": return [2,0];
        case "C32": return [2,1];
        case "C33": return [2,2];
    }
}

//Description: Checks Board for Winner
function winCheck(){
    //Check horizontal
    for(i=0;i<GameState.length;i++){
       var s = 0;
       for(j=0;j<GameState[i].length;j++){
           s += GameState[i][j];
       }
       if(s == 3){
           return 1;
       }
       else if(s == -3){
           return -1;
       }
   }

   //Check vertical
   for(i=0;i<GameState[0].length;i++){
       var s = 0;
       for(j=0;j<GameState.length;j++){
           s += GameState[j][i];
       }
       if(s == 3){
           return 1;
       }
       else if(s == -3){
           return -1;
       }
   }

   //Check diagonal
   var s = GameState[0][0] + GameState[1][1] + GameState[2][2];
   if(s == 3){
       return 1;
   }
   else if(s == -3){
       return -1;
   }
   var s = GameState[0][2] + GameState[1][1] + GameState[2][0];
   if(s == 3){
       return 1;
   }
   else if(s == -3){
       return -1;
   }

   //check for tie
   var ZERO_EXISTS = false;
   for(i=0;i<GameState.length;i++){
       for(j=0;j<GameState.length;j++){
           if(GameState[i][j]==0){
               ZERO_EXISTS = true;
               break;
           }
       }
   }

   if(!ZERO_EXISTS)
       return 2;
   else
       return 0;
}

//Description: concatenates game state
function concatGameState(){
    var outArr = [];
    for(var i=0;i<GameState.length;i++){
        for(var j=0;j<GameState[i].length;j++)
        outArr.push(GameState[i][j]);
    }
    return outArr;
}
