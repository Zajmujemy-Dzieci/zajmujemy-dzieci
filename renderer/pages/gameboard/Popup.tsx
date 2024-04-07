import React, {useState} from 'react'
import { Question } from '../../models/Question'
// nalezy podeslac .trigger, .question 

const popupStyle = {
    fontSize: '25px',    
    borderBottom: '0px',
    width: '25%'  ,
    borderRadius: "7px",
    textAlign: "center",
}

// const popupQuestionStyle = {
//     borderBottom: '2px solid black',
//     justifyContent: "center",
//     display: "flex",
//     alignItems: "center",
//     paddingTop: "20px",
//     paddingBottom: "20px",
//     backgroundColor: "blue"
// }
// const popupAnswerStyle = {
//     border: "0px",
//     justifyContent: "center",
//     borderRadius: "20px",
//     backgroundImage: 'linear-gradient(to bottom right, purple, pink)',
//     margin: "20px"
// }

const popupAnswerArrStyle = {
    backgroundColor: 'rgb(51, 51, 51)',
    justifyContent: "center",
    padding: "10px",
    display: "flex"
}


// const outerDivStyle = {
//     width: "100%",
//     height: "100%",
//     marginTop: "2%",
//     position: "absolute",
//     display: "flex",
//     justifyContent: "center",    
// }

let globalSetChosen:null|React.Dispatch<React.SetStateAction<number|null>> = null;
let globalSetQuestion:null|React.Dispatch<React.SetStateAction<Question|null>>  = null; 

const loadQuestion = (question:Question | null) => {
    if(!globalSetChosen || !globalSetQuestion) return;

    globalSetChosen(null);
    globalSetQuestion(question);        
};

const revealAnswer = (chosen:number|null) => {
    if(!globalSetChosen) return;

    globalSetChosen(chosen);
};

function Popup() {
    const [chosen,setChosen] = useState<number|null>(null);
    const [question,setQuestion] = useState<Question | null>(null);

    globalSetChosen = setChosen;
    globalSetQuestion = setQuestion;

    const correct:number | null = question==null ? null : question.correctAnswerId;

    const questionList = question==null ? null : question.answers.map((question :string,index:number)=>{
        if(chosen==null || (index!=correct && index!=chosen)){
            return <div className="border-0 justify-center rounded-lg bg-gradient-to-br from-purple-700 to-secondary m-10">{question}</div>;            
        } 
        else if(index == correct){
            return <div className="border-0 justify-center rounded-lg bg-green-500 m-5" >{question}</div>;
        } 
        else if(index == chosen && index!=correct){
            return <div className="border-0 justify-center rounded-lg bg-red-500 m-5" >{question}</div>;
        } 

    });
    
    return (question) ? (
        <div className="w-full h-full mt-2 absolute flex justify-center"> 
            <div className="text-2xl border-b-5 w-1/4 rounded-lg text-center">
                <div className="border-b-0 border-black justify-center flex items-center pt-10 pb-10 bg-blue-700" >{question.content}</div>
                <div className="bg-gray-700 justify-center p-10 flex"><div className="w-1/2">{questionList}</div></div>            
            </div>
        </div>
        
    ) : "";
}



export {Popup,loadQuestion,revealAnswer}