document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const mealContainer = document.querySelector('#meal');
    const mealResult = document.querySelector('.meal-result');
    const suggestionsContainer = document.createElement('ul');
    suggestionsContainer.classList.add('suggestions');
    document.body.appendChild(suggestionsContainer);

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();
        if (query.length > 1) {
            await showSuggestions(query);
        } else {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none'; 
        }
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            performSearch();
            suggestionsContainer.style.display = 'none'; 
        }
    });
    

    searchBtn.addEventListener('click', () => {
        performSearch();
    });

    async function showSuggestions(query) {
        const apiKey = '7d156d5900804c4dbaf689364fc2a841';
        const apiUrl = `https://api.spoonacular.com/recipes/autocomplete?query=${query}&number=5&apiKey=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            suggestionsContainer.innerHTML = data.map(item => `<li>${item.title}</li>`).join('');
            suggestionsContainer.style.display = 'block';
            positionSuggestions();

            document.querySelectorAll('.suggestions li').forEach(item => {
                item.addEventListener('click', () => {
                    searchInput.value = item.textContent;
                    suggestionsContainer.innerHTML = '';
                    performSearch();
                });
            });
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            fetchMeals(query);
            mealResult.style.display = 'block';
        }
    }

async function fetchMeals(query) {
    const apiKey = '7d156d5900804c4dbaf689364fc2a841';
    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${query}&number=8&apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.length > 0) {
            displayMeals(data);
        } else {
            mealContainer.innerHTML = `<p>No recipes found for "${query}". Try a different ingredient.</p>`;
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        mealContainer.innerHTML = `<p>There was an error fetching recipes. Please try again later.</p>`;
        suggestionsContainer.innerHTML = ''; 
    }
}

    function displayMeals(meals) {
        mealContainer.innerHTML = meals.map(meal => `
            <a href="https://spoonacular.com/recipes/${meal.title.replace(/\s+/g, '-').toLowerCase()}-${meal.id}" 
               target="_blank" class="meal-item">
                <div class="meal-img">
                    <img src="${meal.image}" alt="${meal.title}">
                </div>
                <div class="meal-name">
                    <h3>${meal.title}</h3>
                    <p>Preparation time: ${meal.readyInMinutes || 'N/A'} mins</p>
                    <span class="recipe-btn">Get Recipe</span>
                </div>
            </a>
        `).join('');
    }

    function positionSuggestions() {
        const rect = searchInput.getBoundingClientRect();
        suggestionsContainer.style.position = 'absolute';
        suggestionsContainer.style.top = `${rect.bottom + window.scrollY}px`;
        suggestionsContainer.style.left = `${rect.left + window.scrollX}px`;
        suggestionsContainer.style.width = `${rect.width}px`;
        suggestionsContainer.style.zIndex = 1000;
        suggestionsContainer.style.backgroundColor = '#fff';
        suggestionsContainer.style.border = '1px solid #ddd';
        suggestionsContainer.style.listStyleType = 'none';
        suggestionsContainer.style.padding = '0';
        suggestionsContainer.style.margin = '0';
        suggestionsContainer.style.maxHeight = '200px';
        suggestionsContainer.style.overflowY = 'auto';
    }

    document.querySelectorAll('.suggestions li').forEach(item => {
        item.addEventListener('click', () => {
            searchInput.value = item.textContent;
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none'; 
            performSearch(); 
        });
    });
    
});
