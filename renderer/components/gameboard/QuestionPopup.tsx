import React, {useState} from 'react'
import { Question } from '../../models/Question'
import { Player } from '../../types/Player';


let globalSetChosen:null|React.Dispatch<React.SetStateAction<number|null>> = null;
let globalSetQuestion:null|React.Dispatch<React.SetStateAction<Question|null>>  = null; 

const loadQuestion = (question:Question | null) => {
    if(!globalSetChosen || !globalSetQuestion) return;
    console.log("tutaj1");
    globalSetChosen(null);
    globalSetQuestion(question);
};

const revealAnswer = (chosen:string|null, question: Question | null, ws: WebSocket, nick: string) => {
    if (!globalSetChosen) return;
    let chosenNumber:number = -1;
    switch(chosen){
        case "A":
            globalSetChosen(0);
            chosenNumber = 0;
            break;
        case "B":
            globalSetChosen(1);
            chosenNumber = 1;
            break;
        case "C":
            globalSetChosen(2);
            chosenNumber = 2;
            break;
        case "D":
            globalSetChosen(3);
            chosenNumber = 3;
            break;
        case "E":
            globalSetChosen(4);
            chosenNumber = 4;
            break;
        case "F":
            globalSetChosen(5);
            chosenNumber = 5;
            break;
    }
    setTimeout(() => {
        loadQuestion(null);
        if (chosenNumber === question?.correctAnswerId) {
            handleAnswer(true, ws, nick)
        } else {
            handleAnswer(false, ws, nick)
        }
    }, 10000);
};

function handleAnswer(correct: boolean, ws:WebSocket, nick:string){
    if (correct) {
        ws.send(JSON.stringify({ type: "movePawn", nick: nick, fieldsToMove: 1, shouldMoveFlag: true }));
    } else {
        ws.send(JSON.stringify({ type: "movePawn", nick: nick, fieldsToMove: -1, shouldMoveFlag: true }));
    }
}

function QuestionPopup() {
    const [chosen,setChosen] = useState<number|null>(null);
    const [question,setQuestion] = useState<Question | null>(null);
    
    globalSetChosen = setChosen;
    globalSetQuestion = setQuestion;

    const correct:number | null = question==null ? null : question.correctAnswerId;
    const questionList = question==null ? null : question.answers.map((question :string,index:number)=>{
        if(chosen==null || (index!=correct && index!=chosen)){
            return <div className="border-0 whitespace-normal overflow-wrap-break-word justify-center rounded-[20px] bg-secondary m-5">{question}</div>;            
        } 
        else if(index == correct){
            return <div className="border-0 justify-center rounded-[20px] bg-childGreen m-5" >{question}</div>;
        } 
        else if(index == chosen && index!=correct){
            return <div className="border-0 justify-center rounded-[20px] bg-childRed m-5" >{question}</div>;
        } 

    });
    //}
    return (question) ? (
        <div className="w-full h-full mt-2 absolute left-0 top-0 flex justify-center items-center z-10" onClick={()=>loadQuestion(null)} > 
            <div className="text-5xl border-b-5 w-2/5 text-center mt-3">
                <div className="border-b-0 border-black justify-center flex items-center pt-10 pb-10 bg-blue-600">{question.content}</div>
                <div className="bg-childBlack justify-center p-5 flex"><div className="w-3/4">{questionList}</div></div>            
            </div>
        </div>
        
        
    ) : "";
}

export default QuestionPopup;
export {loadQuestion,revealAnswer}