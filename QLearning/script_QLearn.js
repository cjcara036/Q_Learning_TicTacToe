/*
Description: Q Learning Script
Revision History:
    0.01    - Initial Module Write-up
    0.02    - Implementation with private static fields
*/
var QLearn_StateStore = [];
class QLearn{

    #StateChain;

    constructor(){
        this.#StateChain = [];   //Contains the list of states traversed by the QLearn Agent
    }
    
    //Description: Chooses an action in the StateAction list given StateName
    chooseState(SName,StateAction,addtoShiftChain=true){
        let i=0;
        let StateName = JSON.stringify(SName);
        //Check if StateName already exists in QLearn_StateStore. Add to QLearn_StateStore if new state
        if(isNaN(1/StateAction.length))
            console.log("NaN: " + StateAction);
            
        if(QLearn_StateStore[StateName] == undefined){
            let ActionList = [];
            for(i=0;i<StateAction.length;i++){
                ActionList[StateAction[i]] = 1/StateAction.length;
            }
            QLearn_StateStore[StateName] = ActionList;
        }

        //Choose and return an action from the StateAction Array
        let ActionProb = QLearn_StateStore[StateName];
        let ActionKeys = Object.keys(ActionProb);
        let CDF = 0;
        let rndChoice = Math.random();
        let x = ActionKeys[ActionKeys.length-1];

        for(i=0;i<ActionKeys.length;i++){
            CDF += ActionProb[ActionKeys[i]];
            if(CDF>rndChoice){
                x = ActionKeys[i];
                break;
            }
        }

        if(addtoShiftChain)
            this.#StateChain.push({state:StateName, act:x});
        return x;
    }

    //Description: Changes probability matrix of QLearn_StateStore based on feedback on QLearn agent's StateChain
    feedback(StateChain_Score){
        const MINIMUM_PROBABILITY = 0.001;
        for(let i=this.#StateChain.length-1; i>=0; i--){
            //Update Probability Distribution
            QLearn_StateStore[this.#StateChain[i].state][this.#StateChain[i].act] = QLearn_StateStore[this.#StateChain[i].state][this.#StateChain[i].act] * (1+StateChain_Score/(this.#StateChain.length-i));

            //Normalize Probability Distribution
            let ProbSum = 0;
            let ProbKeys = Object.keys(QLearn_StateStore[this.#StateChain[i].state]);
            for(let j=0; j<ProbKeys.length; j++)
                ProbSum += QLearn_StateStore[this.#StateChain[i].state][ProbKeys[j]];

            if(ProbSum > 0)
                for(let j=0; j<ProbKeys.length; j++){
                    QLearn_StateStore[this.#StateChain[i].state][ProbKeys[j]] = QLearn_StateStore[this.#StateChain[i].state][ProbKeys[j]]/ProbSum;
                    if(QLearn_StateStore[this.#StateChain[i].state][ProbKeys[j]] < MINIMUM_PROBABILITY/ProbKeys.length)
                        QLearn_StateStore[this.#StateChain[i].state][ProbKeys[j]] = 0;
                }
            else{
                for(let j=0; j<ProbKeys.length; j++)
                    QLearn_StateStore[this.#StateChain[i].state][ProbKeys[j]] = 1/ProbKeys.length;
            }
        }
        this.clearStateChain();
    }

    //Description: Adds entry to the agents shift chain
    addtoStateChain(stateName,ActList,ActionSelected){
        if(QLearn_StateStore[stateName] == undefined)
            this.chooseState(stateName,ActList,false);
        this.#StateChain.push({state:JSON.stringify(stateName), act:ActionSelected});
    }

    //Description: shows content of the QLearn_StateStore
    static showStateStore(){
        return QLearn_StateStore;
    }

    //Description: shows Statechain of the QLearn Agent
    showStateChain(){
        return this.#StateChain;
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
        let parsed_Arr = [];
        let StateKeys = Object.keys(QLearn_StateStore); 
        for(let i=0;i<StateKeys.length;i++){
            let tmp_Arr = QLearn_StateStore[StateKeys[i]];
            let Action_Arr = Object.keys(tmp_Arr);
            let Prob_Arr = [];
            for(let j=0;j<Action_Arr.length;j++){
                Prob_Arr.push(tmp_Arr[Action_Arr[j]]);
            }

            let tmp_Arr2 = [];
            tmp_Arr2.push(StateKeys[i]);
            tmp_Arr2.push(Action_Arr);
            tmp_Arr2.push(Prob_Arr);
            parsed_Arr.push(tmp_Arr2);
        }

        //Save File
        let content = JSON.stringify(parsed_Arr);
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
            let fileContent = JSON.parse(x.target.result);
            QLearn_StateStore = [];
            for(let i=0; i<fileContent.length; i++){
                let tmp_Arr3 = [];
                let ActionArr = fileContent[i][1];
                let ProbArr = fileContent[i][2];

                for(let j=0; j<ActionArr.length;j++){
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
        this.#StateChain = [];
    }

    //Description: Compute standard deviation of the QLearn_StateStore.
    //Note: Hypothesis here is an improving StateStore tends to have higher standard deviation
    static computeDeviation(){
        let valueOut = 0;
        let QLearn_Keys = Object.keys(QLearn_StateStore);

        for(let i=0;i<QLearn_Keys.length;i++){
            let ValueSet = Object.values(QLearn_StateStore[QLearn_Keys[i]]);
            valueOut += Math.max.apply(Math,ValueSet);
        }
        valueOut = valueOut / QLearn_Keys.length;
        return valueOut;
    }
}