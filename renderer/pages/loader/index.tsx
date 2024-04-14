import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import QuestionComponent from "./QuestionComponent";
import { QuestionList } from "../../models/QuestionList";
import { Question } from "../../models/Question";
import { z } from "zod";
import { QuestionType } from "../../types/QuestionType";

const zQuestion = z.array(
  z.object({
    content: z.string(),
    answers: z.array(z.string()),
    correctAnswerId: z.number(),
  })
);

export default function Loader() {
  const [loadedQuestions, setLoadedQuestions] = useState<Question[]>([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [Outquestion, setOutQuestion] = useState("");
  const [OutAnswers, setOutAnswers] = useState<string[]>([]);
  const [OutCorrectAnswerId, setOutCorrectAnswerId] = useState(-1);
  const [OutQuestionId, setOutQuestionId] = useState(-1);
  const minimumQuestionsNumber = 20;
  const shuffleCheckboxRef = useRef<HTMLInputElement | null>(null);

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
    loadQuestionsFromList();
  };

  const questionList = QuestionList.getInstance();

  useEffect(() => {
    loadQuestionsFromList();
  }, []);

  const loadQuestionsFromList = () => {
    const allQuestions = questionList.questions;
    setLoadedQuestions(allQuestions);
  };

  const loadQuestionstoFile = () => {
    try {
      const questions = questionList.questions;
      const jsonData = JSON.stringify(questions, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "questions.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error saving questions to file:", error);
    }
  };

  const loadQuestionsFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    if (fileExtension !== "json") {
      alert("Proszę wybrać plik w formacie JSON.");
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (event) => {
      try {
        questionList.questions = [];
        const content = event.target?.result?.toString();
        if (content) {
          const questions = zQuestion.parse(JSON.parse(content));

          if (questions.length === 0) {
            alert("Wczytany plik z pytaniami jest pusty.");
            return;
          }

          questions.map((question: QuestionType) => {
            questionList.addQuestion(
                new Question(
                    question.content,
                    question.answers,
                    question.correctAnswerId
                )
            );
          });
          loadQuestionsFromList();
        }
      } catch (error) {
        alert("W wybranym pliku z pytaniami znajduje się błąd, proszę spróbować wybrać inny plik.");
        console.error("Error loading questions from file:", error);
      }
    };
    reader.readAsText(file);
  };

  const handleAddQuestion = () => {
    setOutQuestion("");
    setOutAnswers([""]);
    setOutCorrectAnswerId(-1);
    setPopupOpen(true);
    loadQuestionsFromList();
  };

  const handleEditQuestion = (index: number) => () => {
    const question = loadedQuestions[index];
    setOutQuestion(question.content);
    setOutAnswers(question.answers);
    setOutCorrectAnswerId(question.correctAnswerId);
    setOutQuestionId(index);
    setPopupOpen(true);
  };

  const handleDeleteQuestion = (index: number) => () => {
    questionList.questions = questionList.questions.filter(
      (_, i) => i !== index
    );
    loadQuestionsFromList();
  };

  const handleDeleteAllQuestions = () => {
    questionList.questions = [];
    loadQuestionsFromList();
  };

  const handleGoNext = () => {
    if (shuffleCheckboxRef.current)
      if (shuffleCheckboxRef.current.checked) questionList.shuffleQuestions();
  };

  return (
    <React.Fragment>
      <Head>
        <title>Import to/Eksport from file</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        <button
          onClick={loadQuestionstoFile}
          className="text-white font-bold py-2 px-4 rounded bg-secondary mx-auto my-3"
        >
          Pobierz swoje pytania
        </button>
        <h1 className="mt-4">Prześlij swój plik z pytaniami: </h1>
        <input
          type="file"
          accept=".json"
          onChange={loadQuestionsFromFile}
          className="text-white font-bold py-2 px-4 rounded bg-secondary mx-auto my-3 text-center"
        />
        <h1 className="mt-4">Aktualne pytania</h1>
        <div className="py-2">
          {loadedQuestions.map((question, index) => (
            <div key={index} className="border border-gray-300 p-4 mb-4">
              <p className="font-bold">Pytanie {index + 1}:</p>
              <p>{question.content}</p>
              <p className="font-bold">Odpowiedzi:</p>
              <ul>
                {question.answers.map((answer, idx) => (
                  <li key={idx}>
                    {answer}{" "}
                    {idx === question.correctAnswerId &&
                      "(Odpowiedź prawidłowa)"}
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
          ))}
        </div>
        <button
          className="text-white font-bold py-2 px-4 rounded bg-secondary mx-auto"
          onClick={handleAddQuestion}
        >
          Dodaj pytanie
        </button>
        <button
          className="text-white font-bold py-2 px-4 rounded bg-secondary mx-auto mt-2"
          onClick={handleDeleteAllQuestions}
        >
          Usuń wszystkie pytania
        </button>
        <div className="has-tooltip mt-3">
          <span className="tooltip rounded shadow-lg p-1 bg-childBlack text-base -mt-8">
            Pytania będą pojawiały się w losowej kolejności po zaznaczeniu tej
            opcji
          </span>
          <label>
            <input
              type="checkbox"
              className="default-checkbox mx-4"
              id="shuffle-checkbox"
              ref={shuffleCheckboxRef}
            />
            Pytania w losowej kolejności
          </label>
        </div>
        {minimumQuestionsNumber <= questionList.getQuestionsNumber() && (
          <Link href="/config_page">
            <button
              className="text-white font-bold py-2 px-4 rounded bg-secondary mx-auto mt-2"
              onClick={handleGoNext}
            >
              Przejdź dalej
            </button>
          </Link>
        )}
        {minimumQuestionsNumber > questionList.getQuestionsNumber() && (
          <h1 className="mt-4">Dodaj więcej pytań by przejść dalej</h1>
        )}
      </div>
      <QuestionComponent
        {...{
          inQuestion: Outquestion,
          inAnswers: OutAnswers,
          isOpen: isPopupOpen,
          onClose: togglePopup,
          correctAnswerId: OutCorrectAnswerId,
          inQuestionId: OutQuestionId,
        }}
      />
    </React.Fragment>
  );
}
