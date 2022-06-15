const express = require('express');
const profileRoute = express.Router();
const cors = require('cors');
const auth = require('../middleware/auth');
const User = require('../model/Client');
const Profile = require('../model/Profile');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
profileRoute.use(express.json());
profileRoute.use(cors());

profileRoute.get('/getProfile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error' });
    }
})

profileRoute.post('/', auth, async (req, res) => {
    const { name, id } = req.body;
    if (name == '') {
        res.status(400).json({ errors: [{ msg: 'Name is required' }] })
    }
    else {
        try {
            const user = await User.findOneAndUpdate({ _id: id }, { name: name }, { new: true });
            const token = jwt.sign({ user }, 'salmankhan', { expiresIn: '7d' });
            res.json({ token, msg: 'Name Updated Successfully' });
        } catch (error) {
            res.status(500).json({ msg: 'Server Error' });
        }
    }
});
profileRoute.post('/updatePassword', [
    body('currentPassword').not().isEmpty().withMessage('Current Password is required'),
    body('newPassword').not().isEmpty().withMessage('New Password is required'),
], auth, async (req, res) => {
    const { currentPassword, newPassword, userId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    else {
        const user = await User.findOne({ _id: userId });
        if (user) {
            const matched = await bcrypt.compare(currentPassword, user.password);
            if (!matched) {
                return res.status(400).json({ errors: [{ msg: 'Current Password is incorrect' }] });
            }
            else {
                try {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(newPassword, salt);
                    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { password: hashedPassword }, { new: true });
                    res.json({ msg: 'Password Updated Successfully' });
                } catch (error) {
                    return res.status(500).json({ errors })
                }
            }
        }
    }
})

// create Profile 
profileRoute.post('/createProfile/:id',auth, async (req, res) => {
    const { _id,company, website, location, status, githubusername, bio, twitter, facebook, linkedin, youtube, instagram } = req.body;
    console.log(req.body);
    try {
        const profile = await Profile.find({ userId: _id});
        if (profile.length > 0) {
            return res.status(400).json({ msg: 'Profile already created' });
        }
        else {
            const newProfile = new Profile({
                userId: _id,
                company,
                website,
                location,
                status,
                githubusername,
                bio,
                twitter,
                facebook,
                linkedin,
                youtube,
                instagram
            });
            await newProfile.save();
            res.status(200).json({ msg: 'Profile Created Successfully' });
        }

    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
})




module.exports = profileRoute;