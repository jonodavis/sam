const fetch = require("node-fetch");
const url = `https://ergast.com/api/f1/current/next.json`;

const f1next = callback => {
  fetch(url)
    .then(respone => respone.json())
    .then(json => {
      let race = json.MRData.RaceTable.Races[0];
      return callback(race);
    })
    .catch(error => {
      throw error;
    });
};

module.exports = f1next;
