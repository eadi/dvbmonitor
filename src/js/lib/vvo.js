console.log('Loading vvo.js');

this.exports = {
  loadDepartures: function(station, success, error) {
    var ajax = require('ajax');
    console.log('Before request');
  	ajax(
      {
        url: encodeURI("http://widgets.vvo-online.de/abfahrtsmonitor/Abfahrten.do?ort=Dresden&hst="+station.name+"&vz=0&lim=20&iso=1&timestamp="+(new Date()).getTime()), 
        type: "json"
      },
  		function(data) {
        console.log('After request success');
        console.log(data);
        success(station, data);
  		},
  		error
  	);
  },
  convertApiResponse: function (apiData, i18n, config) {
  	var directions = [];
  	var entries = [];
  	for(var i in apiData) {
  		if(directions.indexOf(apiData[i][0]+apiData[i][1]) == -1 && apiData[i][2] < 100 ) {
        if (apiData[i][2] === "0") {
          apiData[i][2] = "";
        }
        entries.push({
          time: apiData[i][2],
          number: apiData[i][0],
          direction: apiData[i][1]
        });
  			directions.push(apiData[i][0]+apiData[i][1]);
        if (entries.length >= 6) {
          return entries;
        }
  		}
  	}
    
    return entries;
  }
};