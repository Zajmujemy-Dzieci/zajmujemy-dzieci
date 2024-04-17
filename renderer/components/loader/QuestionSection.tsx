import { Question } from "../../models/Question";
import { useState } from "react";

type QuestionSectionProps = {
  question: Question;
  index: number;
  handleEditQuestion: (index: number) => () => void;
  handleDeleteQuestion: (index: number) => () => void;
};

export default function QuestionSection({
  question,
  index,
  handleEditQuestion,
  handleDeleteQuestion,
}: QuestionSectionProps) {
  const [isContentVisible, setIsContentVisible] = useState(false);

  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
  };

  if (!question) {
    return <div>Brak pytań</div>;
  }

  return (
    <div key={index} className="p-4 mb-4">
      <div
        onClick={toggleContentVisibility}
        className="bg-childBlack hover:bg-childWhite hover:text-childBlack cursor-pointer p-1 rounded"
      >
        <p className="font-bold">Pytanie {index + 1}:</p>
        <p>{question.content}</p>
      </div>
      {isContentVisible && (
        <div className="transition-all duration-700 ease-in-out">
          <p className="font-bold">Odpowiedzi:</p>
          <ul>
            {question.answers.map((answer, idx) => (
              <li key={idx}>
                {answer}{" "}
                {idx === question.correctAnswerId && "(Odpowiedź prawidłowa)"}
              </li>
            ))}
          </ul>
          <button
            className="text-white font-bold py-2 px-4 rounded bg-secondary mx-auto my-3"
            onClick={handleEditQuestion(index)}
          >
            Edytuj pytanie
          </button>
          <button
            className="text-white font-bold py-2 px-4 rounded bg-secondary mx-auto my-3 ml-2"
            onClick={handleDeleteQuestion(index)}
          >
            Usuń pytanie
          </button>
        </div>
      )}
    </div>
  );
}
