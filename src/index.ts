import express from 'express'
import loginRouter from './controllers/login';

const app = express();
app.use(express.json());

const PORT = 3001;


app.use('/api/login', loginRouter);

app.listen(PORT, ()=>{
    console.log('Server running on port '+ PORT)
})
