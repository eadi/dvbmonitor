console.log('Loading i18n.js');

this.exports = {
  cutString: function(stationname, length) {
  	if(stationname.length < length) {
  		return stationname;
  	} else {
  		return stationname.substr(0, length - 3) + "...";
  	}
  },
  translateString: function(text, isGerman) {
    if (!isGerman) {
      return text;
    }
    if (text == "Error downloading departures.") {
      return 'Fehler beim Laden der Abfahrten.';
    }
    if (text == 'Fetching departures for') {
      return 'Suche nach Abfahrten für';
    }
    if (text == 'Fetching nearest station...') {
      return 'Suche nächstgelegene Haltestelle...';
    }
    if (text == 'Fetching location...') {
      return 'Ermittle Position...';
    }
    if (text == 'No departures') {
      return 'Keine Abfahrten';
    }
  
    return text;
  }
};