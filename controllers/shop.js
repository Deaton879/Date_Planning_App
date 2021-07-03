require("dotenv").config();
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const request = require('request');
const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  let placeId = req.params.place_id
  let imageUrl = req.params.image;
  console.log('req.params.place_id:', placeId);
  console.log('req.params.imageUrl:', imageUrl);
  request(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyBksN0SF4_mvexLxby3u1O8It8WplxbU_w`,
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let parsedBody = JSON.parse(body);
        console.log('parsedBody', parsedBody);
        let result = parsedBody.result;
        let phoneNo = result?.formatted_phone_number || '';
        let name = result?.name || '';
        let rating = result?.rating || '';
        let types = result?.types || [];
        console.log('result:', result);

        res.render("shop/product-detail", {
          path: "/product",
          pageTitle: "Your Cart",
          products: [],
          product: {
            name: name,
            phone: phoneNo,
            photo: result?.photos[0]?.html_attributions[0] || '',
            imageUrl: imageUrl
          }
        });
      }
    });

  // console.log('req.params', req.params);
  // const prodId = req.params.productId;

  // res.render("shop/product-detail", {
  //   path: "/product",
  //   pageTitle: "Your Cart",
  //   products: [],
  //   product: {
  //     name: 0,
  //     description: ''
  //   }
  // });

};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//This takes a zip code and type of location gets the results form the places api and returns the json
exports.getGooglePlaces = async (req, res, next) => {
  let json = "";
  let types = req.params.types;
  let zipCode = req.params.zipCode;

  //if values are empty set them to a default value
  if (req.params.types != "") {
    types = "restraunt+museum+park";
  }
  if ((req.params.zipCode = "")) {
    zipCode = "84302";
  }

  const apiURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${types}+in+${zipCode}&key=${process.env.API_KEY}`;
  //console.log(apiURL);
  try {
    const fetchResponse = await fetch(apiURL);
    json = await fetchResponse.json();
  } catch (error) {
    console.log(
      "Can’t access " + apiURL + " response. Blocked by browser?" + error
    );
  }
  //console.log(JSON.stringify(json));
  res.json(json);
};

//This takes a photo ref and returns the photo path from google photos to be used on website.
exports.getPlacesPhotos = async (req, res, next) => {
  let photo_reference = req.params.photo_reference;
  let myimage =
    "{image: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png}";

  //if values are empty set them to a default value
  if (req.params.photo_reference == "") {
    return res.json(myimage);
  }
  const imageURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${process.env.API_KEY}`;

  try {
    const photoresponse = await fetch(imageURL);
    myimage = await photoresponse;
    // console.log(myimage.url);
  } catch (err) {
    console.log(err);
    throw error;
  }

  res.json(`${myimage.url}`);
};
