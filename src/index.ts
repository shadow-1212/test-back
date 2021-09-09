import { PrismaClient } from '@prisma/client'
import express from 'express'
import { stringify } from 'querystring'


const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// ... your REST API routes will go here
app.use(express.static('public'));
// ?POST

app.get('/post', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

    const posts = await prisma.post.findMany({
      include: { user :true }
    })
    res.json(posts)
  })

app.post('/post', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { userId, productId, content } = req.body
  const post = await prisma.post.create({
    data: {
      userId,
      productId,
      content,
    },
  })
  res.json(post)
})
  


//   ?PRODUCT
app.get(`/product/:id`, async (req, res) => {
   res.header("Access-Control-Allow-Origin", "*");
    const { id } = req.params
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include:{
        posts:{
          include:{
            user:true
          }
       }}
    })
    res.json(product)
  })
 

app.get('/product', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const products = await prisma.product.findMany({
  })
  res.json(products)
})

// ?COMMAND

app.post('/checkout/:id', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  const { id } = req.params
  const { userId, qty } = req.body;
  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: { 
      stock:{
        decrement: qty
      } 
    },
  })
  const command = await prisma.command.create({
    data: {
        productId:Number(id),
        userId:Number(userId)      
    },
    include:{product:true}
  })  
  res.json(req.body)
})


// ?USER

app.post('/user', async (req, res) => {
  const { username, password, email} = req.body
  const user = await prisma.user.create({
    data: {
      username,
      password,
      email
    },
  })
  res.json(user)
})

app.post(`/login`, async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
   const { email, password } = req.body;
   const user = await prisma.user.findFirst({
    where: {
      email: String(email),
      password: String(password)
    },
    
   })
   res.json(user)
 })


  







app.listen(3200, () =>
  console.log('REST API server ready at: http://localhost:3200'),
)
