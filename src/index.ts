import express from 'express'
import loginRouter from './controllers/login';
import cors from 'cors';
import registerRouter from './controllers/register';

const app = express();

app.use(cors())
app.use(express.json());

const PORT = 3001;
app.get("/", (req, res) => {
  res.send("Home page");
});

app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter)

app.listen(PORT, ()=>{
    console.log('Server running on port '+ PORT)
})
