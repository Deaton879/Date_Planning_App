const app = async () => {
  zipCode = document.getElementById("zipCode").value;
  if (zipCode == "") {
    zipCode = 20001;
  }
  type = document.getElementById("type").value;
  const apiURL = `/getGooglePlaces/${zipCode}/${type}`;
  let count = 1;
  console.log(apiURL);

  try {
    //reaches out to local api to return
    const response = await fetch(apiURL);
    const json = await response.json();
    console.log(json);
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
  //console.log(myPlaces, place);
  // myPlaces.append(stringToHTML(place));
};

const testFunc = (event) => {
  fetch('/add-to-favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      id: 1
    })
  });
}

const obj = (
  { place_id, name, formatted_address, rating, open_now, types },
  image,
  id
) => {
  //console.log("image:", image);
  let urls = image.replace("https://lh3.googleusercontent.com/p/", "");
  let url2 = urls.replace("=s1600-w400", "");

  const gridDiv = document.createElement('div');
  gridDiv.class = 'grid';

  const article = document.createElement('article');
  article.class = 'card product-item';

  const header = document.createElement('header');
  header.class = 'card__header';

  const productTitle = document.createElement('h2');
  productTitle.class = 'product__title';
  productTitle.innerHTML = name;

  header.appendChild(productTitle);
  article.appendChild(header);

  const cardImageDiv = document.createElement('div');
  cardImageDiv.class = 'card__image';

  const cardImage = document.createElement('img');
  cardImage.src = image;
  cardImage.alt = `Image of ${name}`;

  cardImageDiv.appendChild(cardImage);
  article.appendChild(cardImageDiv);

  const cardContent = document.createElement('div');
  cardContent.class = 'card__content';

  const productPrice = document.createElement('p');
  productPrice.class = 'product__price';

  const productDesc = document.createElement('p');
  productDesc.class = 'product__description';

  cardContent.appendChild(productPrice);
  cardContent.appendChild(productDesc);
  article.appendChild(cardContent);

  const cardActions = document.createElement('div');
  cardActions.class = 'card__actions';

  const productDetailsLink = document.createElement('a');
  productDetailsLink.href = `/product-detail/${place_id}/${url2}`;
  productDetailsLink.class = 'btn';
  productDetailsLink.innerHTML = 'Details';

  //  const btnAddToFavorites = document.createElement('button');
  const btnAddToFavorites = document.createElement('button');
  btnAddToFavorites.id = id;
  btnAddToFavorites.class = 'fav-button btn';
  btnAddToFavorites.addEventListener('click', testFunc);
  btnAddToFavorites.innerHTML = 'Add to Favorites';

  cardActions.appendChild(productDetailsLink);
  cardActions.appendChild(btnAddToFavorites);
  article.appendChild(cardActions);

  gridDiv.appendChild(article);

  document.getElementById('main').appendChild(gridDiv);
  // return gridDiv;

  //console.log("url", url2);
  // return `<div class="grid">
  //       <article class="card product-item">
  //           <header class="card__header">
  //               <h2 class="product__title">${name}</h2>
  //           </header>
  //           <div class="card__image">
  //               <img src=${image} alt="image of ${name}">
  //           </div>
  //           <div class="card__content">
  //               <p class="product__price">
  //                       ${types[0]}
  //               </p>
  //                   <p class="product__description">
  //                   </p>
  //           </div>
  //           <div class="card__actions">
  //               <a href="/product-detail/${place_id}/${url2}" class="btn">Details</a>
  //               ` + btnAddToFavorites + `
  //           </div>
  //       </article>
  //   </div>`;
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
