const express = require('express')
const router = express.Router()
const Product = require('../models')

router.get('/', (req, res) => {
    Product.findAll()
    .then(products => {
        res.json(products)
    })
    .catch(err => {
        res.json(err)
    })
})

router.get('/:id', (req, res) => {
    Product.findById(req.params.id)
    .then(product => {
        res.json(product)
    })
    .catch(err => {
        res.json(err)
    })
})

router.post('/', (req, res) => {
    let { title, description, price, stock, image_url } = req.body

    price = Number(price)
    stock = Number(stock)

    if (!title || !description || !price || !stock) {
        new Error('All fields are required')
    }

    Product.create({name, description, price, stock, image_url})
    .then(product => {
        res.json(product)
    })
    .catch(err => {
        res.json(err)
    })
})

router.put('/:id', (req, res) => { 
    let { name, description, price, stock, image_url } = req.body

    price = Number(price)
    stock = Number(stock)

    if (!name || !description || !price || !stock) {
        new Error('All fields are required')
    }

    Product.update(req.params.id, {name, description, price, stock, image_url})
    .then(product => {
        res.json(product)
    })
    .catch(err => {
        res.json(err)
    })
})

router.delete('/:id', (req, res) => {
    Product.delete(req.params.id)
    .then(() => {
        res.json({ message: `Product with id ${req.params.id} has been deleted`})
        })
    .catch(err => {
        res.json(err)
    })
})


module.exports = router;