console.log('Loading storage.js');

this.exports = {
  getFavStations: function() {
    var stations = {};
    var storage = localStorage.getItem('favStations');
    if (storage === null || typeof storage !== 'string') {
      storage = '';
    }
    //console.log('Reading favs: ' + storage);
    
    var station = '';
    storage = storage.split('#');
    for (var index in storage) {
      station = storage[index];
      if ((typeof station) === 'string' && station.length > 1) {
        stations[station] = true;
      }
    }
    return stations;
  },
  addFavStation: function (station) {
    var stations = this.getFavStations();
    stations[station] = true;
    this._setFavStations(stations);
  },
  toggleFavStation: function (station) {
    if ( this.isFavStation(station) ) {
      this.removeFavStation(station);
      return false;
    } else {
      this.addFavStation(station);
      return true;
    }
  },
  isFavStation: function(station) {
    var stations = this.getFavStations();
    if (stations.hasOwnProperty(station) && stations[station] === true) {
          return true;
    }
    return false;
  },
  removeFavStation: function (station) {
    var stations = this.getFavStations();
    stations[station] = false;
    this._setFavStations(stations);
  },
  _setFavStations: function(stations) {
    var storage = '';
    for (var property in stations) {
      if (stations.hasOwnProperty(property) && stations[property] === true) {
        storage += property + '#';
      }
    }
    console.log('Saving favs: ' + storage);
    localStorage.setItem('favStations', storage);
  }
};