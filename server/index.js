import express from 'express'
import { config } from 'dotenv'
import { connectDB } from './utils/db.js'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import userRoute from './routes/user.router.js'
import pdfRoute from './routes/pdf.router.js'

config()

const app=express()
app.use(express.json())
const corsOrigin ={
    origin:"https://pdf-frontend-cnyr.onrender.com",
    credentials: true
}
app.use(cors(corsOrigin))
const port=process.env.PORT
connectDB()

app.use("/api/auth",userRoute)
app.use("/api/pdf",pdfRoute)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/merged', express.static(path.join(__dirname, 'merged')))

app.listen(port, ()=>{
    console.log(`Server is listening at ${port}`)
})
