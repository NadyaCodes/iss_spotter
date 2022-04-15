const request = require('request');

const fetchMyIP = (callback) => {

  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) return callback(error, null);

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // if we get here, all's well and we got the data
    const siteData = JSON.parse(body);
    let ip = siteData.ip;
    callback(null, ip);

  });
};


const fetchCoordsByIP = (ip, callback) => {
  
  // console.log("ip: ", ip)
  // console.log(typeof ip)
  
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) return callback(error, null);

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // if we get here, all's well and we got the data
    const siteData = JSON.parse(body);

    let myLatitude = siteData.latitude;
    let myLongitude = siteData.longitude;

    const coords = {};

    coords.latitude = myLatitude;
    coords.longitude = myLongitude;

    // console.log("coords:", coords);

    callback(null, coords);

  });
};



const fetchISSFlyOverTimes = (coords, callback) => {
  const latitude = coords.latitude;
  const longitude = coords.longitude;

  request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`, (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) return callback(error, null);

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // if we get here, all's well and we got the data
    const siteData = JSON.parse(body);

    // console.log("siteData: ", siteData)

    const resultsArray = [];

    // console.log("siteData.response[0]", siteData.response[0]);

    for (let i = 0; i < siteData.response.length; i++) {
      resultsArray.push(siteData.response[i]);
    }
    // console.log("resultsArray: ", resultsArray);


    callback(null, resultsArray);

  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};



module.exports = { nextISSTimesForMyLocation };