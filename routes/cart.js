//WHAT HAPPENS WHEN WHAT URL
//DEV: MODEL -> CONTROLLER -> ROUTE
//CALL: ROUTE -> CONTROLLER -> ROUTE
//ROUTER USED IN APP.JS
const express = require('express');
const cartController = require('../controllers/cart');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();
// /products->
router.post('/addItem', authMiddleware, cartController.postAddToCart);
router.post('/updateCart',authMiddleware,  cartController.updateCart);
router.get('/', authMiddleware, cartController.getCart);
router.post('/deleteCartItem', authMiddleware, cartController.delCartItem)
router.post('/merge', authMiddleware, cartController.mergeCart)
router.post('/checkout', authMiddleware, cartController.checkout)

module.exports = router;