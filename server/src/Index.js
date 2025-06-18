import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import blogRoutes from './routes/blog.routes.js'
import userRoutes from './routes/user.routes.js'
import adminRoutes from './routes/admin.routes.js'
import bodyParser from 'body-parser';

const app = express();
dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    
}))
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true,}))


const mongoDBConnection = async () => {
    try {
        const connectDB = await mongoose.connect(`${process.env.MONGODB_URI}`,{dbName: 'Blog_application'});
        console.log(`MONGODB CONNECTED !! DB HOST: ${connectDB.connection.host}`)
    } catch (error) {
        console.log("MONGODB CONNETCION ERROR : ", error)
        process.exit(1)   
    }
}

mongoDBConnection()
.then(() => console.log('Database connected successfully.'))
.catch((err) => console.log('Database connection error.', err));


app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/blog', blogRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/admin', adminRoutes)


app.listen(PORT,() => {
console.log("listening on", PORT)
})