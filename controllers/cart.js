//LOGIC OF WHAT HAPPENS
//DEV: MODEL -> CONTROLLER -> ROUTE
//CALL: ROUTE -> CONTROLLER -> ROUTE
const cartService = require('../services/cartService');

exports.postAddToCart = async (req, res, next) => {
  try {
    //We got this from decoding token in auth middleware, the token we have in zustand that frontend sent with req
    const userId = req.user?.id; 
    const {id, title, price, stock } = req.body;

    //-------------IMPORTANT------------
    //--NOTE the id here is PRODUCT id not UserID, userID came with the TOKEN that we decoded, it has been defined above--
    const updatedCart = await cartService.addItem(userId, id, title, price, stock);
    res.status(201).json({
      cart: updatedCart,
      message: "Added successfully to cart",
    });
  } 
  catch (err) {
    next(err);
  }
};

exports.getCart = async(req,res,next)=>{
  try{
    const userId = req.user?.id;
    const cart = await cartService.fetchCart(userId);
    res.json(cart);
  }
  catch(err){
    next(err);
  }
}

exports.updateCart = async(req,res,next)=>{
    try{
        const userId = req.user?.id; 
        const cart = req.body;
        const updatedCart = await cartService.updateCart(userId, cart);
        res.json(updatedCart);
    }
    catch(err){
        next(err);
    }
}

exports.delCartItem = async(req,res,next)=>{
  try{
    const userId = req.user?.id;
    const {id} = req.body;
    const updatedCart = await cartService.delCartItem(userId,id) 
    res.json(updatedCart);
  }
  catch(err){
    next(err)
  }
}

exports.mergeCart = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const localCart = req.body;
    const merged = await cartService.mergeCart(userId, localCart);
    res.json(merged);
  } catch (err) {
    next(err);
  }
};

// checkout simulated)
exports.checkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const paymentInfo = req.body.payment || {};
    const receipt = await cartService.checkout(userId, paymentInfo);
    res.json(receipt);
  } catch (err) {
    next(err);
  }
}