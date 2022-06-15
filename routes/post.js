const express = require('express');
const postRoute = express.Router();
const Post = require('../model/Post');
const cors = require('cors');
const auth = require('../middleware/auth');
const Comment = require('../model/Comment');

postRoute.use(cors())
postRoute.use(express.json());


// getting all posts 
postRoute.get('/allposts', async (req, res) => {
   try {
      const posts = await Post.find({}).sort({ createdAt: -1 });
      res.status(200).json({ posts: posts });
   } catch (error) {
      res.status(400).send(error);
   }
});




postRoute.get('/fetchpost/:id', async (req, res) => {
   try {
      const response = await Post.find({ userId: req.params.id }).sort({ createdAt: -1 });
      return res.status(200).json({ response });
   } catch (error) {
      return res.status(500).json({ error: error, msg: error.message });
   }
})



postRoute.post('/create_post', auth, async (req, res) => {
   const { title, description, imageUrl, _id, name, author } = req.body;

   let errors = [];
   if (title == '') {
      errors.push({ msg: 'Please enter title' })
   }
   if (description == '') {
      errors.push({ msg: 'Please enter description' })
   }
   if (imageUrl == '') {
      errors.push({ msg: 'Please enter image url' })
   }
   if (errors.length !== 0) {
      res.status(400).json({ errors })
   }
   else {
      try {
         const data = await Post.create({
            title,
            description,
            imageUrl,
            userId: _id,
            name: name,
            author: author,

         });

         res.status(200).json({
            msg: 'Post Created Successfully',
            data
         });
      }
      catch (error) {
         res.status(400).json({
            errors: error,
            msg: error.message
         });
      }

   }


});
postRoute.get('/post/:id', auth, async (req, res) => {
   try {
      const post = await Post.findOne({ _id: req.params.id });
      res.status(200).json({ post });
   } catch (error) {
      res.status(400).json({ error });
   }
});

postRoute.put('/edit', auth, async (req, res) => {
   const { title, description, imageUrl, author, id } = req.body;
   console.log(req.body);
   let errors = [];
   if (title == '') {
      errors.push({ msg: 'Please enter title' })
   }
   if (description == '') {
      errors.push({ msg: 'Please enter description' })
   }
   if (imageUrl == '') {
      errors.push({ msg: 'Please enter image url' })
   }
   if (errors.length !== 0) {
      res.status(400).json({ errors })
   }
   else {
      try {
         const data = await Post.findOneAndUpdate({ userId: id }, {
            title: title,
            description: description,
            imageUrl: imageUrl,
            author: author
         });


         res.status(200).json({
            msg: 'Post Updated Successfully',
            
         });
      }
      catch (error) {
         res.status(400).json({
            errors: error,
            msg: error.message
         });
      }
   }
});

postRoute.delete('/delete/:id', auth, async (req, res) => {
   try {
      const post = await Post.findByIdAndRemove(req.params.id);
      res.status(200).json({ msg: 'Post Deleted Successfully' });
   } catch (error) {
      res.status(400).json({ error });
   }
});

//post details using id

postRoute.get('/details/:id', auth, async (req, res) => {
   try {
      const post = await Post.findOne({ _id: req.params.id });
      const comments = await Comment.find({ postId: req.params.id });
      res.status(200).json({ post, comments });
   } catch (error) {
      res.status(400).json({ error });
   }
});

//comment route
postRoute.post('/comment', auth, async (req, res) => {
   const { id, comment, name } = req.body;
   // console.log(req.body);
   try {
      const response = await Comment.create({
         postId: id,
         comment,
         name,
      });
      return res.status(200).json({ msg: 'Your comment has been published' });
   } catch (error) {
      return res.status(500).json({ errors: error, msg: error.message });
   }
});

// delete comment from post
postRoute.delete('/deleteComment/:id',auth, async (req, res) => {
   try {
      const comment = await Comment.findByIdAndRemove(req.params.id);
      res.status(200).json({ msg: 'Comment Deleted Successfully' });
   } catch (error) {
      res.status(400).json({ error });
   }
});

// search post by title
postRoute.get('/search/:title', async (req, res) => {
   // search using name or title
   try {
      const post = await Post.find({
         "$or": [
            {
               "title": { $regex: req.params.title },
               "author": { $regex: req.params.title }
            }
         ]
      });

      res.status(200).json({ post });
   }
   catch (error) {

      res.status(400).json({ error });
   }

});








module.exports = postRoute;
