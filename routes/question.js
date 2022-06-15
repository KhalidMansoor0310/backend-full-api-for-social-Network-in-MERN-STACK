const express= require('express');
const questionRoute = express.Router();
const Question = require('../model/Question');
const cors = require('cors');
const auth = require('../middleware/auth');
const Answer = require('../model/Answer');


questionRoute.use(cors());
questionRoute.use(express.json());

questionRoute.get('/allquestions', async (req, res) => {
    try {
        const questions = await Question.find({}).sort({ createdAt: -1 });
        res.status(200).json({ questions });
    } catch (error) {
        res.status(400).send(error);
    }
});
questionRoute.get('/my_questions/:id', async (req, res) => {
    try {
        const questions = await Question.find({ userId: req.params.id }).sort({ createdAt: -1 });
        return res.status(200).json({ questions });
    } catch (error) {
        return res.status(500).json({ error: error, msg: error.message });
    }
})
questionRoute.post('/create_question', auth, async (req, res) => {
    const { title, description, _id, author,category } = req.body;
    console.log(req.body);
    try {
        const question = await Question.create({
            title,
            description,
            userId: _id,
            author: author,
            category:category
        });
        return res.status(200).json({ question , msg: 'Question Created Successfully'});

        
    } catch (error) {
        return res.status(500).json({ error: error.message, msg: error.message });
    }
})

questionRoute.delete('/delete_question/:id', auth, async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        return res.status(200).json({ msg: 'Question Deleted Successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message, msg: error.message });
    }
})

questionRoute.get('/details/:id', auth, async (req, res) => {
    try {
       const question = await Question.findOne({ _id: req.params.id });
    //    const comments = await Comment.find({ postId: req.params.id });
       res.status(200).json({ question });
    } catch (error) {
       res.status(400).json({ error });
    }
 });

 //comment route
questionRoute.post('/answer', auth, async (req, res) => {
    const { id, answer ,author} = req.body;
    // console.log(req.body);
    try {
       const response = await Answer.create({
          questionId: id,
          answer,
          name:author
        
       });
       console.log(response);
       return res.status(200).json({ msg: 'Your answer has been published', response });
    } catch (error) {
       return res.status(500).json({ errors: error, msg: error.message });
    }
 });
module.exports = questionRoute;