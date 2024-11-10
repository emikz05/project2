let movies = [];
let watchList = JSON.parse(localStorage.getItem('watchList')) || [];

// Fetch movies based on search input
const searchMovies = async () => {
    const searchInput = document.getElementById('searchInput').value;
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=107f8c951a3b9ffd7f3478f21caf146a&query=${searchInput}`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            movies = data.results;
            displayMovies();
        } else {
            console.log("No movies found.");
        }
    } catch (error) {
        console.error("Error fetching movie data:", error);
    }
};

// Display movies in the grid
const displayMovies = () => {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '';  
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster">
            <h3>${movie.title}</h3>
            <p>${movie.release_date}</p>
        `;
        movieCard.addEventListener('click', () => openMovieModal(movie)); // Open modal on click
        movieGrid.appendChild(movieCard);
    });
};

// Open movie details in the modal
const openMovieModal = async (movie) => {
    document.getElementById('movieTitle').textContent = movie.title;
    document.getElementById('moviePoster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    document.getElementById('movieSynopsis').textContent = movie.overview;
    document.getElementById('movieRating').textContent = `Rating: ${movie.vote_average}`;
    document.getElementById('movieRuntime').textContent = movie.runtime ? `${movie.runtime} minutes` : 'N/A';

    try {
        const movieId = movie.id;
        const movieDetailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=107f8c951a3b9ffd7f3478f21caf146a`);
        const movieDetails = await movieDetailsResponse.json();
        const castResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=107f8c951a3b9ffd7f3478f21caf146a`);
        const castData = await castResponse.json();
        const reviewsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=107f8c951a3b9ffd7f3478f21caf146a`);
        const reviewsData = await reviewsResponse.json();
        const videosResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=107f8c951a3b9ffd7f3478f21caf146a`);
        const videosData = await videosResponse.json();

        updateCastAndCrew(castData.cast);
        updateReviews(reviewsData.results);
        updateTrailers(videosData.results);
        openModal('movieModal');
    } catch (error) {
        console.error("Error fetching additional movie details:", error);
    }
};

const updateCastAndCrew = (cast) => {
    const castContainer = document.getElementById('movieCast');
    castContainer.innerHTML = ''; 

    cast.slice(0, 5).forEach(person => { 
        const castMember = document.createElement('div');
        castMember.classList.add('cast-member');
        castMember.innerHTML = `
            <p><strong>${person.name}</strong> as ${person.character}</p>
        `;
        castContainer.appendChild(castMember);
    });
};

const updateReviews = (reviews) => {
    const reviewsContainer = document.getElementById('movieReviews');
    reviewsContainer.innerHTML = ''; 

    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews available.</p>';
    } else {
        reviews.slice(0, 3).forEach(review => { 
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review');
            reviewElement.innerHTML = `
                <p><strong>${review.author}</strong>: ${review.content}</p>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    }
};

const updateTrailers = (videos) => {
    const trailerContainer = document.getElementById('movieTrailer');
    trailerContainer.innerHTML = ''; 

    if (videos.length === 0) {
        trailerContainer.innerHTML = '<p>No trailers available.</p>';
    } else {
        const trailer = videos.find(video => video.type === 'Trailer');
        if (trailer) {
            const trailerIframe = document.createElement('iframe');
            trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}`;
            trailerIframe.width = "100%";
            trailerIframe.height = "400px";
            trailerContainer.appendChild(trailerIframe);
        }
    }
};

// Open the modal by showing it and hiding others
const openModal = (modalId) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none'); 
    const modal = document.getElementById(modalId);
    modal.style.display = 'block'; 
};

// Close the modal
const closeModal = () => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
};

const addToWatchList = () => {
    const movieTitle = document.getElementById('movieTitle').textContent;
    const movieId = movies.find(movie => movie.title === movieTitle).id;

    // Add movie to watchlist if it's not already added
    if (!watchList.some(movie => movie.id === movieId)) {
        watchList.push(movies.find(movie => movie.id === movieId));
        sessionStorage.setItem('watchList', JSON.stringify(watchList));
        alert(`${movieTitle} has been added to your watchlist.`);
    } else {
        alert(`${movieTitle} is already in your watchlist.`);
    }
};

// Show watchlist modal with only the movies the user added
const showWatchList = () => {
    const watchListModal = document.getElementById('watchListModal');
    updateWatchList(); 
    watchListModal.style.display = 'block'; 
};

// Hide watchlist modal
const hideWatchList = () => {
    const watchListModal = document.getElementById('watchListModal');
    watchListModal.style.display = 'none';
};

// Update Watchlist in modal
const updateWatchList = () => {
    const watchListItems = document.getElementById('watchListItems');
    watchListItems.innerHTML = ''; 

    watchList.forEach(movie => {
        const listItem = document.createElement('div');
        listItem.classList.add('watchlist-item');
        const movieLink = document.createElement('span');
        movieLink.classList.add('watchlist-title');
        movieLink.textContent = movie.title;
        movieLink.addEventListener('click', () => openMovieModal(movie));
        const posterImg = document.createElement('img');
        posterImg.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
        posterImg.alt = `${movie.title} Poster`;
        posterImg.classList.add('watchlist-poster');
        posterImg.style.display = 'none';
        listItem.addEventListener('mouseover', () => {
            posterImg.style.display = 'block'; 
        });
        listItem.addEventListener('mouseout', () => {
            posterImg.style.display = 'none';
        });
        listItem.appendChild(movieLink);
        listItem.appendChild(posterImg);
        watchListItems.appendChild(listItem);
    });
};

document.getElementById('searchBtn').addEventListener('click', searchMovies);
document.getElementById('watchListBtn').addEventListener('click', showWatchList);
document.getElementById('closeMovieModal').addEventListener('click', closeModal);
document.getElementById('closeWatchListModal').addEventListener('click', hideWatchList);
