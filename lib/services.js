"use strict";

const axios = require("axios/index");

const getReverseGeoCoding = async (address, postcode, city, callback) => {
  const mapBoxToken =
    "pk.eyJ1IjoiYW5nbWluc2hlbmciLCJhIjoiY2pydDhjMjlwMXhpaDN5cHMxcjNya2ZmbyJ9.Tc5kmo0vZ1VKJbLK83OloA";
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}%20${postcode}%20${city}.json?types=address&access_token=${mapBoxToken}`
    );
    return response;
  } catch (err) {
    callback(err);
  }
};

module.exports = {
  getReverseGeoCoding
};
