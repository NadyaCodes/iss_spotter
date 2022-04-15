const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

fetchMyIP((error, ip) =>  {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  // console.log('It worked! Returned IP:' , ip);
  const myIP = ip;

  fetchCoordsByIP((myIP), (error, coords) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
    // console.log('It worked! Returned coords:' , coords);

    const myCoords = coords;
    // console.log("coords: ", coords)

    fetchISSFlyOverTimes(myCoords, (error, data) => {
      if (error) {
        console.log("It didn't work!" , error);
        return;
      }
      // console.log('It worked! Returned flyover times:' , data);
    });
  });

});

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});











  
//   , (error, data) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned data' , data);
// });

