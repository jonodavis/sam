const rp = require('request-promise')
const url = 'https://www.instagram.com/'

const getInstagram = (username, callback) => {
  rp(url + username).then( html => {
    //success!
    let chopStart = html.substring(html.indexOf("<meta content=") + 15)
    let followerCount = chopStart.substring(0, chopStart.indexOf(" "))
    return callback(followerCount)
  }).catch( err => {
    throw err
  })
}

module.exports = getInstagram

