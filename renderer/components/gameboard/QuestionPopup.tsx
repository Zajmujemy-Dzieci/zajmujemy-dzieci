import React, { Dispatch, useState } from "react";
import { Question } from "../../models/Question";
import { Player } from "../../types/Player";
import { SetStateAction, useAtom } from "jotai";
import { chosenAtom } from "../../models/ChosenAtom";
import { questionAtom } from "../../models/QuestionAtom";

const loadQuestion = (
  question: Question | null,
  setChosen: Dispatch<SetStateAction<number | null>>,
  setQuestion: Dispatch<SetStateAction<Question | null>>
) => {
  console.log("tutaj1");
  setChosen(null);
  setQuestion(question);
};

const revealAnswer = (
  chosen: string | null,
  question: Question | null,
  ws: WebSocket,
  nick: string,
  setChosen: Dispatch<SetStateAction<number | null>>
) => {
  let chosenNumber: number = -1;
  switch (chosen) {
    case "A":
      setChosen(0);
      chosenNumber = 0;
      break;
    case "B":
      setChosen(1);
      chosenNumber = 1;
      break;
    case "C":
      setChosen(2);
      chosenNumber = 2;
      break;
    case "D":
      setChosen(3);
      chosenNumber = 3;
      break;
    case "E":
      setChosen(4);
      chosenNumber = 4;
      break;
    case "F":
      setChosen(5);
      chosenNumber = 5;
      break;
  }
  if (chosenNumber === question?.correctAnswerId) {
    handleAnswer(true, ws, nick);
  } else {
    handleAnswer(false, ws, nick);
  }
};

function handleAnswer(correct: boolean, ws: WebSocket, nick: string) {
  if (correct) {
    ws.send(
      JSON.stringify({
        type: "movePawn",
        nick: nick,
        fieldsToMove: 1,
        shouldMoveFlag: true,
      })
    );
  } else {
    ws.send(
      JSON.stringify({
        type: "movePawn",
        nick: nick,
        fieldsToMove: -1,
        shouldMoveFlag: true,
      })
    );
  }
}

function QuestionPopup() {
  const [chosen, setChosen] = useAtom(chosenAtom);
  const [question, setQuestion] = useAtom<Question | null>(questionAtom);

  const correct: number | null =
    question == null ? null : question.correctAnswerId;
  //   const questionList =
  //     question == null
  //       ? null
  //       : question.answers.map((question: string, index: number) => {
  //           if (chosen == null || (index != correct && index != chosen)) {
  //             return (
  //               <div className="border-0 whitespace-normal overflow-wrap-break-word justify-center rounded-[20px] bg-secondary m-5">
  //                 {question}
  //               </div>
  //             );
  //           } else if (index == correct) {
  //             return (
  //               <div className="border-0 justify-center rounded-[20px] bg-childGreen m-5">
  //                 {question}
  //               </div>
  //             );
  //           } else if (index == chosen && index != correct) {
  //             return (
  //               <div className="border-0 justify-center rounded-[20px] bg-childRed m-5">
  //                 {question}
  //               </div>
  //             );
  //           }
  //         });
  //}
  return (
    <div
      className="w-full h-full mt-2 absolute left-0 top-0 flex justify-center items-center z-10"
      onClick={() => loadQuestion(null, setChosen, setQuestion)}
    >
      <div className="text-5xl border-b-5 w-2/5 text-center mt-3">
        <div className="border-b-0 border-black justify-center flex items-center pt-10 pb-10 bg-blue-600">
          {question?.content}
        </div>
        <div className="bg-childBlack justify-center p-5 flex">
          <div className="w-3/4">
            {question?.answers.map((answer: string) => {
              console.log(
                "tutaj2",
                chosen != null && correct == question.answers.indexOf(answer)
              );
              return (
                <div
                  key={answer}
                  className={`border-0 whitespace-normal overflow-wrap-break-word justify-center rounded-[20px] ${
                    chosen == null && "bg-secondary"
                  }
                  ${
                    chosen != null &&
                    correct == question.answers.indexOf(answer) &&
                    "bg-childGreen"
                  }
                    ${
                      chosen != question.answers.indexOf(answer) &&
                      chosen != correct &&
                      "bg-childRed"
                    }
                  m-5`}
                >
                  {answer}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionPopup;
export { loadQuestion, revealAnswer };
