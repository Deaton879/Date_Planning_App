const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/", shopController.postProducts);

router.get("/places", shopController.getProducts);
router.post("/places", shopController.postProducts);
router.get("/places/:zipCode/:types", shopController.getProducts);

router.get("/product-detail", shopController.getProduct);
router.get("/product-detail/:place_id/:image", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.get("/getGooglePlaces", shopController.getGooglePlaces);
router.get("/getGooglePlaces/:zipCode/:types", shopController.getGooglePlaces);

router.get("/getPlacesPhotos", shopController.getPlacesPhotos);
router.get("/getPlacesPhotos/:photo_reference", shopController.getPlacesPhotos);
module.exports = router;
