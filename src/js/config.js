console.log('Loading config.js');
console.log('User language: ' + navigator.language);
this.exports = {
  isGerman: (navigator.language == 'de-DE'),
  stationMaxLength: 20,
  appName: 'DVBMonitor'
};