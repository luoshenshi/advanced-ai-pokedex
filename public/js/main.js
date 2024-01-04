let pokemonID = 1;
const input_search = document.getElementById("input_search");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const chooseFile = document.getElementById("choose-file");
const pokemon_number = document.querySelector(".pokemon_number");
const pokemon_name = document.querySelector(".pokemon_name");
const pokemon_image = document.querySelector(".pokemon_image");
const btn_choose_file = document.querySelector(".btn-choose-file");
const form = document.querySelector("form");

const abilities = document.querySelector(".abilities");
const types = document.querySelector(".types");
const category = document.querySelector(".category");
const height = document.querySelector(".height");
const weight = document.querySelector(".weight");
const genders = document.querySelector(".genders");
const legend = document.querySelector(".legend");
const weakness = document.querySelector(".weakness");
const evolution = document.querySelector(".evolution");

function showPokemon(res) {
  abilities.innerHTML = "";
  types.innerHTML = "";
  category.innerHTML = "";
  height.innerHTML = "";
  weight.innerHTML = "";
  genders.innerHTML = "";
  legend.innerHTML = "";
  weakness.innerHTML = "";
  evolution.innerHTML = "";

  pokemonID = res.ID;
  pokemon_image.src = res.pokemonPic;
  pokemon_name.innerText = res.name;
  pokemon_number.innerText = res.ID;
  for (i in res.abilities) {
    abilities.innerHTML += `<p>${res.abilities[i]}</p>`;
  }
  for (i in res.types) {
    types.innerHTML += `<p>${res.types[i]}</p>`;
  }
  category.innerHTML = `<p>${res.category}</p>`;
  height.innerHTML = `<p>${res.height}</p>`;
  weight.innerHTML = `<p>${res.weight}</p>`;
  genders.innerHTML = `<p>${res.genders}</p>`;
  legend.innerHTML = `<p>${res.isLegendary}</p>`;
  res.weakness.forEach((subElement) => {
    subElement.forEach((element) => {
      weakness.innerHTML += `<p>${element}</p>`;
    });
  });
  for (i in res.evolutionChain) {
    evolution.innerHTML += `<p>
        <img width="100" src="${res.evolutionPics[i]}"/>
        <br />
        ${res.evolutionChain[i].species_name}
        </p>`;
  }
}

window.onload = () => {
  fetch(`/pokemonInfo?nn=${pokemonID.toString()}`).then((json) => {
    json.json().then((res) => {
      showPokemon(res);
    });
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  fetch(`/pokemonInfo?nn=${input_search.value}`).then((json) => {
    json.json().then((res) => {
      showPokemon(res);
    });
  });
});

btn_choose_file.addEventListener("click", () => {
  chooseFile.click();
});

chooseFile.addEventListener("change", (e) => {
  if (!e.target.files) return;
  console.log("working...");
  const fileReader = new FileReader();
  const file = e.target.files[0]; // Get the selected file
  fileReader.readAsDataURL(file); // Read the selected file as a data URL
  fileReader.onload = () => {
    postReq(fileReader.result);
  };
});

async function postReq(dataURI) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let bodyContent = JSON.stringify({
    image: dataURI,
  });

  let response = await fetch("/predict", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });

  let data = await response.text();
  let pokemonName = decodeURIComponent(data.trim().replace(/"/g, "")); // Trim leading and trailing whitespace, decode URL, and remove double quotes
  fetch(`/pokemonInfo?nn=${pokemonName.trim()}`).then((json) => {
    json.json().then((res) => {
      showPokemon(res);
    });
  });
}

btnNext.addEventListener("click", function () {
  console.log("Loading...");
  if (pokemonID == 1010) pokemonID = 0;

  pokemonID++;
  fetch(`/pokemonInfo?nn=${pokemonID.toString()}`).then((json) => {
    json.json().then((res) => {
      showPokemon(res);
    });
  });
});

btnPrev.addEventListener("click", function () {
  console.log("Loading...");

  if (pokemonID == 1) pokemonID = 1011;

  pokemonID--;
  fetch(`/pokemonInfo?nn=${pokemonID.toString()}`).then((json) => {
    json.json().then((res) => {
      showPokemon(res);
    });
  });
});
