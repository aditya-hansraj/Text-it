const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const port = process.env.PORT || 5000;
const dbURI = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());
// routes middlewares
app.use("/api/users", userRoutes);
app.use("/api/users", userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.send("Text-it !")
});

mongoose.connect(dbURI).then((result) => {
    app.listen(port, (req, res) => {
        console.log(`Server started at http://localhost:${port} !`);
        console.log(new Date());
    });
    console.log("Connected to database !");
}).catch(err => console.log(err));
