/*
Description: Q Learning Script
*/
var QLearn_StateStore = []
class QLearn{

    constructor(){
        this.StateChain = [];   //Contains the list of states traversed by the QLearn Agent
    }
    
    //Description: Chooses an action in the StateAction list given StateName
    chooseState(SName,StateAction,addtoShiftChain=true){
        var i=0;
        var StateName = JSON.stringify(SName);
        //Check if StateName already exists in QLearn_StateStore. Add to QLearn_StateStore if new state
        if(isNaN(1/StateAction.length))
            console.log("NaN: " + StateAction);
            
        if(QLearn_StateStore[StateName] == undefined){
            var ActionList = [];
            for(i=0;i<StateAction.length;i++){
                ActionList[StateAction[i]] = 1/StateAction.length;
            }
            QLearn_StateStore[StateName] = ActionList;
        }

        //Choose and return an action from the StateAction Array
        var ActionProb = QLearn_StateStore[StateName];
        var ActionKeys = Object.keys(ActionProb);
        var CDF = 0;
        var rndChoice = Math.random();
        var x = ActionKeys[ActionKeys.length-1];

        for(i=0;i<ActionKeys.length;i++){
            CDF += ActionProb[ActionKeys[i]];
            if(CDF>rndChoice){
                x = ActionKeys[i];
                break;
            }
        }

        if(addtoShiftChain)
            this.StateChain.push({state:StateName, act:x});
        return x;
    }

    //Description: Changes probability matrix of QLearn_StateStore based on feedback on QLearn agent's StateChain
    feedback(StateChain_Score){
        const MINIMUM_PROBABILITY = 0.001;
        for(var i=this.StateChain.length-1; i>=0; i--){
            //Update Probability Distribution
            QLearn_StateStore[this.StateChain[i].state][this.StateChain[i].act] = QLearn_StateStore[this.StateChain[i].state][this.StateChain[i].act] * (1+StateChain_Score/(this.StateChain.length-i));

            //Normalize Probability Distribution
            var ProbSum = 0;
            var ProbKeys = Object.keys(QLearn_StateStore[this.StateChain[i].state]);
            for(var j=0; j<ProbKeys.length; j++)
                ProbSum += QLearn_StateStore[this.StateChain[i].state][ProbKeys[j]];

            if(ProbSum > 0)
                for(var j=0; j<ProbKeys.length; j++){
                    QLearn_StateStore[this.StateChain[i].state][ProbKeys[j]] = QLearn_StateStore[this.StateChain[i].state][ProbKeys[j]]/ProbSum;
                    if(QLearn_StateStore[this.StateChain[i].state][ProbKeys[j]] < MINIMUM_PROBABILITY/ProbKeys.length)
                        QLearn_StateStore[this.StateChain[i].state][ProbKeys[j]] = 0;
                }
            else{
                for(var j=0; j<ProbKeys.length; j++)
                    QLearn_StateStore[this.StateChain[i].state][ProbKeys[j]] = 1/ProbKeys.length;
            }
        }
        this.clearStateChain();
    }

    //Description: Adds entry to the agents shift chain
    addtoStateChain(stateName,ActList,ActionSelected){
        if(QLearn_StateStore[stateName] == undefined)
            this.chooseState(stateName,ActList,false);
        this.StateChain.push({state:JSON.stringify(stateName), act:ActionSelected});
    }

    //Description: shows content of the QLearn_StateStore
    static showStateStore(){
        return QLearn_StateStore;
    }

    //Description: shows Statechain of the QLearn Agent
    showStateChain(){
        return this.StateChain;
    }

    //Description: print QLearn_StateStore into a string
    static getStateStore(){
        return JSON.stringify(QLearn_StateStore);
    }

    //Description: update QLearn_StateStore
    static updateStateStore(JSON_String){
        QLearn_StateStore = JSON.parse(JSON_String);
    }

    //Description:save QLearn_StateStore
    static saveStateStore(){
        //Parse QLearn_StateStore
        var parsed_Arr = [];
        var StateKeys = Object.keys(QLearn_StateStore); 
        for(var i=0;i<StateKeys.length;i++){
            var tmp_Arr = QLearn_StateStore[StateKeys[i]];
            var Action_Arr = Object.keys(tmp_Arr);
            var Prob_Arr = [];
            for(var j=0;j<Action_Arr.length;j++){
                Prob_Arr.push(tmp_Arr[Action_Arr[j]]);
            }

            var tmp_Arr2 = [];
            tmp_Arr2.push(StateKeys[i]);
            tmp_Arr2.push(Action_Arr);
            tmp_Arr2.push(Prob_Arr);
            parsed_Arr.push(tmp_Arr2);
        }

        //Save File
        var content = JSON.stringify(parsed_Arr);
        const filename = "QLearn_StateStore-" + QLearn.computeDeviation() + ".qL";
        const contentType = "text/plain";
        const a = document.createElement('a');
        const file = new Blob([content], {type: contentType});
        
        a.href= URL.createObjectURL(file);
        a.download = filename;
        a.click();
        
            URL.revokeObjectURL(a.href);
    }

    //Description:load QLearn_StateStore from qL file
    static loadStateStore(e){
        let reader = new FileReader();
    
        reader.onload = (x) => {
            var fileContent = JSON.parse(x.target.result);
            QLearn_StateStore = [];
            for(var i=0; i<fileContent.length; i++){
                var tmp_Arr3 = [];
                var ActionArr = fileContent[i][1];
                var ProbArr = fileContent[i][2];

                for(var j=0; j<ActionArr.length;j++){
                    tmp_Arr3[ActionArr[j]]=ProbArr[j];
                }
                QLearn_StateStore[fileContent[i][0]] = tmp_Arr3;
            }
            alert("QLearn_StateStore is now updated");
        }
        
        reader.readAsText(e.target.files[0]);

    }

    //Description: clear agent's StateChain
    clearStateChain(){
        this.StateChain = [];
    }

    //Description: Compute standard deviation of the QLearn_StateStore.
    //Note: Hypothesis here is an improving StateStore tends to have higher standard deviation
    static computeDeviation(){
        var valueOut = 0;
        var QLearn_Keys = Object.keys(QLearn_StateStore);

        for(var i=0;i<QLearn_Keys.length;i++){
            var ValueSet = Object.values(QLearn_StateStore[QLearn_Keys[i]]);
            valueOut += Math.max.apply(Math,ValueSet);
        }
        valueOut = valueOut / QLearn_Keys.length;
        return valueOut;
    }
}