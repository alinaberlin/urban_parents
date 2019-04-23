const express = require('express');
const router = express.Router();
const Place = require('../models/place.js')
const axios = require('axios')

router.get('/places', (req, res, next) => {
  Place.find()
    .then((places) => {
      res.json(places)
    })
    .catch(err => next(err))
})
const mapBoxToken = 'pk.eyJ1IjoiYW5nbWluc2hlbmciLCJhIjoiY2pydDhjMjlwMXhpaDN5cHMxcjNya2ZmbyJ9.Tc5kmo0vZ1VKJbLK83OloA';
router.post('/places', (req, res, next) => {
  const {name, address, postcode, city, country} = req.body
  const obj = {
    name,
    location: {
      type: "Point",
      Address: address ,
      Postcode: postcode,
      City: city,
      Country: country
    }
  }
  axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}%20${postcode}%20${city}.json?types=address&access_token=${mapBoxToken}`)
  .then(response => {
    const data = response.data
    obj.location.Coordinates = data.features[0].geometry.coordinates
    Place.create(obj). then(() => {
            
      res.redirect('/add-places') 
    })
  })
  .catch(err => next(err))
})


module.exports = router;