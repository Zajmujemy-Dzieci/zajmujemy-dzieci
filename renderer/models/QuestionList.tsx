import { Question } from './Question';

export class QuestionList {
    static instance: QuestionList;
    questions: Question[];

    constructor() {
        const q = new Question("What is the capital of France?", ["Paris", "Madrid", "Berlin"], 0);
        this.questions = [];
    }

    public static getInstance(): QuestionList {
        if (!QuestionList.instance) {
            QuestionList.instance = new QuestionList();
        }
        return QuestionList.instance;
    }

    addQuestion(question: Question) {
        this.questions.push(question);
    }

    getQuestion(): Question {
        if (this.questions.length === 0) {
            throw new Error("No questions available.");
        }

        const question = this.questions.splice(0, 1)[0];
        this.questions.push(question);

        return question;
    }

    updateQuestion(index: number, question: Question) {
        this.questions[index] = question;
    }

    getQuestionsNumber(): number {
        return this.questions.length;
    }

    shuffleQuestions(): void {
        for (let i = this.questions.length - 1; i > 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1)); 
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]]; 
          } 
    }
}

/* 
// Example usage:
const question1 = new Question("What is the capital of France?", ["Paris", "Madrid", "Berlin"], 0);
const question2 = new Question("Who wrote 'Romeo and Juliet'?", ["Shakespeare", "Hemingway", "Tolstoy"], 0);

const questionList = new QuestionList([question1, question2]);

try {
    const randomQuestion = questionList.chooseRandomQuestion();
    console.log("Random question:", randomQuestion.content);
    console.log("Questions left:", questionList.getQuestionsLeft());
} catch (error) {
    console.error(error.message);
}  
*/