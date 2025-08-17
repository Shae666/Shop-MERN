const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route   POST /api/products
 * @desc    Add a new product
 */
router.post("/", async (req, res) => {
  try {
    const { name, price, image, description, category } = req.body;

    const newProduct = new Product({ name, price, image, description, category });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
