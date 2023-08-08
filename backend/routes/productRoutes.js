import express from "express";
import {getProducts, getProductById, createProduct, updateProduct, 
  deleteProduct, createProductReview, getTopProducts} from "../controllers/productController.js";
import {protect, admin} from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/top", getTopProducts); //should be above "/:id" otherwise it will take "top" as id
router.route("/:id").get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.route("/:id/reviews").post(protect, createProductReview);

export default router;