const form = document.getElementById('surveyForm');

// Функція для зберігання даних у LocalStorage
function saveToLocalStorage() {
    const formData = new FormData(form);
    const formObject = {};

    formData.forEach(function(value, key) {
        if (key === 'taxNews') {
            // Якщо значення - масив, зберігаємо як є
            formObject[key] = Array.isArray(formObject[key]) ? [...formObject[key], value] : [value];
        } else {
            formObject[key] = value;
        }
    });

    // Зберігаємо дані у LocalStorage
    const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
    surveys.push(formObject);
    localStorage.setItem('surveys', JSON.stringify(surveys));
}

// Обробник події подання форми
form.addEventListener('submit', function(event) {
    event.preventDefault();
    saveToLocalStorage();
    alert('Дякуємо за участь у опитуванні!');
    this.reset();
});

// Оновлення значення output при зміні range input
const rangeInput = document.getElementById('productQuality');
const outputValue = document.getElementById('productQualityValue');

rangeInput.addEventListener('input', function() {
    outputValue.textContent = this.value;
});

// Отримання даних з LocalStorage
const surveys = JSON.parse(localStorage.getItem('surveys')) || [];

// Відображення опитувань, що відповідають фільтру
function displayFilteredSurveys() {
    const emailFilter = document.getElementById('searchInput').value.trim().toLowerCase();
    const searchResultsContainer = document.getElementById('searchResults');
    if (searchResultsContainer) {
        searchResultsContainer.innerHTML = '';
    }

    if (emailFilter !== '') {
        const searchResults = surveys.filter(survey => {
            return survey.email && survey.email.toLowerCase().includes(emailFilter);
        });

        if (searchResults.length > 0) {
            const resultsList = document.createElement('ul');
            searchResults.forEach(result => {
                const listItem = document.createElement('li');
                listItem.textContent = JSON.stringify(result, null, 2);
                resultsList.appendChild(listItem);
            });
            searchResultsContainer.appendChild(resultsList);
        } else {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'Немає результатів.';
            searchResultsContainer.appendChild(noResultsMessage);
        }
    }
}

// Фільтрація при зміні значень у полі пошуку
document.getElementById('searchInput').addEventListener('input', displayFilteredSurveys);
