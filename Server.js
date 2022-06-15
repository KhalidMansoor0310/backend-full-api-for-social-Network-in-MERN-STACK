const express = require('express');
const app = express();
const port = 5000 || process.env.PORT;
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());
app.use(express.json());



app.use('/api/users/', require('./routes/client'));
app.use('/api/posts/',require('./routes/post'));
app.use('/api/profile/',require('./routes/profileRoute'));
app.use('/api/question/',require('./routes/question'));


mongoose.connect("mongodb+srv://khalidmansoor:Mansoor00@cluster0.yetfe.mongodb.net/article_DB?retryWrites=true&w=majority",()=>{
    console.log('connected to mongoDB');
})

app.listen(port,()=>{
  console.log(`Listening to ${port} port`)
})
