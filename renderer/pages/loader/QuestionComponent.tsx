import React, { useState, useEffect, ChangeEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import { QuestionList } from "../../models/QuestionList";
import { Question } from "../../models/Question";
import { compileString } from "sass";
import { on } from "events";
import { set } from "zod";

type QuestionProps = {
  inQuestion: string;
  inAnswers: string[];
  correctAnswerId: number;
  isOpen: boolean;
  inQuestionId: number;
  onClose: () => void;
};

const questionList = QuestionList.getInstance();

export default function QuestionComponent({
  inQuestion,
  inAnswers,
  isOpen,
  onClose,
  correctAnswerId,
  inQuestionId,
}: QuestionProps) {
  if (!isOpen) return null;

  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [questionId, setQuestionId] = useState<number>(-1);

  useEffect(() => {
    setQuestion(inQuestion);
    setAnswers(inAnswers);
    if (correctAnswerId !== -1) {
      setCorrectAnswer(correctAnswerId);
      setQuestionId(inQuestionId);
    }
  }, [inQuestion, inAnswers, correctAnswerId, inQuestionId]);

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const newAnswers = answers.map((answer, i) =>
      i === index ? e.target.value : answer
    );
    setAnswers(newAnswers);
  };

  const handleCorrectChange = (index: number): void => {
    setCorrectAnswer(index);
  };

  const addAnswer = (): void => {
    if (answers.length < 4) {
      setAnswers([...answers, ""]);
    }
  };

  const removeAnswer = (index: number): void => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    if (correctAnswerId === -1) {
      e.preventDefault();
      const newQuestion = new Question(question, answers, correctAnswer);
      questionList.addQuestion(newQuestion);
      onClose();
    } else {
      questionList.updateQuestion(
        questionId,
        new Question(question, answers, correctAnswer)
      );
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed top-0 z-2 flex items-center flex-row w-full justify-center h-screen">
      <div className="bg-childBlack rounded-3xl">
        <form
          onSubmit={handleSubmit}
          className="question-page p-8 flex flex-col items-center justify-center"
        >
          <div className="question-text mb-4">
            <span className="text-white font-bold">Twoje pytanie</span>
          </div>
          <input
            type="text"
            className="question-input px-4 py-2 bg-gray-100 text-gray-800 rounded"
            placeholder="Wprowadź pytanie"
            value={question}
            onChange={handleQuestionChange}
          />

          <div className="question-text mt-6 mb-4">
            <span className="text-white font-bold">Twoje odpowiedzi</span>
          </div>

          {answers.map((answer, index) => (
            <div key={index} className="flex items-center mb-4">
              <input
                type="radio"
                checked={index === correctAnswer}
                onChange={() => handleCorrectChange(index)}
                className="mr-2"
              />
              <input
                type="text"
                className="question-input px-4 py-2 bg-gray-100 text-gray-800 rounded mr-2"
                placeholder="Wprowadź odpowiedź"
                value={answer}
                onChange={(e) => handleAnswerChange(index, e)}
              />
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                style={{ backgroundColor: "#F39A9D", color: "white" }}
                onClick={() => removeAnswer(index)}
              >
                -
              </button>
            </div>
          ))}
          {answers.length < 4 && (
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              style={{ backgroundColor: "#F39A9D", color: "white" }}
              onClick={addAnswer}
            >
              +
            </button>
          )}
          {answers.length > 1 &&
            question.trim() !== "" &&
            answers.every((answer) => answer.trim() !== "") && (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                style={{ backgroundColor: "#F39A9D", color: "white" }}
              >
                {correctAnswerId === -1
                  ? "Dodaj pytanie"
                  : "Zaktualizuj pytanie"}
              </button>
            )}
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            style={{ backgroundColor: "#3F6C51", color: "white" }}
          >
            Wróć
          </button>
        </form>
      </div>
    </div>
  );
}
