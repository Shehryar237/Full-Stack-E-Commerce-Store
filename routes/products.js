//WHAT HAPPENS WHEN WHAT URL
//DEV: MODEL -> CONTROLLER -> ROUTE
//CALL: ROUTE -> CONTROLLER -> ROUTE
//ROUTER USED IN APP.JS
const express = require('express');
const productsController = require('../controllers/products');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload'); 

const router = express.Router();
// /products->
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);

//router.post('/', adminMiddleware, productsController.postAddProduct);
router.post(
  '/',
  upload.single('image'), // handles both file+ fields
  authMiddleware,
  adminMiddleware,
  productsController.postAddProduct
);

router.post('/admin/deleteProduct',authMiddleware,adminMiddleware, productsController.delProduct);
///router.post('/admin/updateProduct',authMiddleware,adminMiddleware,productsController.updateProduct)
router.put(
  '/:id',
  upload.single('image'),    // multer parses multipart; fields -> req.body, file -> req.file
  authMiddleware,
  adminMiddleware,
  productsController.putUpdateProduct
);

module.exports = router;