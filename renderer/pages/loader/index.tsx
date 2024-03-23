import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { QuestionList } from "../../models/QuestionList";
import { Question } from "../../models/Question";
import { z } from "zod";

const zQuestion = z.array(
  z.object({
    content: z.string(),
    answers: z.array(z.string()),
    correctAnswerId: z.number(),
  })
);

export type QuestionType = {
  content: string;
  answers: string[];
  correctAnswerId: number;
};

export default function Loader() {
  const [loadedQuestions, setLoadedQuestions] = useState<Question[]>([]);

  const questionList = QuestionList.getInstance();

  useEffect(() => {
    loadQuestionsFromList();
  }, []);

  const loadQuestionsFromList = () => {
    const allQuestions = questionList.getAllQuestions();
    setLoadedQuestions(allQuestions);
  };

  const loadQuestionstoFile = () => {
    try {
      const questions = questionList.unusedQuestions.concat(
        questionList.usedQuestions
      );
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

  const loadQuestionsFromFile = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: File | undefined = event.target.files?.[0];
    if (!file) return;
    const reader: FileReader = new FileReader();
    reader.onload = (event) => {
      try {
        questionList.usedQuestions = [];
        questionList.unusedQuestions = [];
        const content = event.target?.result?.toString();
        if (content) {
          const questions = zQuestion.parse(JSON.parse(content));
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
        console.error("Error loading questions from file:", error);
      }
    };
    reader.readAsText(file);
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
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/questionPage">
            <a className="text-white font-bold py-2 px-4 rounded bg-secondary  mx-auto">
              Dodaj pytania
            </a>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
}
