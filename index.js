
var GameState01 = [[0,0,0],[0,0,0],[0,0,0]];

//Description: Processed page clicks
function clickCell(info){
    if(info.className == "TTT_Cell_Default" && checkGameEnabled()){
        var Board = updateGS(info.id);
        switch(Board){
            case 0:     postMsg("Game Ongoing");break;
            case 1:     postMsg("Player \"X\" Wins!!!");break;
            case -1:    postMsg("Player \"O\" Wins!!!");break;
            case 2:     postMsg("Game is a Tie");break;
            case 3:     postMsg("");break;
        }

        updateBoard(getGameState());
    }
    else if(info.className == "modeButton2" || info.className == "modeButton1"){
        selectGM(info);
    }
    else if(info.id == "QLearnSave"){
        QLearn.saveStateStore();
    }
}

//Description: Game Mode Select
function selectGM(inf){
    var targetDiv = document.getElementById(inf.id);
        
        if(inf.className == "modeButton1")
            targetDiv.className = "modeButton2";

        if(inf.id != "mode_PvP")
            document.getElementById("mode_PvP").className = "modeButton1";
        if(inf.id != "mode_PvC")
            document.getElementById("mode_PvC").className = "modeButton1";
        if(inf.id != "mode_CvC")
            document.getElementById("mode_CvC").className = "modeButton1";

        switch(inf.id){
            case "mode_PvP": selectGameMode(0);break;
            case "mode_PvC": selectGameMode(1);break;
            case "mode_CvC": selectGameMode(2);break;
        }
        updateBoard(getGameState());

}

//Description: Update game board
function updateBoard(newBoard){
    //Update GameTurn
    var TSign = document.getElementById("TurnName");
    TSign.innerHTML = "";
    switch(getGameTurn()){
        case 1: TSign.innerHTML="<div class=\"TN_X\"></div>";break;
        case -1:TSign.innerHTML="<div class=\"TN_O\"></div>";break;
    }
    //Update Board
    for(i=0;i<GameState01.length;i++){
        for(j=0;j<GameState01[0].length;j++){
            if(newBoard[i][j] != GameState01[i][j]){
                GameState01[i][j] = newBoard[i][j];
                var TargetCellName = "C" + (i+1) + (j+1);
                var FocusCell = document.getElementById(TargetCellName);
                FocusCell.innerHTML = "";
                switch(newBoard[i][j]){
                    case 0: FocusCell.innerHTML = "";break;
                    case 1: FocusCell.innerHTML = "<div class=\"TTT_Cell_X\"></div>";break;
                    case -1:FocusCell.innerHTML = "<div class=\"TTT_Cell_O\"></div>";break;
                }
            }
        }
    }
}

//Description: post a Message on the msgPanel Div
function postMsg(info_msg){
    var pnl = document.getElementById("TTT_msgPanel");
    pnl.innerHTML = "";
    pnl.innerHTML = "System Message: " + info_msg;
}

//Add EventListeners
document.body.addEventListener("click",function(e){clickCell(e.target);},true);
document.getElementById("file-selector").addEventListener('change',function(e){QLearn.loadStateStore(e);});

//var tmp_x = new QLearn();
//tmp_x.chooseState("Hello");