const App = async (zipCode, types = "park+museum+food") => {
  const obj = (
    { name, open_now },
    //Temporary default photo
    image = "https://lh4.googleusercontent.com/-1wzlVdxiW14/USSFZnhNqxI/AAAAAAAABGw/YpdANqaoGh4/s1600-w400/Google%2BSydney"
  ) =>
    `<div class="product-container">
    <h3 class="title">${name}</h3>
    <image class="image_${name}" src="${image}" alt="photo of i${name}">
    </div>
    `;
  //const image = ({ photo_reference }) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=AIzaSyBksN0SF4_mvexLxby3u1O8It8WplxbU_w`;
  const apiURL = `/getGooglePlaces/${zipCode}/${types}`;
  console.log(apiURL);
  try {
    //reaches out to local api to return
    const response = await fetch(apiURL);
    const json = await response.json();
    console.log(json);

    // This is not working at this time.
    json.results.forEach((element) => {
      const myPlaces = document.getElementById("main");
      //get photos image
      //const dispimage = image(el);
      const place = obj(element);
      //add place to products page

      myPlaces.append(stringToHTML(place));
    });
  } catch (error) {
    console.log("Something went wrong" + error);
  }
};

var stringToHTML = function (str) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, "text/html");
  return doc.body;
};

//we should add get current location with this one.
//Change this to change the city we are working with.
App(84321);
