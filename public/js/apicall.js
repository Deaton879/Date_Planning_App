const App = async (zipCode, types = "park+museum+food") => {
  const myPlaces = document.getElementById("main");

  const obj = (
    { name, open_now },
    image = "https://lh4.googleusercontent.com/-1wzlVdxiW14/USSFZnhNqxI/AAAAAAAABGw/YpdANqaoGh4/s1600-w400/Google%2BSydney"
  ) =>
    `<div class="product-container">
    <h3 class="title">${title}</h3>
    <image class="image_${title}" src="${image}" alt="photo of i${title}">
    </div>
    `;
  //const image = ({ photo_reference }) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=AIzaSyBksN0SF4_mvexLxby3u1O8It8WplxbU_w`;
  const apiURL = `/getGooglePlaces/${zipCode}/${types}`;
  console.log(apiURL);
  try {
    //reaches out to local api to return
    const response = await fetch(apiURL);
    const json = await response.json();
    console.log(JSON.stringify(json));
    json.forEach((element) => {
      //get photos image
      //const dispimage = image(el);
      const place = obj(a, image);
      //append place to products page
      myPlaces.append(place);
    });
  } catch (error) {
    console.log("Something went wrong" + error);
  }
};

App(84302);
