const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://Ajeetashu14:VkFCqQrhaPFTEfwg@cluster0.2bimbn4.mongodb.net/Blinkit_WebApp');

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username: String,
    password: String
});

const imageSchema = new mongoose.Schema({
    name: String,
    img: {
      data: Buffer,
      contentType: String
    }
  });

const User = mongoose.model('User', UserSchema);
const Img= mongoose.model('Img',imageSchema);

module.exports = {
    User,
    Img
}