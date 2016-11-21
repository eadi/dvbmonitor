console.log('Loading geo.js');

if (typeof Number.prototype.toRadians == 'undefined') {
    Number.prototype.toRadians = function() { return this * Math.PI / 180; };
}

var stations = require('lib/stations.js');

this.exports = {
  _stations: stations.data,
  _currentStation: null,
  _closestStations: [],
  _currentCoords: null,
  _defaultLocation: [51.049474,13.743974],
  _maxDistance: 1500,
  getClosestStations: function() {
    return this._closestStations;
  },
  getCurrentStation: function() {
    return this._currentStation;
  },
  setCurrentStation: function(station) {
    this._currentStation = station;
  },
  setCurrentCoords: function(coords) {
    this._currentCoords = coords;
  },
  getCurrentCoords: function() {
    return this._currentCoords;
  },
  locate: function(callback) {
    var self = this;
    navigator.geolocation.getCurrentPosition(function(coords) {
      self._onLocateFinished(coords, callback);
    });
  },
  _onLocateFinished: function(coords, callback) {
    console.log('Found location.');
    if (this._distanceBetween(coords.coords.latitude, coords.coords.longitude, this._defaultLocation[0], this._defaultLocation[1]) > this._maxDistance) {
      console.log('Fallback to default location.');
      coords.coords.longitude = this._defaultLocation[0];
      coords.coords.latitude = this._defaultLocation[1];
    }
    this.setCurrentCoords(coords);
    this._findStations();
    callback();
  },
  _distanceBetween: function (lat1, lon1, lat2, lon2) {
    var deltaLat = Math.sin((lat2-lat1).toRadians()/2);
    var deltaLon = Math.sin((lon2-lon1).toRadians()/2);
    var a = deltaLat * deltaLat + Math.cos(lat1.toRadians()) * Math.cos(lat2.toRadians()) * deltaLon * deltaLon;
    return 6371000 * ( 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  },
  _findStations: function() {
    var userLat = this._currentCoords.coords.latitude;
    var userLon = this._currentCoords.coords.longitude;
    var closest = this._stations[0];
    var list = [];
    var minDistance = 2147483647;
    var minListDistance = minDistance;
  	for(var i in this._stations) {
      var currentDistance = this._distanceBetween(userLat, userLon, this._stations[i][0], this._stations[i][1]);
  		if(currentDistance < minDistance) {
  			closest = this._stations[i];
        minDistance = currentDistance;
  		}
      if (currentDistance < minListDistance) {
        list.push({
          name: this._stations[i][2],
          distance: Math.round(currentDistance),
        });
      }
  	}
    
    if (minDistance > 1000000) {
      closest[2] = 'Pirnaischer Platz';
    }
    
    this._closestStations = list.sort(function(a, b) {
      return a.distance - b.distance;
    });
    this._closestStations = this._closestStations.slice(0, 10);

    console.log('Found station ' + closest[2]);
    this._currentStation = {
      name: closest[2],
      distance: Math.round(minDistance)
    };
  }
};