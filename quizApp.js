// I imported my questions from questions.js
import { questions } from './questions.js';

// I define the Quiz class and formed Constructor to initialize quiz properties and event listener
class Quiz {
    constructor() {
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.quizContainer = document.getElementById('quiz-container');
        this.resultScreen = document.getElementById('results-screen');
        this.questionElement = document.getElementById('question');
        this.answerButtons = document.getElementById('answer-buttons');
        this.nextButton = document.getElementById('next-btn');
        this.progressBar = document.getElementById('progress');
        this.questionNumber = document.getElementById('question-number');
        this.currentScore = document.getElementById('current-score');
        this.finalScore = document.getElementById('final-score');
        this.startButton = document.getElementById('start-btn');
        this.restartButton = document.getElementById('restart-btn');
        this.loginScreen = document.getElementById('login-screen');
        this.loginForm = document.getElementById('login-form');
        this.usernameInput = document.getElementById('username');
        this.loginBtn = document.getElementById('login-btn');

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = new Array(questions.length).fill(null);

        this.startButton.addEventListener('click', () => this.startQuiz());
        this.nextButton.addEventListener('click', () => this.handleNextButton());
        this.restartButton.addEventListener('click', () => this.restartQuiz());
        this.loginBtn.addEventListener('click', (e) => this.handleLogin(e));

    }

    handleLogin(e) {
        e.preventDefault();
        const username = this.usernameInput.value.trim();
        if (username) {
          this.loginScreen.style.display = 'none';
          this.welcomeScreen.style.display = 'block';
          this.displayWelcomeMessage(username);
          this.startButton.style.display = 'block';
        }
      }


      displayWelcomeMessage(username) {
        const welcomeMessage = document.querySelector('.instructions');
        welcomeMessage.innerHTML = `Welcome, ${username}! Test your general knowledge with our quiz.`;
      }
      

    startQuiz() {
        this.welcomeScreen.style.display = 'none';
        this.quizContainer.style.display = 'block';
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = new Array(questions.length).fill(null);
        this.showQuestion();
    }

    showQuestion() {
        this.resetState();
        let currentQuestion = questions[this.currentQuestionIndex];
        let questionNo = this.currentQuestionIndex + 1;
        this.questionNumber.innerHTML = `Question ${questionNo}/${questions.length}`;
        this.progressBar.style.width = `${(questionNo / questions.length) * 100}%`;
        this.questionElement.innerHTML = currentQuestion.question;

        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerHTML = answer.text;
            button.classList.add('btn');
            this.answerButtons.appendChild(button);
            if(answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', (e) => this.selectAnswer(e));
        });

        this.nextButton.style.display = 'none';
    }

    resetState() {
        this.nextButton.style.display = 'none';
        while(this.answerButtons.firstChild) {
            this.answerButtons.removeChild(this.answerButtons.firstChild);
        }
    }
    
    selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === "true";
        Array.from(this.answerButtons.children).forEach(button => {
          button.classList.remove('correct', 'incorrect');
        });
        
        if (isCorrect) {
          selectedBtn.classList.add('correct');
          this.score++;
        } else {
          selectedBtn.classList.add('incorrect');
        }
        this.currentScore.innerHTML = this.score;
        Array.from(this.answerButtons.children).forEach(button => {
          button.disabled = true;
        });
        
        this.nextButton.style.display = 'block';
        this.updateNavigationButtons();
      }
      
    handleNextButton() {
        this.currentQuestionIndex++;
        if(this.currentQuestionIndex < questions.length) {
            this.showQuestion();
        } else {
            this.showResult();
        }
    }

    handlePrevButton() {
        if(this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion();
        }
    }

    updateNavigationButtons() {
        this.nextButton.style.display = 'block';
        this.nextButton.innerHTML = 
            this.currentQuestionIndex === questions.length - 1 
                ? "Show Result" 
                : "Next";
    }

    showResult() {
        this.quizContainer.style.display = 'none';
        this.resultScreen.style.display = 'block';
        this.finalScore.innerHTML = `${this.score}/${questions.length}`;
       
        if (this.score / questions.length > 0.8) {
            this.finalScore.innerHTML += `<br>Congratulations, you aced!`;
            this.restartButton.style.display = 'block';
            this.restartButton.innerHTML = 'Retake Quiz';

          } else if (this.score / questions.length > 0.4 && this.score / questions.length <= 0.8) {
            this.finalScore.innerHTML += `<br>Good result!`;
            this.restartButton.style.display = 'block';
            this.restartButton.innerHTML = 'Retake Quiz';
            
            
          } else if (this.score / questions.length <= 0.4) {
            this.finalScore.innerHTML += `<br>Sorry, you failed.`;
            this.restartButton.innerHTML = 'Retake Quiz';
          }

    }
      
    resetQuizState() {
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(questions.length).fill(null);
        this.currentScore.innerHTML = '0';
        this.progressBar.style.width = '0%';
      }
      
    restartQuiz() {
        this.resultScreen.style.display = 'none';
        this.resetQuizState();
        this.startQuiz();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});