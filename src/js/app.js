console.log('Loading app.js');

var config = require('config.js');
var geo = require('lib/geo.js');
var i18n = require('lib/i18n.js');
var interface = require('lib/interface.js');
var vvo = require('lib/vvo.js');
var storage = require('lib/storage.js');

console.log('Starting initialisation.');
interface.init(
  toggleFavLocation,
  refreshDepartures,
  displayAvailableLocations,
  selectAlternateStation,
  locationUp,
  locationDown,
  quit
);
detectCurrentLocation();

function detectCurrentLocation() {
  interface.showLoadingScreen(i18n.translateString('Fetching location...', config.isGerman));
  geo.locate(displayDeparturesForLocation);
}

function displayDeparturesForLocation(location) {
  interface.showLoadingScreen(i18n.translateString('Fetching nearest station...', config.isGerman));
  var station = geo.getCurrentStation();
  displayDeparturesForStation(station);
}

function displayDeparturesForStation(station) {
  interface.showLoadingScreen(i18n.translateString('Fetching departures for', config.isGerman) + " " + station.name + '...');
  vvo.loadDepartures(station, displayApiResponse, displayApiError);
}

function displayApiResponse(station, response) {
  console.log('Loaded departures.');
  var entries = vvo.convertApiResponse(response, i18n, config);
  if (entries.length === 0) {
    entries.push({
      number: '',
      time: '',
      direction: i18n.translateString('No departures', config.isGerman)
    });
  }
  interface.showResultScreen(station.name, station.distance, entries, storage.isFavStation(station.name));
  console.log('Displayed response.');
  interface.vibrate('double');
}

function displayApiError() {
  interface.showLoadingScreen(i18n.translateString('Error downloading departures.', config.isGerman));
}

function displayAvailableLocations() {
  interface.showStationsScreen(storage.getFavStations(), geo.getClosestStations());
}

function toggleFavLocation() {
  var station = geo.getCurrentStation();
  interface.showResultScreenActionBar(storage.toggleFavStation(station.name));
}

function selectAlternateStation() {
  var station = {name: interface.getSelectedStation(), dustance: 0};
  geo.setCurrentStation(station);
  displayDeparturesForStation(station);
}

function refreshDepartures() {
  displayDeparturesForStation(geo.getCurrentStation());
}

function locationUp() {
  interface.locationCursorUp();
}

function locationDown() {
  interface.locationCursorDown();
}

function quit() {
  interface.quit();
}