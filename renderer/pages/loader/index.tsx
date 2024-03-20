import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { QuestionList } from '../../models/QuestionList';
import { Question } from '../../models/Question';

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
      const questions = questionList.unusedQuestions.concat(questionList.usedQuestions);
      const jsonData = JSON.stringify(questions, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'questions.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving questions to file:', error);
    }
  };

  const loadQuestionsFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];
    if (!file) return;
    const reader: FileReader = new FileReader();
    reader.onload = (event) => {
      try {
        questionList.usedQuestions = [];
        questionList.unusedQuestions = [];
        const content = event.target?.result?.toString(); // Convert ArrayBuffer to string
        if (content) {
          const questions: QuestionType[] = JSON.parse(content);
          const questionObjects = questions.map((question: QuestionType) => {
            questionList.addQuestion(
              new Question(question.content, question.answers, question.correctAnswerId));
          });
          loadQuestionsFromList(); // Refresh the displayed questions after loading
        }
      } catch (error) {
        console.error('Error loading questions from file:', error);
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
        <button onClick={loadQuestionstoFile}>Pobierz swoje pytania</button>
        <input type="file" accept=".json" onChange={loadQuestionsFromFile} />
        <h1>Aktualne pytania</h1>
        {loadedQuestions.map((question, index) => (
          <div key={index}>
            <p>{question.content}</p>
            <ul>
              {question.answers.map((answer, idx) => (
                <li key={idx}>{answer}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
