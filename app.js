const addNewMovie = document.getElementById("addNewMovie");
const movieList = document.querySelector(".movie-list");

const popup = document.querySelector(".popup-add-movie");
const popupClose = document.querySelector(".close-btn");

const movieTitle = document.getElementById("movie-title");
const poster = document.getElementById("poster");
const movieDirector = document.getElementById("movie-director");
const movieYear = document.getElementById("release-year");

const watched = document.getElementById("watched");
const favorite = document.getElementById("favorite");

const addMovieForm = document.getElementById("add-movie");

let watchedMovies = [];

function renderMovie() {
  movieList.innerHTML = "";

  watchedMovies.forEach(function (movie) {
    //create cards
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const title = document.createElement("h2");
    title.textContent = movie.movie_title;

    const posterImg = document.createElement("div");
    posterImg.innerHTML = `<img src="${movie.movie_poster}" alt="${movie.movie_title} poster" height="120px">`;

    const director = document.createElement("p");
    director.textContent = movie.movie_director;

    const year = document.createElement("p");
    year.textContent = movie.movie_year;

    const watchedStat = document.createElement("p");
    if (movie.movie_watched) {
      watchedStat.textContent = "Watched";
    } else {
      watchedStat.textContent = "Unwatched";
    }

    const favoriteStat = document.createElement("p");
    if (movie.movie_favorite) {
      favoriteStat.textContent = "⭐";
    } else {
      favoriteStat.textContent = "";
    }

    const status = document.createElement("p");
    status.textContent = `${watchedStat.textContent}  |  ${favoriteStat.textContent}`;

    card.append(posterImg);
    card.append(title);
    card.append(director);
    card.append(year);
    card.append(status);
    // card.append(watchedStat);
    // card.append(favoriteStat);
    movieList.append(card);
  });
}

addNewMovie.addEventListener("click", function () {
  popup.classList.add("active");
});

popupClose.addEventListener("click", function () {
  popup.classList.remove("active");
});

addMovieForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let movie = {
    movie_title: `${movieTitle.value}`,
    movie_poster: `${poster.value}`,
    movie_director: `${movieDirector.value}`,
    movie_year: `${movieYear.value}`,
    movie_watched: watched.checked,
    movie_favorite: favorite.checked,
  };
  watchedMovies.push(movie);
  popup.classList.remove("active");
  addMovieForm.reset();
  console.log(watchedMovies);
  renderMovie();
});
