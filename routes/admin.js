const path = require("path");

const express = require("express");
const { body } = require("express-validator/check");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// post favorite
router.post("/postAddProduct", isAuth, adminController.postAddProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
