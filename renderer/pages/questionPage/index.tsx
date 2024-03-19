import React, { useState, ChangeEvent } from 'react'; 
import { QuestionList } from '../../models/QuestionList';

interface Answer {
  text: string;
  isCorrect: boolean;
}

const QuestionPage: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [answers, setAnswers] = useState<Answer[]>([{ text: '', isCorrect: false }]);
  const questionList = new QuestionList([]);
  
  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (index: number, e: ChangeEvent<HTMLInputElement>): void => {
    const newAnswers = answers.map((answer, i) => {
      if (i === index) {
        return { ...answer, text: e.target.value };
      }
      return answer;
    });
    setAnswers(newAnswers);
  };

  const handleCorrectChange = (index: number): void => {
    const newAnswers = answers.map((answer, i) => {
      if (i === index) {
        return { ...answer, isCorrect: !answer.isCorrect };
      }
      return { ...answer, isCorrect: false };
    });
    setAnswers(newAnswers);
  };

  const addAnswer = (): void => {
    if (answers.length < 4) {
      setAnswers([...answers, { text: '', isCorrect: false }]);
    }
  };

  const removeAnswer = (index: number): void => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  const handleConfirm = (): void => {
    // questionList.addQuestion();
    console.log("Potwierdzono odpowiedzi");
  };

  const handleReturn = (): void => {
    console.log("Powrót do poprzedniego ekranu");
  };

  return (
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
  );
};

export default QuestionPage;
