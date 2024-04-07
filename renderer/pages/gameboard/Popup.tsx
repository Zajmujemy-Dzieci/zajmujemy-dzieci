import React, {useState} from 'react'
import { Question } from '../../models/Question'
// nalezy podeslac .trigger, .question 

const popupStyle = {
    fontSize: '25px',
    border: '2px solid black',
    borderBottom: '0px',
    width: '30%'  ,
    borderRadius: "7px",
    marginLeft: "35%", //maybe theres better option?
    textAlign: "center"
}

const popupQuestionStyle = {
    borderBottom: '2px solid black',
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    paddingTop: "20px",
    paddingBottom: "20px",
    backgroundColor: "blue"
}
const popupAnswerStyle = {
    border: "0px",
    justifyContent: "center",
    borderRadius: "20px",
    backgroundImage: 'linear-gradient(to bottom right, purple, pink)',
    margin: "20px"
}

const popupAnswerArrStyle = {
    backgroundColor: 'rgb(51, 51, 51)',
    justifyContent: "center",
    padding: "10px",
    display: "flex"
}

const ansColStyle = {
    width: "50%"
}


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
        if(chosen==null || (index!=correct && index!=chosen)) return <div style={popupAnswerStyle}>{question}</div>;
        else if(index == correct){
            return <div style={ {...popupAnswerStyle,...{backgroundImage:"none", backgroundColor:"green"}} }>{question}</div>;
        } 
        else if(index == chosen && index!=correct){
            return <div style={ {...popupAnswerStyle,...{backgroundImage:"none", backgroundColor:"red"}} }>{question}</div>;
        } 

    });
    
    return (question) ? (
        <div style={popupStyle}>
            <div style={popupQuestionStyle} >{question.content}</div>
            <div style={popupAnswerArrStyle}><div style={ansColStyle}>{questionList}</div></div>
            
        </div>
    ) : "";
}



export {Popup,loadQuestion,revealAnswer}