import classNames from "classnames";
import styles from "./styles.module.scss";
import { Question } from "../../models/Question";
import QuestionSection from "./QuestionSection";

type QuestionListProps = {
  loadedQuestions: Question[];
  handleEditQuestion: (index: number) => () => void;
  handleDeleteQuestion: (index: number) => () => void;
};

export default function QuestionsList({
  loadedQuestions,
  handleEditQuestion,
  handleDeleteQuestion,
}: QuestionListProps) {
  if (!loadedQuestions || loadedQuestions.length === 0) {
    return null;
  }
  return (
    <>
      <h2 className={styles.questionsHeader}>Aktualne pytania</h2>
      <div
        className={classNames(
          "py-2 h-[40vh] w-[40vw] overflow-auto",
          styles.scrollableElement
        )}
      >
        {loadedQuestions.map((question, index) => (
          <QuestionSection
            key={index}
            question={question}
            index={index}
            handleEditQuestion={handleEditQuestion}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        ))}
      </div>
    </>
  );
}
