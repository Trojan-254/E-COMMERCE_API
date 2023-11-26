const router = require("express").Router();
const User = require('../models/User');
const CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');


//GPT CODE

// router.post('/register', async (req, res) => {
//     const { username, email, password } = req.body;

//     try{
//         // Check if username is already taken
//         const existingUser = await User.findOne({ username });
//         if (existingUser){
//             return res.status(400).json({ message: "Username already taken "});
//         }

//         // Hash password using crypto-js
//         const hashedPassword = crypto.SHA256(password).toString(crypto.enc.Base64);

//         // Create new user and save in the database
//         const newUser = new User({ username, email, password: hashedPassword});
//         await newUser.save();

//         res.status(201).json({ message: "Registration successfull"}, newUser);
        

//     } catch (error) {
//         res.status(500).json({ message: "Registration failed "});
//     }
// });

// REGISTER USER
router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        console.log('Successful user registration..')
    }catch(err){
        res.status(500).json(err);
    }
   
});

// LOGIN USER

router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong Credentials")
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        Originalpassword !== req.body.password && res.status(401).json("Wrong Credentials ");
        const accessToken = jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin
        },
         process.env.JWT_SEC,
         {expiresIn:"7d"}
         );
        const { password, ...others } = user._doc;
        res.status(200).json({...others, accessToken});
        console.log('Succesfull user login')
    } catch (err) {
        res.status(500).json(err);
    }
});

// LOGIN GPT

// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     try{
//         // Find user by username
//         const user = await User.findOne({ username });

//         if(!user){
//             return res.status(401).json({ message: 'Authentication failed'});
//         }

//         // Verify password

//         const hashedPassword = crypto.SHA256(password).toString(crypto.enc.Base64);

//         if (user.password === hashedPassword){
//             // Generate and send a JWT token upon succesfull authentication

//             const token = jwt.sign({ username }, JWT_SEC, { expiresIn: '1h' });
//             res.json({ message: 'Authentication successfull', token});

//         } else {
//             res.status(500).json({ message: 'Authentication failed '});
//         }
//     } catch {
//         res.status(500).json({ message: 'Authentication failed' });
//     }
// });

module.exports = router;