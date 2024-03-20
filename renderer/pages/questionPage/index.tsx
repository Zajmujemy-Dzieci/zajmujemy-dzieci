import React, { useState, ChangeEvent } from 'react';
import { QuestionList } from '../../models/QuestionList';
import { Question } from '../../models/Question';
import WarningPage from '../warningPage';

interface Answer {
  text: string;
  isCorrect: boolean;
}

const questionList = new QuestionList([]);

const QuestionPage: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [answers, setAnswers] = useState<Answer[]>([{ text: '', isCorrect: false }]);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuestion(e.target.value);
    setUnsavedChanges(true);
  };

  const handleAnswerChange = (index: number, e: ChangeEvent<HTMLInputElement>): void => {
    const newAnswers = answers.map((answer, i) => {
      if (i === index) {
        return { ...answer, text: e.target.value };
      }
      return answer;
    });
    setAnswers(newAnswers);
    setUnsavedChanges(true);
  };

  const handleCorrectChange = (index: number): void => {
    const newAnswers = answers.map((answer, i) => {
      if (i === index) {
        return { ...answer, isCorrect: !answer.isCorrect };
      }
      return { ...answer, isCorrect: false };
    });
    setAnswers(newAnswers);
    setUnsavedChanges(true);
  };

  const addAnswer = (): void => {
    if (answers.length < 4) {
      setAnswers([...answers, { text: '', isCorrect: false }]);
    }
    setUnsavedChanges(true);
  };

  const removeAnswer = (index: number): void => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
    setUnsavedChanges(true);
  };

  const handleConfirm = (): void => {
    const questionAnswers = answers.map(answer => answer.text);
    const correctAnswerId = answers.findIndex(answer => answer.isCorrect);

    const newQuestion = new Question(question, questionAnswers, correctAnswerId);
    questionList.addQuestion(newQuestion);
    
    console.log("Dodano pytanie:", newQuestion);
    console.log("Aktualna lista pytań:", questionList.unusedQuestions.length);

    setQuestion('');
    setAnswers([{ text: '', isCorrect: false }]);
    setUnsavedChanges(false);
  };

  const handleReturn = (): void => {
    if (unsavedChanges && (question.trim() !== '' || answers.some(answer => answer.text.trim() !== ''))) {
      setShowWarning(true); 
    } else {
      console.log("Powrót do poprzedniego ekranu");
    }
  };

  const handleReturnToPreviousPage = () => {
    setShowWarning(false); 
    console.log("Powrót do poprzedniego ekranu");
  };

  return (
    <div>
      {showWarning ? ( 
        <WarningPage 
          handleReturnToPreviousPage={handleReturnToPreviousPage} 
        />
      ) : (
        <div className={`question-page p-8 flex flex-col items-center justify-center h-screen ${answers.length > 4 ? 'overflow-y-auto' : ''}`}>
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
                checked={answer.isCorrect}
                onChange={() => handleCorrectChange(index)}
                className="mr-2"
              />
              <input 
                type="text" 
                className="question-input px-4 py-2 bg-gray-100 text-gray-800 rounded mr-2"
                placeholder="Wprowadź odpowiedź" 
                value={answer.text} 
                onChange={(e) => handleAnswerChange(index, e)} 
              />
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                style={{ backgroundColor: '#F39A9D', color: 'white' }}
                onClick={() => removeAnswer(index)}>
                -
              </button>
            </div>
          ))}
          
          {answers.length < 4 &&
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
              style={{ backgroundColor: '#F39A9D', color: 'white' }}
              onClick={addAnswer}>
              +
            </button>
          }

          <div className="mt-auto">
            <button 
              className="text-white font-bold py-2 px-4 rounded" 
              onClick={handleConfirm}
              style={{ backgroundColor: '#F39A9D', color: 'white' }}>
            Potwierdź
            </button>

            <button 
              className="text-white font-bold py-2 px-4 rounded ml-2"
              onClick={handleReturn}
              style={{ backgroundColor: '#F39A9D', color: 'white' }}>
            Powrót
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
