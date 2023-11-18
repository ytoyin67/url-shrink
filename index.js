const express =  require('express')
const mongoose = require('mongoose')
const app = express()
const dotenv = require('dotenv').config()
const ShortUrl = require('./models/shorturls')

mongoose.connect(process.env.MONGO_URI).then(()=> {

  
const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> console.log('listening on port 3000'))
console.log('Db conneced')}).catch(error => console.log(error))



app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.set('view engine', 'ejs')



app.get('/', async(req,res)=>{
  const shorturls = await ShortUrl.find()
  res.render('index', {shorturls})
})


app.post("/shorturls", async(req,res)=>{

       const findur = await ShortUrl.findOne({full: req.body.fullUrl})
         
       if(findur){
        return res.redirect('/')
       } 

         await ShortUrl.create({full: req.body.fullUrl })


         res.redirect('/')
})

app.get('/:shorturl', async(req,res)=>{
        const myurl =  await ShortUrl.findOne({short: req.params.shorturl})
      if(myurl === null) return res.sendStatus(400)
     
         myurl.clicks++

    myurl.save()
      res.redirect(myurl.full)
      
})


