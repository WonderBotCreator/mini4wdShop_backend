import express from 'express'

import cors from 'cors';

import productRouter from './controllers/Product';
import registerRouter from './controllers/register';
import loginRouter from './controllers/login';
import cartRouter from './controllers/cart';
import profileRouter from './controllers/profile';

const app = express();

app.use(cors())
app.use(express.json());

const PORT = 3001;
app.get("/", (req, res) => {
  res.send("Home page");
});

app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/profile', profileRouter)

app.listen(PORT, ()=>{
    console.log('Server running on port '+ PORT)
})
