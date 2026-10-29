// Переменные для данных и элементов страницы
let recipesList = [];
let timeDirection = true;
let ratingDirection = true;

let cardContainer = document.getElementById('list');
let searchBox = document.getElementById('search');
let filterBox = document.getElementById('filter');
let timeBtn = document.getElementById('sortTime');
let ratingBtn = document.getElementById('sortRating');
let loadText = document.getElementById('loading');
let countText = document.getElementById('counter');
let errorText = document.getElementById('error');
let emptyText = document.getElementById('empty');

// Функция получения данных из интернета
function getRecipes() {
    fetch('https://dummyjson.com/recipes?limit=30')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            recipesList = data.recipes;
            loadText.style.display = 'none';
            showCards(recipesList);
        })
        .catch(function(err) {
            loadText.style.display = 'none';
            errorText.style.display = 'block';
            errorText.innerText = "Ошибка загрузки: " + err;
        });
}

// Функция вывода карточек на экран
function showCards(arr) {
    cardContainer.innerHTML = '';
    countText.innerText = "Показано карточек: " + arr.length;

    if (arr.length === 0) {
        emptyText.style.display = 'block';
        return;
    } else {
        emptyText.style.display = 'none';
    }

    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        let totalTime = item.prepTimeMinutes + item.cookTimeMinutes;

        cardContainer.innerHTML += `
            <div class="card">
                <img src="${item.image}" alt="">
                <div>
                    <h3>${item.name}</h3>
                    <p>Кухня: ${item.cuisine}</p>
                    <p>Время: ${totalTime} мин</p>
                    <p>Калории: ${item.caloriesPerServing}</p>
                    <p>Рейтинг: ${item.rating}</p>
                </div>
            </div>
        `;
    }
}

// Поиск при вводе текста
searchBox.oninput = function() {
    let text = searchBox.value.toLowerCase();
    let result = [];

    for (let i = 0; i < recipesList.length; i++) {
        let name = recipesList[i].name.toLowerCase();
        if (name.includes(text)) {
            result.push(recipesList[i]);
        }
    }

    showCards(result);
};

// Фильтр по сложности (Easy / Medium)
filterBox.onchange = function() {
    let val = filterBox.value;

    if (val === 'All') {
        showCards(recipesList);
    } else {
        let result = [];
        for (let i = 0; i < recipesList.length; i++) {
            if (recipesList[i].difficulty === val) {
                result.push(recipesList[i]);
            }
        }
        showCards(result);
    }
};

// Сортировка по времени
timeBtn.onclick = function() {
    recipesList.sort(function(a, b) {
        let t1 = a.prepTimeMinutes + a.cookTimeMinutes;
        let t2 = b.prepTimeMinutes + b.cookTimeMinutes;
        if (timeDirection) {
            return t1 - t2;
        } else {
            return t2 - t1;
        }
    });
    timeDirection = !timeDirection;
    showCards(recipesList);
};

// Сортировка по рейтингу
ratingBtn.onclick = function() {
    recipesList.sort(function(a, b) {
        if (ratingDirection) {
            return a.rating - b.rating;
        } else {
            return b.rating - a.rating;
        }
    });
    ratingDirection = !ratingDirection;
    showCards(recipesList);
};

// Запуск программы
getRecipes();