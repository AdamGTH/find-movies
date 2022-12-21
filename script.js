const apiKey = "9f0df9ae1aa16907009fd5a1afaa2958";
const language = "pl";
let tables = [];

document
  .getElementById("writeEndFind")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // nie wywołuje się to co jest w action

    const title = event.target.title.value;

    transformData(title);
  });

function transformData(title) {
  let position = title.search("ID:");
  let id = "";
  if (position > 0) {
    id = title.substr(position + 3);
    fetch_for_id(id);
  } else {
    fetch_for_title(title);
  }
}

function fetch_for_id(id) {
  fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=9f0df9ae1aa16907009fd5a1afaa2958&language=pl`
  )
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error(
          "Looks like there was a problem. Status Code: " + response.status
        );
      }

      return response.json();
    })
    .then(showMovie)

    .catch(function (error) {
      console.log(error);
    });
}

function fetch_for_title(title) {
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=9f0df9ae1aa16907009fd5a1afaa2958&language=pl&query=${title}&page=1&include_adult=false`
  )
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error(
          "Looks like there was a problem. Status Code: " + response.status
        );
      }

      return response.json();
    })

    .then(update)

    .catch(function (error) {
      console.log(error);
    });
}

function update(data) {
  if (data.results.length > 0) {
    if (data.results.length > 1) showFindedMovies(data);
    else fetch_for_id(data.results[0].id);
  } else {
    clearScreen();
    document.querySelector(".titles").innerHTML =
      "BRAK FILMU W BAZIE, SPRÓBUJ JESZCZE RAZ !";
  }
}

function showMovie(data) {
  clearScreen();
  document.querySelector(".titles").innerHTML = "Tytuł: " + data.title;
  document.querySelector(".info").innerHTML =
    "<b>" +
    "Data wydania: " +
    data.release_date +
    "</br>" +
    "Średnia ocena: " +
    data.vote_average +
    "</b>" +
    numberOfStars(data.vote_average) +
    "</br>" +
    "<b>" +
    "Liczba głosujących: " +
    data.vote_count +
    "</br>" +
    "Kraj: " +
    data.production_countries[0].name +
    "</br>" +
    "Oryginalny tytuł: " +
    data.original_title +
    "</br>" +
    "Rodzaj: " +
    data.genres[0].name +
    "</br>" +
    "Budżet: " +
    data.budget +
    "</b>";

  document.querySelector(".overview").innerHTML = data.overview;

  image = document.querySelector(".image");
  if (data.poster_path != null) {
    image.innerHTML =
      `<img src = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.poster_path}'/>` +
      `<img src = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.backdrop_path}'/>`;
  }
}

function showFindedMovies(data) {
  let html = "";
  for (i = 0; i < data.results.length; i++) {
    html +=
      "<option value =" +
      `"${data.results[i].title}, rok: ${data.results[i].release_date}, ID:${data.results[i].id}">` +
      "</option>";
  }
  document.getElementById("browser").innerHTML = html;
}

function clearScreen() {
  document.querySelector(".titles").innerHTML = "";
  document.querySelector(".info").innerHTML = "";
  document.querySelector(".overview").innerHTML = "";
  document.querySelector(".image").innerHTML = "";
}

function numberOfStars(checkStar) {
  let count = 0;
  let html = " ";
  for (x = 0; x < 10; x++) {
    count += 1;
    if (count <= checkStar) html += "<span class='fa fa-star checked'></span>";
    else html += "<span class='fa fa-star'></span>";
  }

  return html;
}
