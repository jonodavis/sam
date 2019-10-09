const rp = require('request-promise')
const cheerio = require('cheerio')

const url = 'https://at.govt.nz/umbraco/Surface/ParkingAvailabilitySurface/ParkingAvailabilityResult?carparkIdParam=civic%2C%20downtown%2C%20victoria%20st&categoryParam=short-term'

const getParking = (callback) => {
  rp(url).then( html => {
    //success!
    const $ = cheerio.load(html)
    let results = []
    $('.divTableRow > .divTableCell').each( (i, e) => { results[i] = $(e).text() })
    let output = {
      "civic": results[1],
      "downtown": results[3],
      "victoriast": results[5],
      "civicMax": 928,
      "downtownMax": 1944,
      "victoriastMax": 895 }
    return callback(output)
  }).catch( err => {
    throw err
  })
}

module.exports = getParking

