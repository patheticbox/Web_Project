const testData = {
    "testName": "Тест про випічку",
    "questions": [
      {
        "question": "Яка страва є символом французької випічки?",
        "answers": [
          {
            "answer": "Панкейки",
            "isCorrect": false
          },
          {
            "answer": "Круасан",
            "isCorrect": true
          },
          {
            "answer": "Чизкейк",
            "isCorrect": false
          },
          {
            "answer": "Маффін",
            "isCorrect": false
          }
        ]
      },
      {
        "question": "Яка випічка характерна для італійської кухні?",
        "answers": [
          {
            "answer": "Бейгл",
            "isCorrect": false
          },
          {
            "answer": "Піца",
            "isCorrect": true
          },
          {
            "answer": "Булочка з корицею",
            "isCorrect": false
          },
          {
            "answer": "Багет",
            "isCorrect": false
          }
        ]
      },
      {
        "question": "Яке походження має випічка Круасан?",
        "answers": [
          {
            "answer": "Французьке",
            "isCorrect": false
          },
          {
            "answer": "Італійське",
            "isCorrect": false
          },
          {
            "answer": "Австрійське",
            "isCorrect": true
          },
          {
            "answer": "Іспанське",
            "isCorrect": false
          }
        ]
      },
      {
        "question": "Яке основне інгредієнт в піці?",
        "answers": [
          {
            "answer": "Шоколад",
            "isCorrect": false
          },
          {
            "answer": "Сир",
            "isCorrect": true
          },
          {
            "answer": "Кава",
            "isCorrect": false
          },
          {
            "answer": "М'ясо",
            "isCorrect": false
          }
        ]
      },
      {
        "question": "Що є типовою складовою випічки української кухні?",
        "answers": [
          {
            "answer": "Хумус",
            "isCorrect": false
          },
          {
            "answer": "Борщ",
            "isCorrect": false
          },
          {
            "answer": "Пампушки",
            "isCorrect": true
          },
          {
            "answer": "Спагетті",
            "isCorrect": false
          }
        ]
      }
    ]
};

const questionsContainer = document.getElementById('questions-container');
const submitButton = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');

// Відображення питань та відповідей
function displayQuestions() {
    testData.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `<h3>Питання ${index + 1}: ${question.question}</h3>`;
        
        question.answers.forEach((answer, answerIndex) => {
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('answer');
            answerDiv.innerHTML = `
                <input type="radio" id="answer-${index}-${answerIndex}" name="answer-${index}" value="${answerIndex}">
                <label for="answer-${index}-${answerIndex}">${answer.answer}</label>
            `;
            questionDiv.appendChild(answerDiv);
        });
        
        questionsContainer.appendChild(questionDiv);
    });
}

// Перевірка правильності відповідей та виведення результату
function checkAnswers() {
    let correctAnswers = 0;
    testData.questions.forEach((question, index) => {
        const selectedAnswer = document.querySelector(`input[name="answer-${index}"]:checked`);
        if (selectedAnswer) {
            const selectedAnswerIndex = selectedAnswer.value;
            const selectedAnswerElement = document.getElementById(`answer-${index}-${selectedAnswerIndex}`);
            if (question.answers[selectedAnswerIndex].isCorrect) {
                correctAnswers++;
                selectedAnswerElement.nextElementSibling.style.color = 'green';
            } else {
                selectedAnswerElement.nextElementSibling.style.color = 'red';
            }
        }
        // Відображення правильних відповідей
        question.answers.forEach((answer, answerIndex) => {
            const answerElement = document.getElementById(`answer-${index}-${answerIndex}`);
            if (answer.isCorrect) {
                answerElement.nextElementSibling.style.color = 'green';
            }
            // Відключення радіо-кнопок
            answerElement.disabled = true;
        });
    });
    const totalQuestions = testData.questions.length;
    const score = (correctAnswers / totalQuestions) * 100;
    resultDiv.textContent = `Ви відповіли правильно на ${correctAnswers} з ${totalQuestions} питань. Ваш результат: ${score}%`;
}

// Відображення питань при завантаженні сторінки
window.onload = () => {
    displayQuestions();
};

// Обробник події кнопки "Завершити тест"
submitButton.addEventListener('click', () => {
    checkAnswers();
});