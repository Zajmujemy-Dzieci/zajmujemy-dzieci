import { Question } from './Question';

export class QuestionList {
    static instance: QuestionList;
    usedQuestions: Question[];
    unusedQuestions: Question[];

    constructor() {
        const q = new Question("What is the capital of France?", ["Paris", "Madrid", "Berlin"], 0);
        this.usedQuestions = [];
        this.unusedQuestions = [];
    }

    public static getInstance(): QuestionList {
        if (!QuestionList.instance) {
            QuestionList.instance = new QuestionList();
        }
        return QuestionList.instance;
    }

    addQuestion(question: Question) {
        this.unusedQuestions.push(question);
    }

    chooseRandomQuestion(): Question {
        if (this.unusedQuestions.length === 0) {
            throw new Error("No unused questions available.");
        }

        const randomIndex = Math.floor(Math.random() * this.unusedQuestions.length);
        const randomQuestion = this.unusedQuestions.splice(randomIndex, 1)[0];
        this.usedQuestions.push(randomQuestion);

        return randomQuestion;
    }

    getQuestionsLeftAmount(): number {
        return this.unusedQuestions.length;
    }

    getAllQuestions(): Question[] {
        return this.usedQuestions.concat(this.unusedQuestions);
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