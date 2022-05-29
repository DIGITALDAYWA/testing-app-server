const express = require('express')
const { Category } = require('../models/category')
const { Product } = require('../models/product')
const router = express.Router()
const mongoose = require('mongoose')
//const multer = require('multer')

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}



router.get('/', async (req, res) => {
  let filter = {}
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') }
  }

  const productList = await Product.find(filter).populate('category')

  if (!productList) {
    res.status(500).json({
      success: false,
    })
  }
  res.send(productList)
})

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    res.status(400).send('Invalid Product Id')
  const product = await Product.findById(req.params.id).populate('category')

  if (!product) {
    res.status(500).json({
      success: false,
      message: "Cann't find any product that with you given ID ",
    })
  }
  res.send(product)
})

router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments()

  if (!productCount) res.status(500).json({ success: false })

  res.send({ count: productCount })
})

router.get('/get/featured/:count', async (req, res) => {
  const count = req.params.count ? req.params.count : 0
  const featuredProducts = await Product.find({ isFeatured: true }).limit(count)

  if (!featuredProducts) res.status(500).json({ success: false })

  res.send(featuredProducts)
})

//Post Methods

router.post('/', uploadOptions.single('image'), async (req, res) => {
  const category = await Category.findById(req.body.category)

  if (!category) return res.status(400).send('Invalid Category')

  const file = req.file
  if (!file) return res.status(404).send('No image in the request')

  const fileName = req.file.filename
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  })
  product = await product.save()

  if (!product) return res.status(500).send('The product cannot be created!')

  res.send(product)
})

//Put Methods

router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    res.status(400).send('Invalid Product Id')
  const category = await Category.findById(req.body.category)

  if (!category) return res.status(400).send('Invalid Category')

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  )
  if (!product) return res.status(500).send('The product can not be updated!')

  res.send(product)
})




//Delete Methods

router.delete('/:id', async (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({
          success: true,
          message: 'The product is deleted',
        })
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Product not found' })
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err })
    })
})

module.exports = router
