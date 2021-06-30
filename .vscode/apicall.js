const App = async (zipCode, types = "park+museum+food") => {
  const myPlaces = document.getElementById("main");

  const obj = ({ name, open_now }, image) =>
    `<div class="product-container">
    <h3 class="title">${title}</h3>
    <image class="image_${title}" src="${image}" alt="photo of i${title}">
    </div>
    `;

  //const image = ({ photo_reference }) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=AIzaSyBksN0SF4_mvexLxby3u1O8It8WplxbU_w`;
  const apiURL = `/getGooglePlaces`;
  try {
    const response = await fetch(apiURL);
    console.log("made it");
    const json = await response.json();
    console.log("got here");
  } catch (error) {
    console.log("Something went wrong" + error);
  }

  //for each get items
  // contents.forEach((el) => {
  //   //get photos image
  //   const dispimage = image(el);
  //   const place = obj(a, image);
  //   //append place to products page
  //   myPlaces.append(place);
  // })
};

//App(84302);
