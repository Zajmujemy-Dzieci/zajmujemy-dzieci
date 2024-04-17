import { useEffect, useState } from "react";
import { Player } from "../../types/Player";
import { twMerge } from "tailwind-merge";
import { BoardField } from "./GameBoardComponent";
import axios, { Axios, AxiosResponse } from "axios";
import LazyIcon from "../../models/IconsManager";
import { loadQuestion, revealAnswer } from "./QuestionPopup";
import { QuestionList } from "../../models/QuestionList";
import { Question } from "../../models/Question";

type GameBoardPawnProps = {
  player: Player;
  shift: { x: number; y: number };
  boardFields: BoardField[];
  handleOpenSpecialPopup: (text: string) => Promise<void>;
  showGameOverPopup: () => Promise<void>;
};

const questionList: QuestionList = QuestionList.getInstance();
let globalSetQuestion: Question | null = null;

// TODO: socket communication attachment
function redirectToQuestionPage(player: Player, ws: WebSocket) {
  const sampleQuestion = questionList.getQuestion();

  const possibleAnswers = sampleQuestion.answers.length; // To powinno byc pobierane z Question
  console.log("PosAnswers:" + possibleAnswers);
  globalSetQuestion = sampleQuestion;
  loadQuestion(sampleQuestion);

  ws.send(
    JSON.stringify({
      type: "question",
      possibleAnswers: possibleAnswers,
      nick: player.nick,
    })
  );
}

function handleFinishGame(
  player: Player,
  ws: WebSocket,
  showGameOverPopup: () => void
) {
  ws.send(JSON.stringify({ type: "gameFinish" }));
  showGameOverPopup();
}

export default function GameBoardPawn({
  player,
  shift,
  boardFields,
  handleOpenSpecialPopup,
  showGameOverPopup: showFinishGamePopup,
}: GameBoardPawnProps) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [ws, setWs] = useState<WebSocket>(
    new WebSocket("ws://localhost:3000/ws")
  );
  const [ipAddress, setIPAddress] = useState<string>("");

  useEffect(() => {
    axios
      .get<string>("http://localhost:3000/ipaddress")
      .then((response) => handleConnection(response))
      .catch((error) => {
        console.error("Błąd pobierania danych:", error);
      });
  }, []);

  function handleConnection(response: AxiosResponse) {
    setIPAddress(response.data);
    const newWs = new WebSocket(`ws://${response.data}:3000/ws`);
    setWs(newWs);
    if (newWs) {
      newWs.onopen = async () => {
        console.log("Connected to server");
        newWs.send(JSON.stringify({ type: "regPawn", nick: player.nick }));
      };
      newWs.onmessage = (event) => {
        let data = JSON.parse(event.data);
        console.log("Received message: ", event.data);
        console.log("Data type: ", data.type);
        if (data.type === "movePawn" && data.nick == player.nick) {
          movePawn(data.fieldsToMove, data.shouldMoveFlag);
        } else if (data.type == "answer" && data.nick == player.nick) {
          revealAnswer(data.answer, globalSetQuestion, ws, player.nick);
        }
      };
    }
  }

  async function handleGoodField() {
    const fieldsToMove = Math.floor(Math.random() * 4) + 1;
    if (fieldsToMove == 1) {
      await handleOpenSpecialPopup("Idziesz 1 pole do przodu!");
    } else {
      await handleOpenSpecialPopup(`Idziesz ${fieldsToMove} pola do przodu`);
    }
    movePawn(fieldsToMove, true);
  }

  async function handleBadField() {
    const fieldsToMove = Math.floor(Math.random() * 4) + 1;
    if (fieldsToMove == 1) {
      await handleOpenSpecialPopup("Idziesz 1 pole do tyłu!");
    } else {
      await handleOpenSpecialPopup(`Idziesz ${fieldsToMove} pola do tyłu`);
    }
    movePawn(-fieldsToMove, true);
  }

  function movePawn(fieldsToMove: number, shouldMoveFlag: boolean) {
    setCurrentPosition((prevPosition) => {
      const newPosition = prevPosition + fieldsToMove;
      
      if (newPosition >= boardFields.length - 1) {
        player.score = boardFields.length - 1;
        handleFinishGame(player, ws, showFinishGamePopup);
        return boardFields.length - 1;
      }
      if (newPosition <= 0) {
        player.score = 0;
        return 0;
      }
      player.score = newPosition;
      if (boardFields[newPosition].type !== "question") {
        ws.send(
          JSON.stringify({ type: "question", nick: "", possibleAnswers: 0 })
        );
        console.log("No question");
      }
      if (boardFields[newPosition].type === "question" && !shouldMoveFlag) {
        redirectToQuestionPage(player, ws);
      } else if (boardFields[newPosition].type === "finish") {
        handleFinishGame(player, ws, showFinishGamePopup);
      } else if (boardFields[newPosition].type === "good" && !shouldMoveFlag) {
        handleGoodField();
      } else if (boardFields[newPosition].type === "bad" && !shouldMoveFlag) {
        handleBadField();
      }
      return newPosition;
    });
  }

  if (!boardFields) {
    return <div>Nie ma z kim grać...</div>;
  }
  if (!player) {
    return <div>Brak gracza...</div>;
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gridRow: boardFields[currentPosition].rowClass,
        gridColumn: boardFields[currentPosition].colClass,
        transform: `translate(${shift.x}px, ${shift.y}px)`,
      }}
      // TODO: remove after connecting to socket
      onClick={() => movePawn(1, false)}
      className={twMerge(
        "bg-white h-6 w-6 rounded-full my-2.5 mx-2.5",
        player.background
      )}
    >
      <LazyIcon
        iconName={player.iconName}
        style={{ height: "80%", width: "80%" }}
      />
    </div>
  );
}
