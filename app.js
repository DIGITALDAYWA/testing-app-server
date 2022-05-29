const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')

const authjwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')

app.use(cors())
app.options('*', cors())

//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
//app.use(authjwt())
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(errorHandler)

const api = process.env.API_URL

//Routes
const productRoutes = require('./router/products')
const categoriesRoutes = require('./router/categories')
const usersRoutes = require('./router/users')
const ordersRoutes = require('./router/orders')

app.use(`${api}/products`, productRoutes)
app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/orders`, ordersRoutes)

mongoose
  .connect(process.env.CONNECTION_URI)
  .then(() => {
    console.log('Database connection is ready ...')
  })
  .catch((error) => {
    console.log(error)
  })

//Development

// app.listen(3000, () => {
//   console.log('Server is running now http://localhost:3000')
// })

//Production
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port
  console.log('Express is working on port' + port)
})
