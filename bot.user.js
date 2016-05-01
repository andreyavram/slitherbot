// ==UserScript==
// @name         Slither.io Bot
// @namespace    slitherbot
// @version      0.1
// @description  Slither.io Bot
// @author       Oliver Ni
// @match        http://slither.io/*
// @run-at       document-body
// @grant        none
// ==/UserScript==

/** @type {boolean} */
var debugMode = false;
/** @type {boolean} */
var viewMap = false;
/** @type {null} */
var map = null;
/** @type {number} */
var choosed = 0;
/** @type {number} */
var curSize = 0;
/** @type {number} */
var prey = 0;
/** @type {number} */
var running = 0;
/**
 * @param {number} dataAndEvents
 * @param {number} b
 * @return {?}
 */
function setChoosed(dataAndEvents, b) {
  if (!playing) {
    return false;
  }
  /** @type {number} */
  var m = 25 - b;
  /** @type {number} */
  var i = 25 + dataAndEvents;
  if (!dataAndEvents || (!b || !map[m][i])) {
    return false;
  }
  if (running && (map[m][i].type != "s" || (dataAndEvents < -7 || (dataAndEvents > 7 || (b < -7 || b > 7))))) {
    return false;
  }
  if (map[m][i].type == "s" && (dataAndEvents > -7 && (dataAndEvents < 7 && (b > -7 && b < 7)))) {
    /** @type {number} */
    running = 13;
    /** @type {number} */
    xm = -dataAndEvents * 150;
    /** @type {number} */
    ym = b * 150;
    setAcceleration(0);
    return true;
  }
  if (map[m][i].type == "$" && (dataAndEvents > -5 && (dataAndEvents < 5 && (b > -5 && b < 5)) || prey)) {
    /** @type {number} */
    prey = 1;
    /** @type {number} */
    xm = dataAndEvents * 40;
    /** @type {number} */
    ym = -b * 40;
    setAcceleration(1);
    return true;
  }
  if (!prey && (map[m][i].type == "*" && (map[m][i].size > curSize || map[m][i].id == choosed))) {
    choosed = map[m][i].id;
    curSize = map[m][i].size;
    var obj = map[m][i].array[0];
    if (obj) {
      /** @type {number} */
      xm = dataAndEvents * 40;
      /** @type {number} */
      ym = -b * 40;
      setAcceleration(curSize > 100);
      return true;
    }
  }
  return false;
}
/**
 * @return {undefined}
 */
function __updatePlayer() {
  /** @type {boolean} */
  var found = false;
  /** @type {number} */
  var node = 0;
  for (;node < 23;++node) {
    /** @type {number} */
    var oldconfig = 0;
    for (;oldconfig < node + 1;++oldconfig) {
      if (setChoosed(oldconfig, node) || (setChoosed(oldconfig, -node) || (setChoosed(-oldconfig, node) || (setChoosed(-oldconfig, -node) || (setChoosed(node, oldconfig) || (setChoosed(node, -oldconfig) || (setChoosed(-node, oldconfig) || setChoosed(-node, -oldconfig)))))))) {
        /** @type {boolean} */
        found = true;
        if (running) {
          break;
        }
      }
    }
  }
  if (!found) {
    __onEat();
  }
  if (running) {
    /** @type {number} */
    running = running - 1;
  }
  setTimeout(__updatePlayer, 50);
}
/**
 * @return {undefined}
 */
function __onEat() {
  if (!running) {
    setAcceleration(0);
  }
  /** @type {number} */
  prey = choosed = curSize = 0;
}
var mpd;
(function(self) {
  /**
   * @return {undefined}
   */
  function init() {
    /** @type {Array} */
    map = new Array(i);
    /** @type {number} */
    var y = 0;
    for (;y < i;++y) {
      /** @type {Array} */
      map[y] = new Array(i);
    }
    render();
    /** @type {(function ((Event|null)): ?|null)} */
    self.omm = self.onmousemove;
    /** @type {(function ((Event|null)): ?|null)} */
    self.ocm = self.oncontextmenu;
    self.otm = self.ontouchmove;
    self.ots = self.ontouchstart;
    /** @type {(function ((Event|null)): ?|null)} */
    self.omd = self.onmousedown;
    self.ote = self.ontouchend;
    document.okd = document.onkeydown;
    /** @type {function (?): undefined} */
    document.oku = document.onkeyup;
    /** @type {function (?): undefined} */
    self.onmousemove = self.oncontextmenu = self.ontouchmove = self.ontouchstart = self.ontouchend = self.onmousedown = document.onkeydown = document.onkeyup = function(event) {
    };
    __updatePlayer();
  }
  /**
   * @return {undefined}
   */
  function render() {
    if (!viewMap) {
      return;
    }
    /** @type {Array} */
    var assigns = [];
    /** @type {number} */
    var index = -1;
    for (;index <= i;++index) {
      /** @type {string} */
      var vvar = "| ";
      /** @type {number} */
      var y = 0;
      for (;y < i;++y) {
        if (index < 0 || index == i) {
          vvar += "==";
        } else {
          var key = !map[index][y] ? "." : map[index][y].type.toString();
          switch(key) {
            case "*":
              /** @type {string} */
              key = '<font color="#0000FF">' + key + "</font>";
              break;
            case "$":
              /** @type {string} */
              key = '<font color="#FFFFFF">' + key + "</font>";
              break;
            case "O":
              /** @type {string} */
              key = '<font color="#00DD00">' + key + "</font>";
              break;
            case "s":
              /** @type {string} */
              key = '<font color="#FF0000">' + key + "</font>";
              break;
          }
          vvar += key + " ";
        }
      }
      vvar += " |";
      assigns.push(vvar);
    }
    /** @type {string} */
    mpd.innerHTML = assigns.join("<br>");
    setTimeout(render, 50);
  }
  /**
   * @param {?} g
   * @param {?} b
   * @param {?} r
   * @param {?} a
   * @param {(Object|null)} buffer
   * @return {undefined}
   */
  function callback(g, b, r, a, buffer) {
    /** @type {number} */
    var length = i / 2;
    /** @type {number} */
    var ilen = (r - g) / 40 + length;
    /** @type {number} */
    var l = (a - b) / 40 + length;
    if (ilen < 0 || (ilen > i || (l < 0 || (l > i || map[l | 0][ilen | 0] && map[l | 0][ilen | 0].type == "s")))) {
      return;
    }
    if (buffer.type == "*") {
      var self = map[l | 0][ilen | 0];
      if (self && self.type != "*") {
        return;
      }
      if (!self) {
        self = map[l | 0][ilen | 0] = {};
        /** @type {number} */
        self.id = 0;
        /** @type {string} */
        self.type = "*";
        /** @type {number} */
        self.size = 0;
        /** @type {Array} */
        self.array = [];
      }
      /** @type {number} */
      self.id = self.id ^ buffer.id;
      self.size += buffer.sz;
      self.array.push(buffer);
      return;
    }
    /** @type {Object} */
    map[l | 0][ilen | 0] = buffer;
  }
  /** @type {number} */
  var i = 50;
  /** @type {boolean} */
  var viewsEnabled = false;
  self.addEventListener("load", function() {
    /** @type {function (): undefined} */
    self.connect_old = self.connect;
    /**
     * @return {undefined}
     */
    self.connect = function() {
      init();
      connect_old();
      /** @type {function ((Event|null)): undefined} */
      self.ws.onMessageOld = self.ws.onmessage;
      /**
       * @param {(Event|null)} ev
       * @return {undefined}
       */
      self.ws.onmessage = function(ev) {
        this.onMessageOld(ev);
        /** @type {Uint8Array} */
        var array_buffer = new Uint8Array(ev.data);
        /** @type {string} */
        var type = String.fromCharCode(array_buffer[2]);
        if (playing && (type == "g" || (type == "n" || (type == "G" || type == "N")))) {
          /** @type {Array} */
          map = new Array(i);
          /** @type {number} */
          var y = 0;
          for (;y < i;++y) {
            /** @type {Array} */
            map[y] = new Array(i);
          }
          snakes.forEach(function(s, dataAndEvents, deepDataAndEvents) {
            /** @type {string} */
            s.type = s === snake ? "O" : "s";
            s.pts.forEach(function(af, dataAndEvents, deepDataAndEvents) {
              if (af.da < 0.15 && s !== snake) {
                callback(snake.xx, snake.yy, af.xx, af.yy, s);
              }
            });
          });
          foods.forEach(function(data, dataAndEvents, deepDataAndEvents) {
            if (data && !data.eaten) {
              /** @type {string} */
              data.type = "*";
              callback(snake.xx, snake.yy, data.xx, data.yy, data);
            }
          });
          preys.forEach(function(data, dataAndEvents, deepDataAndEvents) {
            if (data) {
              /** @type {string} */
              data.type = "$";
              callback(snake.xx, snake.yy, data.xx, data.yy, data);
            }
          });
        } else {
          if (playing && (type == "c" || type == "y")) {
            /** @type {number} */
            var id = array_buffer[3] << 16 | array_buffer[4] << 8 | array_buffer[5];
            foods.forEach(function(dataAndEvents, deepDataAndEvents, ignoreMethodDoesntExist) {
              if (dataAndEvents && dataAndEvents.eaten_by === snake) {
                __onEat();
              }
            });
          }
        }
      };
    };
  }, false);
})(window);
