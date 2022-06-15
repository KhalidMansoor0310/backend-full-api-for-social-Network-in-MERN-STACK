const express = require('express');
const route = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../model/Client')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const cors = require('cors')
route.use(cors())


route.post('/register', [
    body('name').not().isEmpty().trim().escape().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Email is required'),
    body('password').isLength({ min: 6 }).trim().withMessage('Password must be at least 6 characters long'),

], async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const { name, email, password} = req.body;
        console.log(req.body)
        try {
            const emailExists = await User.findOne({ email });
            if (!emailExists) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const user = await User.create({
                    name,
                    email,
                    password: hashedPassword,
                    
                });
                const token = jwt.sign({ user }, 'salmankhan', { expiresIn: '7d' });
                return res.status(201).json({ msg: 'User created successfully', token});
            }
            else {
                return res.status(401).json({ errors: [{ msg: 'Email already exists' }] });
            }

        } catch (error) {
            console.log(error.message)
            return res.status(500).json("Internel server error")
        }
    }
    else {
        return res.status(400).json({ errors: errors.array() });
    }
})




route.post('/login',[
    body('email').isEmail().normalizeEmail().withMessage('Email is required'),
    body('password').isLength({ min: 6 }).trim().withMessage('Password must be at least 6 characters long')
],async(req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
        const token = jwt.sign({ user }, 'salmankhan', { expiresIn: '7d' });
        return res.status(200).json({ msg: 'User logged in successfully', user, token });
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json("Internel server error")
        
    }


})

module.exports = route;