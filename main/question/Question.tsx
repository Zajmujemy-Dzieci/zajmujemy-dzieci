const minimumAnswersNumber = 2;
const maximumAnswersNumber = 5;

export class Question {
    content: string;            // the question itself
    answers: string[];          // possible answers
    correctAnswerId: number;    // the id for the array above

    constructor(content: string, answers: string[], correctAnswerId: number) {
        if (answers.length < minimumAnswersNumber || answers.length > maximumAnswersNumber){
            throw new Error("Invalid number of answers. Must be between " + minimumAnswersNumber + " and " + maximumAnswersNumber);
        }
        if (correctAnswerId >= answers.length || correctAnswerId < 0) {
            throw new Error("Correct answer id out of range. Must be between 0 and " + (answers.length - 1) + ", is: " + correctAnswerId);
        }
        this.content = content;
        this.answers = answers;
        this.correctAnswerId = correctAnswerId;
    }
}

/* 
Example usage:
const sampleQuestion = new Question(
    "What is the capital of France?",
    ["Paris", "Berlin", "Madrid", "Rome"],
    0 // Index of the correct answer (Paris)
);

console.log(sampleQuestion.content); // Outputs: "What is the capital of France?"
console.log(sampleQuestion.answers); // Outputs: ["Paris", "Berlin", "Madrid", "Rome"]
console.log(sampleQuestion.correctAnswerId); // Outputs: 0 
*/