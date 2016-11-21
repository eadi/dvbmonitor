this.exports = {
  SCREEN_TYPE_DEPARTURES: 'Departures',
  SCREEN_TYPE_DEPARTURES_FAV: 'Departures_Fav',
  SCREEN_TYPE_STATIONS: 'Stations',
  SCREEN_TYPE_LOADING: 'Loading',
  
  _IMAGE_UP: 'images/actionbar_up.png',
  _IMAGE_DOWN: 'images/actionbar_down.png',
  _IMAGE_OVERFLOW: 'images/actionbar_overflow.png',
  _IMAGE_LOCATE: 'images/actionbar_locate.png',
  _IMAGE_REFRESH: 'images/actionbar_refresh.png',
  _IMAGE_FAV_OFF: 'images/actionbar_fav_off.png',
  _IMAGE_FAV_ON: 'images/actionbar_fav_on.png',
  
  _backgroundColor: null,
  
  _upAction: null,
  _upIcon: null,
  _selectAction: null,
  _selectIcon: null,
  _downAction: null,
  _downIcon: null,
  _backAction: null,
  _enabled: null,
  
  _setType: function(type, callbacks) {
    this._enabled = true;
    console.log('Setting ActionBar Type ' + type);
    if (type == this.SCREEN_TYPE_DEPARTURES) {
      this._upAction = this._getCallback(callbacks, 'up');
      this._upIcon = this._IMAGE_LOCATE;
      this._selectAction = this._getCallback(callbacks, 'select');
      this._selectIcon = this._IMAGE_REFRESH;
      this._downAction = this._getCallback(callbacks, 'down');
      this._downIcon = this._IMAGE_FAV_OFF;
      this._backAction = this._getCallback(callbacks, 'back');
    } else if (type == this.SCREEN_TYPE_DEPARTURES_FAV) {
      this._upAction = this._getCallback(callbacks, 'up');
      this._upIcon = this._IMAGE_LOCATE;
      this._selectAction = this._getCallback(callbacks, 'select');
      this._selectIcon = this._IMAGE_REFRESH;
      this._downAction = this._getCallback(callbacks, 'down');
      this._downIcon = this._IMAGE_FAV_ON;
      this._backAction = this._getCallback(callbacks, 'back');
    } else if (type == this.SCREEN_TYPE_STATIONS) {
      this._upAction = this._getCallback(callbacks, 'up');
      this._upIcon = this._IMAGE_UP;
      this._selectAction = this._getCallback(callbacks, 'select');
      this._selectIcon = this._IMAGE_LOCATE;
      this._downAction = this._getCallback(callbacks, 'down');
      this._downIcon = this._IMAGE_DOWN;
      this._backAction = this._getCallback(callbacks, 'back');
    } else if (type == this.SCREEN_TYPE_LOADING) {
      this._upAction = null;
      this._selectAction = null;
      this._downAction = null;
      this._backAction = this._getCallback(callbacks, 'back');
      this._enabled = false;
    }
  },
  _getCallback: function(callbacks, type) {
    if (typeof callbacks[type] === "undefined") {
      console.log('Action bar is missing a required callback property ' + type);
      return null;
    }
    return callbacks[type];
  },
  init: function(window, backgroundColor) {
    var self = this;
    window.on('click', 'up', function() {
      self.upClick(self);
    });
    window.on('click', 'select', function() {
      self.selectClick(self);
    });
    window.on('click', 'down', function() {
      self.downClick(self);
    });
    window.on('click', 'back', function() {
      self.backClick(self);
    });
    this._backgroundColor = backgroundColor;
  },
  apply: function(window, type, callbacks) {
    this._setType(type, callbacks);
    if (!this._enabled) {
      window.action({});
    } else {
      window.action({
        up: this._upIcon,
        select: this._selectIcon,
        down: this._downIcon,
        backgroundColor: this._backgroundColor
      });
    }
  },
  _execute: function(callback) {
    if (typeof callback === "function") {
      return callback();
    }
    console.log('Cannot execute callback ' + (callback) + ' of type ' + (typeof callback));
    return false;
  },
  upClick: function(self) {
    console.log('Executing up click');
    return self._execute(self._upAction);
  },
  downClick: function(self) {
    console.log('Executing down click');
    return self._execute(self._downAction);
  },
  selectClick: function(self) {
    console.log('Executing select click');
    return self._execute(self._selectAction);
  },
  backClick: function(self) {
    console.log('Executing back click');
    return self._execute(self._backAction);
  },
};