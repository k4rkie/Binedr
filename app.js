const addNewMovie = document.getElementById("addNewMovie");
const searchMovie = document.getElementById("search-movie");
const selectFilter = document.getElementById("select-filter");
const clearListBtn = document.getElementById("clear-list");

selectFilter.value = "all";

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
loadFromLocalStorage();

function renderMovie(movieArray) {
  movieList.innerHTML = "";

  movieArray.forEach(function (movie) {
    //create cards
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.id = movie.movie_id;
    deleteBtn.textContent = "X";

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.id = movie.movie_id;
    editBtn.textContent = "🖊";

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

    card.append(deleteBtn);
    card.append(editBtn);
    card.append(posterImg);
    card.append(title);
    card.append(director);
    card.append(year);
    card.append(status);
    movieList.append(card);
  });
}

function searchFilterFunc(searchQuery) {
  let searchedMovie = watchedMovies.filter((movie) => {
    return movie.movie_title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  renderMovie(searchedMovie);
}

function selectFilterFunc(selectedFilter) {
  if (selectedFilter === "all") {
    renderMovie(watchedMovies);
    return;
  }
  let filteredMovies = watchedMovies.filter((movie) => {
    if (selectedFilter === "watched") {
      return movie.movie_watched === true;
    } else if (selectedFilter === "unwatched") {
      return movie.movie_watched === false;
    } else if (selectedFilter === "favorite") {
      return movie.movie_favorite === true;
    }
  });

  renderMovie(filteredMovies);
}

function saveTOLocalStorage() {
  localStorage.setItem("movies-list", JSON.stringify(watchedMovies));
}
function loadFromLocalStorage() {
  watchedMovies = localStorage.getItem("movies-list")
    ? JSON.parse(localStorage.getItem("movies-list"))
    : [];
  renderMovie(watchedMovies);
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

  let uniqueMovieId = `${movie.movie_title}_${movie.movie_year}_${Date.now()}`;
  movie.movie_id = uniqueMovieId;

  watchedMovies.push(movie);
  saveTOLocalStorage();
  popup.classList.remove("active");
  addMovieForm.reset();
  console.log(watchedMovies);
  renderMovie(watchedMovies);
});

searchMovie.addEventListener("input", function () {
  let searchQuery = searchMovie.value.trim();

  searchFilterFunc(searchQuery);
});

selectFilter.addEventListener("change", function () {
  let selectedFilter = selectFilter.value;

  selectFilterFunc(selectedFilter);
});

clearListBtn.addEventListener("click", function () {
  movieList.innerHTML = "";
  watchedMovies.length = 0;
  saveTOLocalStorage();
});

movieList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    watchedMovies = watchedMovies.filter((movie) => {
      return movie.movie_id !== e.target.id;
    });
    saveTOLocalStorage();
    renderMovie(watchedMovies);
  }
});
