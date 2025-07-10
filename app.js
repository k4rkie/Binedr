const addNewMovie = document.getElementById("addNewMovie");
const searchMovie = document.getElementById("search-movie");
const selectFilter = document.getElementById("select-filter");
const clearListBtn = document.getElementById("clear-list");

selectFilter.value = "all";

let total_movies_count = document.getElementById("total-movies-count");
let watched_movies_count = document.getElementById("watched-movies-count");
let unwatched_movies_count = document.getElementById("unwatched-movies-count");
let favorite_movies_count = document.getElementById("favorite-movies-count");

const movieList = document.querySelector(".movie-list");

const popup = document.querySelector(".popup-add-movie");
const popupClose = document.querySelector(".close-btn");

let movieTitle = document.getElementById("movie-title");
let poster = document.getElementById("poster");
const poster_preview = document.getElementById("poster-preview");
let movieDirector = document.getElementById("movie-director");
let movieYear = document.getElementById("release-year");

const watched = document.getElementById("watched");
const favorite = document.getElementById("favorite");

const addMovieForm = document.getElementById("add-movie");
const form_submit_btn = document.getElementById("form-submit-btn");

let isEditing = false;
let isAdding = false;
let editingMovieId = null;
const title_add_movie = document.getElementById("title-add-movie");
const title_edit_movie = document.getElementById("title-edit-movie");

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
    status.textContent = `${watchedStat.textContent} ${
      movie.movie_favorite ? `| ${favoriteStat.textContent}` : ""
    }`;

    card.append(deleteBtn);
    card.append(editBtn);
    card.append(posterImg);
    card.append(title);
    card.append(director);
    card.append(year);
    card.append(status);
    movieList.append(card);
  });
  statCounter(watchedMovies);
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
  statCounter(watchedMovies);
}
function statCounter(watchedMovies) {
  total_movies_count.textContent = `Total Movies: ${watchedMovies.length}`;

  let w_m_c = 0;
  for (movie of watchedMovies) {
    if (movie.movie_watched) {
      w_m_c++;
    }
  }
  watched_movies_count.textContent = `Watched: ${w_m_c}`;
  console.log(watchedMovies.length);
  console.log(w_m_c);

  unwatched_movies_count.textContent = `Unwatched: ${
    watchedMovies.length - w_m_c
  }`;

  let f_m_c = 0;
  for (movie of watchedMovies) {
    if (movie.movie_favorite) {
      f_m_c++;
    }
  }
  favorite_movies_count.textContent = `Favorite: ${f_m_c}`;
}
addNewMovie.addEventListener("click", function () {
  isAdding = true;
  if (isAdding) {
    title_add_movie.classList.add("show-title");
    popup.classList.add("active");
  }
});

popupClose.addEventListener("click", function () {
  title_add_movie.classList.remove("show-title");
  title_edit_movie.classList.remove("show-title");
  movieTitle.value = "";
  poster.value = "";
  poster_preview.src = "";
  movieDirector.value = "";
  movieYear.value = "";
  watched.checked = false;
  favorite.checked = false;
  popup.classList.remove("active");
  if (isEditing) {
    form_submit_btn.textContent = "Add Movie";
  }
  isAdding = false;
  isEditing = false;
});

addMovieForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (isEditing) {
    const editedMovieIndex = watchedMovies.findIndex(
      (movie) => movie.movie_id === editingMovieId
    );

    watchedMovies[editedMovieIndex].movie_title = movieTitle.value;
    watchedMovies[editedMovieIndex].movie_poster = poster.value;
    watchedMovies[editedMovieIndex].movie_director = movieDirector.value;
    watchedMovies[editedMovieIndex].movie_year = movieYear.value;
    if (watched.checked) {
      watchedMovies[editedMovieIndex].movie_watched = true;
    } else {
      watchedMovies[editedMovieIndex].movie_watched = false;
    }
    if (favorite.checked) {
      watchedMovies[editedMovieIndex].movie_favorite = true;
    } else {
      watchedMovies[editedMovieIndex].movie_favorite = false;
    }
    saveTOLocalStorage();
    renderMovie(watchedMovies);
    popup.classList.remove("active");
    addMovieForm.reset();
    editingMovieId = null;
    form_submit_btn.textContent = "Add Movie";
    isEditing = false;
    title_edit_movie.classList.remove("show-title");
    poster_preview.src = "";
    statCounter(watchedMovies);
    return;
  } else {
    let movie = {
      movie_title: `${movieTitle.value}`,
      movie_poster: `${poster.value}`,
      movie_director: `${movieDirector.value}`,
      movie_year: `${movieYear.value}`,
      movie_watched: watched.checked,
      movie_favorite: favorite.checked,
    };

    let uniqueMovieId = `${movie.movie_title}_${
      movie.movie_year
    }_${Date.now()}`;
    movie.movie_id = uniqueMovieId;

    watchedMovies.push(movie);
    saveTOLocalStorage();
    popup.classList.remove("active");
    addMovieForm.reset();
    renderMovie(watchedMovies);
    title_add_movie.classList.remove("show-title");
    poster_preview.src = "";
    statCounter(watchedMovies);
    return;
  }
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
  statCounter(watchedMovies);
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

movieList.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-btn")) {
    isEditing = true;
    if (isEditing) {
      title_edit_movie.classList.add("show-title");
      form_submit_btn.textContent = "Save";

      popup.classList.add("active");

      editingMovieId = e.target.id;
      const movieToEdit = watchedMovies.find((movie) => {
        return movie.movie_id === editingMovieId;
      });

      movieTitle.value = movieToEdit.movie_title;
      poster.value = movieToEdit.movie_poster;
      poster_preview.src = poster.value;
      movieDirector.value = movieToEdit.movie_director;
      movieYear.value = movieToEdit.movie_year;

      if (movieToEdit.movie_watched) {
        watched.checked = movieToEdit.movie_watched;
      }
      if (movieToEdit.movie_favorite) {
        favorite.checked = movieToEdit.movie_favorite;
      }
    }
  }
});
poster.addEventListener("input", () => {
  poster_preview.src = poster.value;
});
