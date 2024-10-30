const express= require ('express');
const app= express();
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'] 
}));


dotenv.config();

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json()); 


const uri = 'mongodb://localhost:27017/glamgrabstore';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));



  app.get('/', (req, res) => {
    res.send('Group 1 - Members: Alice, Bob, Charlie - Project: Multi-Server Architecture');
});



const productRoutes= require('./routers/product');
const loginRouter= require ('./routers/login')
const userRouter= require ('./routers/user')
const customizeRouter = require('./routers/customizepage')
const bannerRouter =require('./routers/banner')
const cartRouter= require('./routers/cart')
const shippingRouter= require('./routers/shipping')



app.use('/product', productRoutes);
app.use('/login', loginRouter) 
app.use('/user', userRouter )
app.use('/customPage', customizeRouter  )
app.use('/banner', bannerRouter)
app.use('/cart', cartRouter)
app.use('/shipping', shippingRouter )

app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });