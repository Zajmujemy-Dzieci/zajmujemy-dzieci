import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { QuestionList } from '../../models/QuestionList';
import { Question } from '../../models/Question';

export default function Loader() {
  const [loadedQuestions, setLoadedQuestions] = useState([]);

  const questionList = QuestionList.getInstance();

  useEffect(() => {
    loadQuestionsFromList();
  }, []);

  const loadQuestionsFromList = () => {
    const allQuestions = questionList.getAllQuestions();
    setLoadedQuestions(allQuestions);
  };

  const downloadQuestionsToFile = () => {
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

  const uploadQuestionsFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        questionList.usedQuestions = [];
        questionList.unusedQuestions = [];
        const content = event.target.result.toString(); // Convert ArrayBuffer to string
        const questions = JSON.parse(content);
        const questionObjects = questions.map((question) => {
          questionList.addQuestion(new Question(question.content, question.answers, question.correctAnswerId));
        });
        loadQuestionsFromList(); // Refresh the displayed questions after loading
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
        <button onClick={downloadQuestionsToFile}>Pobierz swoje pytania</button>
        <input type="file" accept=".json" onChange={uploadQuestionsFromFile} />
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
