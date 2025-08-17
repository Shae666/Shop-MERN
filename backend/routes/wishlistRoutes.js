const express = require('express');
const router = express.Router();

// Get all wishlist items
router.get('/', async (req, res) => {
  try {
    const items = await Wishlist.find();
    res.json({ wishlist: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product to wishlist
router.post('/add', async (req, res) => {
  try {
    const { product } = req.body;

    // check if already exists
    const exists = await Wishlist.findOne({ productId: product.productId });
    if (exists) {
      return res.json({ wishlist: await Wishlist.find() });
    }

    const newItem = new Wishlist({ ...product });
    await newItem.save();

    res.json({ wishlist: await Wishlist.find() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove product from wishlist
router.post('/remove', async (req, res) => {
  try {
    const { productId } = req.body;
    await Wishlist.deleteOne({ productId });
    res.json({ wishlist: await Wishlist.find() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
