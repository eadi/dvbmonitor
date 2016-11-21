console.log('Loading interface.js');

this.exports = {
  _config: require('config.js'),
  _actionbar: require('lib/actionbar.js'),
  _window: null,
  _locationsCursor: 0,
  _locationsListFav: {},
  _locationsListLoc: {},
  _locationsCount: 0,
  _locationSelected: null,
  _colorYellow: 'yellow',
  _colorGreen: '#00AA55',
  _callback_toggleFav: null,
  _callback_reload: null,
  _callback_showLocation: null,
  _callback_changeLocation: null,
  _callback_locationUp: null,
  _callback_locationDown: null,
  _callback_quit: null,
  init: function(toggleFav, reload, showLocation, changeLocation, locationUp, locationDown, quit) {
    this._callback_toggleFav = toggleFav;
    this._callback_reload = reload;
    this._callback_showLocation = showLocation;
    this._callback_changeLocation = changeLocation;
    this._callback_locationUp = locationUp;
    this._callback_locationDown = locationDown;
    this._callback_quit = quit;
  
    if (!this._isColorAvailable()) {
      this._colorYellow = 'black';
      this._colorGreen = 'white';
    }
    
    var UI = require('ui');
    this._window = new UI.Window({
      fullscreen: true
    });
    this._actionbar.init(this._window, this._colorGreen);
    this._window.show();
    console.log('Displaying interface');
  },
  _isColorAvailable: function() {
    var platform = 'aplite';
    if(Pebble.getActiveWatchInfo) {
      var watchinfo = Pebble.getActiveWatchInfo();
      platform = watchinfo.platform;
    }
    
    return (platform !== 'aplite');
  },
  _drawHeaderToWindow: function (title) {
    var Vector2 = require('vector2');
    var UI = require('ui');
    var displayElements = [];
    this._window.each(function(element) {
      displayElements.push(element);
    });
    var self = this;
    displayElements.forEach(function(element) {
      self._window.remove(element);
    });
  
    this._window.add(new UI.TimeText({   
      text: '%H:%M',
      color: 'white',
      textAlign: 'right',
      font: 'gothic-14',
      size: new Vector2(50, 10),
      position: new Vector2(62, 0)
    }));
    this._window.add(new UI.Rect({   
      position: new Vector2(12, 16),
      size: new Vector2(100, 18),
      backgroundColor: this._colorGreen
    }));
    this._window.add(new UI.Circle({   
      position: new Vector2(14, 24),
      radius: 15,
      backgroundColor: this._colorGreen
    }));
    this._window.add(new UI.Circle({   
      position: new Vector2(14, 24),
      radius: 12,
      backgroundColor: this._colorYellow
    }));
    this._window.add(new UI.Rect({   
      position: new Vector2(12, 19),
      size: new Vector2(97, 12),
      backgroundColor: this._colorYellow
    }));
    this._window.add(new UI.Text({
      text: 'H',
      color: this._colorGreen,
      textAlign: 'left',
      font: 'gothic-28-bold',
      size: new Vector2(15, 15),
      position: new Vector2(8, 5)
    }));
    this._window.add(new UI.Text({
      text: title,
      textOverflow: 'fill',
      color: this._colorGreen,
      textAlign: "left",
      font: 'gothic-14',
      size: new Vector2(76, 11),
      position: new Vector2(28, 15)
    }));
  },
  showLoadingScreen: function(text) {
    this._actionbar.apply(this._window, this._actionbar.SCREEN_TYPE_LOADING, {
      'back': this._callback_quit
    });
    this._drawHeaderToWindow(this._config.appName);
    var UI = require('ui');
    var Vector2 = require('vector2');
    this._window.add(new UI.Text({
      text: text,
      textOverflow: 'wrap',
      color: "white",
      textAlign: "left",
      font: 'gothic-18',
      size: new Vector2(94, 140),
      position: new Vector2(10, 43)
    }));
  },
  showResultScreenActionBar: function(isFavStation) {
    var actionbarType = this._actionbar.SCREEN_TYPE_DEPARTURES;
    if (isFavStation) {
      actionbarType = this._actionbar.SCREEN_TYPE_DEPARTURES_FAV;
    }
    this._actionbar.apply(this._window, actionbarType, {
      'up': this._callback_showLocation,
      'select': this._callback_reload,
      'down': this._callback_toggleFav,
      'back': this._callback_quit
    });
  },
  showResultScreen: function(station, distance, results, isFavStation) {
    this.showResultScreenActionBar(isFavStation);
    var Vector2 = require('vector2');
    var UI = require('ui');
    this._drawHeaderToWindow(station);
    var vPos = 18;
    var self = this;
    results.forEach(function(line){
      vPos += 20;
      self._window.add(new UI.Text({
        text: line.number.substring(0,3),
        textOverflow: 'ellipsis',
        color: "white",
        textAlign: "right",
        font: 'gothic-18',
        size: new Vector2(25, 15),
        position: new Vector2(0, vPos)
      }));
      self._window.add(new UI.Text({
        text: line.time,
        textOverflow: 'ellipsis',
        color: "white",
        textAlign: "left",
        font: 'gothic-18',
        size: new Vector2(15, 15),
        position: new Vector2(96, vPos)
      }));
      self._window.add(new UI.Text({
        text: line.direction,
        textOverflow: 'ellipsis',
        color: "white",
        textAlign: "left",
        font: 'gothic-14',
        size: new Vector2(68, 10),
        position: new Vector2(27, vPos + 3)
      }));
    });
  },
  showStationsScreen: function(favStations, nearbyStations) {
    this._actionbar.apply(this._window, this._actionbar.SCREEN_TYPE_STATIONS, {
      'up': this._callback_locationUp,
      'select': this._callback_changeLocation,
      'down': this._callback_locationDown,
      'back': this._callback_reload
    });
    this._locationsList = {};
    this._locationsCursor = 0;
    this._locationsCount = 0;
    for (var property in favStations) {
      if (favStations.hasOwnProperty(property)) {
        this._locationsList[property] = -1;
        this._locationsCount++;
      }
    }
    for (property in nearbyStations) {
      if (nearbyStations.hasOwnProperty(property) && !this._locationsList.hasOwnProperty(nearbyStations[property].name)) {
        this._locationsList[nearbyStations[property].name] = nearbyStations[property].distance;
        this._locationsCount++;          
      }
    }
    this._drawLocationsList();
  },
  _drawLocationsList: function() {
    var Vector2 = require('vector2');
    var UI = require('ui');
    this._drawHeaderToWindow(this._config.appName);
    var vPos = 18;
    var counter = 0;
    var color;
    var bgColor;
    var distance = 0;
    
    //scroll down
    var scroll = 0;
    if (this._locationsCursor > 3) {
      scroll = this._locationsCursor - 3;
      if (scroll > (this._locationsCount - 6)) {
        scroll = this._locationsCount - 6;
      }
    }

    for (var station in this._locationsList) {
      if (this._locationsList.hasOwnProperty(station)) {
        distance = this._locationsList[station];
        color = 'white';
        bgColor = 'clear';
        if (counter == this._locationsCursor) {
          color = 'white';
          bgColor = this._colorGreen;
          this._locationSelected = station;
        }
        
        counter++;
        if (counter - scroll > 6 || scroll >= counter) {
          continue;
        }
        
        vPos += 20;
        if (distance < 0) {
          this._window.add(new UI.Image({
            position: new Vector2(0, vPos + 3),
            size: new Vector2(20, 20),
            backgroundColor: 'clear',
            image: 'images/actionbar_fav_on.png'
          }));
        } else {
          distance = Math.round(distance / 100) / 10;
          if (distance >= 10) {
            distance = '';
          }
          this._window.add(new UI.Text({
            text: distance,
            textOverflow: 'ellipsis',
            color: 'white',
            backgroundColor: 'clear',
            textAlign: "left",
            font: 'gothic-14',
            size: new Vector2(20, 20),
            position: new Vector2(0, vPos + 3)
          }));
        }
        this._window.add(new UI.Text({
          text: station,
          textOverflow: 'ellipsis',
          color: color,
          backgroundColor: bgColor,
          textAlign: "left",
          font: 'gothic-14',
          size: new Vector2(90, 20),
          position: new Vector2(21, vPos + 3)
        }));
      }
    }
  },
  locationCursorUp: function() {
    if (this._locationsCursor > 0) {
      this._locationsCursor--;
    } else {
      this.vibrate('short');
    }
    this._drawLocationsList();
  },
  locationCursorDown: function() {
    if (this._locationsCursor < ( this._locationsCount - 1 )) {
      this._locationsCursor++;
    } else {
      this.vibrate('short');
    }
    this._drawLocationsList();
  },
  getSelectedStation: function() {
    return this._locationSelected;
  },
  vibrate: function(type) {  
    var Vibe = require('ui/vibe');
    Vibe.vibrate(type);
  },
  quit: function() {
    this._window.hide();
  }
};
