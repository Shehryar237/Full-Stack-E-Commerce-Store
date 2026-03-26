const User = require('../models/user');
const jwt = require('jsonwebtoken');


exports.signup = async(req,res)=>{
    try{
        const{password, email,name} = req.body;
        if(!email||!password){
            return res.status(400).json({success:false,
                message:'Email and password are required'})
        }

        const normalisedEmail = String(email).trim().toLowerCase();

        if(await User.existsByEmail(normalisedEmail )){
            return res.status(400).json({success:false,
                message:'Email already in use'
            })
        }

        //password hashed in model via bcrypt
        const user = new User(password, name||null, 'user', normalisedEmail)
        await user.saveUser();

        return res.status(201).json({
            success: true,
            message: 'User created',
            user: {id: user.id, email: user.email, name: user.name, role: user.role }
        });

    }
    catch(err){
        console.error('Login error:',err);
        return res.status(500).json({success:false, message: 'Internal server error'});
    }
}

exports.logout = (req, res) => {
    if (!req.session) {
        return res.status(200).json({success:true, message:'No user logged in'});
    }
    req.session.destroy(err =>{
        if (err) {
            console.error('Logout error', err);
            return res.status(500).json({ success:false, message: 'Logout failed'});
        }
            res.clearCookie('connect.sid'); // default cookie name
            return res.json({success:true, message: 'Logged out' });
    });
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        const userRow = await User.findByEmail(email.trim());
        if (!userRow) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const ok = await User.verifyPassword(password, userRow.password_hash);
        if (!ok) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // generate jwt
        const token = jwt.sign(
            {id: userRow.id, email: userRow.email, role: userRow.role },process.env.JWT_SECRET, {expiresIn: '7d'}
        );

        return res.json({
            success: true,
            message: 'Login successful',
            token, // send token to frontend
            user: { id: userRow.id, email: userRow.email, name: userRow.name, role: userRow.role }
        });
    } 
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

{/*exports.postLogin = async(req,res,next)=>{
    try{
        const {username, password} = req.body;
        const validUsername = 'admin';
        const validPassword = '12345';

        if (username === validUsername && password === validPassword) {
            const fakeToken = 'abcd1234'; 

            return res.json({
                success: true,
                message: 'Login successful',
                token: fakeToken, // frontend will store this
                username
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
        });
    }
    }

    catch(err){
            return res.status(400).json({
            success: false,
            message: 'Something went wrong',
            error: err.message
        });
    }
}*/}