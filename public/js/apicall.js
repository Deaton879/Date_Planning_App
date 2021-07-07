//const { mapFinderOptions } = require("sequelize/types/lib/utils");

const App = async () => {
  zipCode = document.getElementById("zipCode").value;
  if (zipCode == "") {
    zipCode = 20001;
  }
  types = document.getElementById("type").value;
  const apiURL = `/getGooglePlaces/${zipCode}/${types}`;
  let count = 1;

  try {
    //reaches out to local api to return
    const response = await fetch(apiURL);
    const json = await response.json();
    json.results.forEach((element) => {
      addPlaceToHTML(element, count);
      count++;
    });
  } catch (error) {
    console.log("Something went wrong" + error);
  }
};

//Creates path to photos
const getPhotos = async (photo_reference) => {
  const photoURL = `/getPlacesPhotos/${photo_reference}`;
  try {
    //reaches out to local api to return
    const response = await fetch(photoURL);
    const json = await response.json();
    return json;
  } catch (err) {
    console.log(err);
  }
};

//converts the string to HTML for site to display
var stringToHTML = function (str) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, "text/html");
  return doc.body;
};

const addPlaceToHTML = async (element, id) => {
  //get photos image
  const myPlaces = document.getElementById("main");
  let place = null;
  let myimage = "";
  try {
    myimage = await getPhotos(element.photos[0].photo_reference);
    //console.log(element.photos[0].photo_reference);
  } catch (err) {
    console.log(err);
  }
  //add place to products page
  place = await obj(element, myimage, id);
  console.log(myPlaces, place);
  myPlaces.append(stringToHTML(place));
};

const obj = (
  { place_id, name, formatted_address, rating, open_now, types },
  image,
  id
) => {
  console.log("image:", image);
  let urls = image.replace("https://lh3.googleusercontent.com/p/", "");
  let url2 = urls.replace("=s1600-w400", "");

  console.log("url", url2);

  return `<div class="grid">
        <article class="card product-item">
            <header class="card__header">
                <h1 class="product__title">${name}</h1>
            </header>
            <div class="card__image">
                <img src=${image} alt="image of ${name}">
            </div>
            <div class="card__content">
                <h2 class="product__price">$
                        ${types}
                </h2>
                    <p class="product__description">
                    </p>
            </div>
            <div class="card__actions">
                <a href="/product-detail/${place_id}/${url2}" class="btn">Details</a>
                <a href="" id="${id}" class="fav-button btn">Add to Favorites</a>
            </div>
        </article>
    </div>`;
};
//we should add get current location with this one.
//Change this to change the city we are working with.
const loadPlaces = () => {
  document.getElementById("main").innerHTML = "";
  App();
};

loadPlaces();

//Watches for changes
document.getElementById("reload").addEventListener("click", loadPlaces);
function btnclick(e) {
  // comment and uncomment e.preventDefault to see the differences
  e.preventDefault();
}
