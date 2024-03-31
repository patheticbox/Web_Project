const testData = {
    "testName": "Тест про туризм в Римі",
    "questions": [
      {
        "question": "Яка ставка податку на прибуток для корпорацій в вашій країні?",
        "answers": [
          {
            "answer": "10%",
            "isCorrect": false
          },
          {
            "answer": "20%",
            "isCorrect": false
          },
          {
            "answer": "25%",
            "isCorrect": true
          },
          {
            "answer": "30%",
            "isCorrect": false
          }
        ]
      },
      {
        "question": "Що означає скорочення “VAT”?",
        "answers": [
          {
            "answer": "Value Added Tax (Податок на додану вартість)",
            "isCorrect": true
          },
          {
            "answer": "Value Assessment Test (Тест на оцінку вартості)",
            "isCorrect": false
          },
          {
            "answer": "Voluntary Audit Training (Добровільна підготовка до аудиту)",
            "isCorrect": false
          },
          {
            "answer": "Variable Asset Tracking (Змінний відстеження активів)",
            "isCorrect": false
          }
        ]
      },
      {
        "question": "Які види доходів підлягають оподаткуванню в вашій країні?",
        "answers": [
          {
            "answer": "Тільки зарплата",
            "isCorrect": false
          },
          {
            "answer": "Тільки прибуток від продажу акцій",
            "isCorrect": false
          },
          {
            "answer": "Зарплата та прибуток від продажу акцій",
            "isCorrect": true
          },
          {
            "answer": "Заощадження на банківському рахунку",
            "isCorrect": false
          }
        ]
      },
      {
        "question": "Якщо ви використовуєте студентський кредит, чи підлягаєте ви оподаткуванню?",
        "answers": [
          {
            "answer": "Так",
            "isCorrect": false
          },
          {
            "answer": "Ні",
            "isCorrect": true
          },
          {
            "answer": "Залежно від суми кредиту",
            "isCorrect": false
          },
          {
            "answer": "Тільки якщо ви використовуєте його на розваги",
            "isCorrect": false
          }
        ]
      },
      {
        "question": "Якщо ви продаєте власну основну місцевість проживання, чи підлягає ви оподаткуванню з прибутку від продажу?",
        "answers": [
          {
            "answer": "Так",
            "isCorrect": false
          },
          {
            "answer": "Ні",
            "isCorrect": false
          },
          {
            "answer": "Залежно від тривалості володіння",
            "isCorrect": true
          },
          {
            "answer": "Тільки якщо ви переїжджаєте за кордон",
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