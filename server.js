const express= require ('express');
const app= express();
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://glamgrabstore.netlify.app, https://glamadmin.netlify.app/user']
}));


dotenv.config();

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json()); 


const uri = process.env.MONGO_URI;
console.log('MongoDB URI:', uri); 

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        if (err.stack) console.error(err.stack);
    });

app.get('/', (req, res) => {
    res.send('Group 1 - Members: sughra, khadija, Memona - Project: glamgrabstore');
});


const productRoutes= require('./routers/product');
const userRouter= require ('./routers/user')
const customizeRouter = require('./routers/customizepage')
const bannerRouter =require('./routers/banner')
const cartRouter= require('./routers/cart')
const shippingRouter= require('./routers/shipping')
const settingRouter= require('./routers/setting')
const loginRouter= require ('./routers/login')




app.use('/product', productRoutes);
app.use('/user', userRouter )
app.use('/customPage', customizeRouter  )
app.use('/banner', bannerRouter)
app.use('/cart', cartRouter)
app.use('/order', shippingRouter )
app.use('/setting', settingRouter )
app.use('/api', loginRouter)

app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });