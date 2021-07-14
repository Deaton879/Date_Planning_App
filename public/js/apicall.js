let num = 0;

const app = async () => {
  zipCode = document.getElementById("zipCode").value;
  if (zipCode == "") {
    zipCode = prompt("Enter your zipcode")
  }
  type = document.getElementById("type").value;
  const apiURL = `/getGooglePlaces/${zipCode}/${type}`;
  let count = 1;
  //console.log(apiURL);

  try {
    //reaches out to local api to return
    const response = await fetch(apiURL);
    const json = await response.json();
    //console.log(json);
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

const addPlaceToHTML = async (element, id) => {
  //get photos image
  const myPlaces = document.getElementById("main");
  let place = null;
  let myimage = "";
  try {
    if (!element.photos[0].photo_reference) {
      myimage =
        "https://www.google.com/search?q=no+photo+image&client=safari&rls=en&tbm=isch&source=iu&ictx=1&fir=-QpL1I7u3zbiBM%252C029W-ajBtZqZzM%252C_&vet=1&usg=AI4_-kQ8QReliwzHObPiVc85vwlorLM91Q&sa=X&ved=2ahUKEwiMyuOpy9fxAhXVpZ4KHdlUD7YQ9QF6BAgIEAE#imgrc=-QpL1I7u3zbiBM";
    } else {
      myimage = await getPhotos(element.photos[0].photo_reference);
    }
    //console.log(element.photos[0].photo_reference);
  } catch (err) {
    console.log(err);
  }
  //add place to products page
  place = await obj(element, myimage, id);
<<<<<<< HEAD
  //console.log(myPlaces, place);
  myPlaces.append(stringToHTML(place));
=======

  myPlaces.append(stringToHTML(place));
  
>>>>>>> 1cd906f306780e95dd72b0b99dc3a5551637affe
};

const testFunc = (event) => {
  fetch("/add-to-favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      id: 1,
    }),
  });
};

const obj = (
  { place_id, name, formatted_address, rating, open_now, types },
  image,
  id
) => {
  //console.log("image:", image);
  let urls = image.replace("https://lh3.googleusercontent.com/p/", "");
  let url2 = urls.replace("=s1600-w400", "");

<<<<<<< HEAD
  console.log("url", url2);
  return `<div class="grid">
=======
  let passedId = `/product-detail/${place_id}/${url2}`;
  
  localStorage.setItem(`passedId${num}`, passedId);
  
  console.log(localStorage.getItem(`passedId${num}`))
  let result = `
    <div class="grid">
>>>>>>> 1cd906f306780e95dd72b0b99dc3a5551637affe
        <article class="card product-item">
            <header class="card__header">
                <h2 class="product__title">${name}</h2>
            </header>
            <div class="card__image">
                <img src=${image} alt="image of ${name}">
            </div>
            <div class="card__content">
                <p class="product__price">
                        ${types[0]}
                </p>
                    <p class="product__description">
                    </p>
            </div>
            <div class="card__actions">
<<<<<<< HEAD
                <a href="/product-detail/${place_id}/${url2}" class="btn">Details</a>
              </div>
        </article>
    </div>`;
=======
                <a href="${passedId}" class="btn" id="passedId${num}" onclick="saveId(this.id)">Details</a>
                <input type="hidden" value="passedId${num}">
            </div>
        </article>
    </div>`;
  num++;
  return result;
>>>>>>> 1cd906f306780e95dd72b0b99dc3a5551637affe
};

//converts the string to HTML for site to display
var stringToHTML = function (str) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, "text/html");
  return doc.body;
};

//we should add get current location with this one.
//Change this to change the city we are working with.
const loadPlaces = () => {
  document.getElementById("main").innerHTML = "";
  app();
};

//After document loads get data should only load on first run home -> places.
window.onload = function () {
  app();
};

//Watches for changes
document.getElementById("reload").addEventListener("click", function (event) {
  event.preventDefault();
  loadPlaces();
});
