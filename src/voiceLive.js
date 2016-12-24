;(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['howler'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('howler'));
  } else {
    global.VoiceLive = factory(Howl);
  }
}(this, function (Howl) {
  'use strict';
  Howl = Howl.Howl || Howl;
  var F = function () {};

  var _array2Obj = function (datas) {
    var res = {},
      i = 0,
      len = datas.length;

    for (; i < len; i++) {
      var item = datas[i];
      res[item.id] = item;
    }
    return res;
  };

  var _isArray = function (arr) {
    return Object.prototype.toString.call(arr).indexOf('Array') === '[object Array]';
  };

  var VoiceLive = function (options) {
    this._init(options);
  };

  VoiceLive.prototype = {
    _init: function (options) {
      if (!options) {
        throw new Error('options is wrong!');
      }

      if (_isArray(options.datas)) {
        throw new Error('datas must be array');
      }

      this.curItemId = ''; // 当前正在播放的音频ID
      this.curItemIndex = ''; // 当前正在播放的音频的顺序
      this.step = options.step || F; // 定时器函数
      this.events = options.events || {}; // 所有音频的播放事件监听
      this.originLists = options.datas; // 原数据 [数组，有播放顺序数据]
      this.playLists = _array2Obj(options.datas); // 播放数据 [对象，播放使用]
    },

    _getCurItemIndex: function (itemId) {
      var i = 0,
        len = this.originLists.length;

      for (; i < len; i++) {
        var item = this.originLists[i];
        if (item.id.toString() === itemId.toString()) {
          return i;
        }
      }
    },

    _step: function (itemId) {
      var item = this.playLists[itemId],
        sound = item && item.howl;

      if (sound && sound.playing()) {
        var currentTime = sound.seek(),
          duration = sound.duration();

        this.step(itemId, currentTime, currentTime / duration);
        window.requestAnimationFrame(this._step.bind(this, itemId));
      }
    },

    addVoice: function (data) {
      if (!_isArray(data)) { // single data
        this.originLists.push(data);
        this.playLists[data.id] = data;
      } else {
        var i = 0,
          len = data.length;
        for (; i < len; i++) {
          var item = data[i];
          this.originLists.push(item);
          this.playLists[item.id] = item;
        }
      }
      return this;
    },

    replaceVoice: function (itemId, newSrc) {
      var item = this.playLists[itemId],
        sound = item && item.howl;

      if (sound) {
        if (sound.playing()) {
          return;
        } else {
          this.destory(itemId);
        }
      }

      this.playLists[itemId].src = newSrc;
      this.originLists[this.curItemIndex].src = newSrc;
    },

    play: function (itemId) {
      var self = this,
        item = this.playLists[itemId],
        events = this.events,
        sound = item.howl;

      if (!sound) {
        sound = new Howl({
          src: item.src,
          volume: 1.0,
          onload: function () {
            if (events.onload) {
              events.onload.call(self);
            }
          },
          onloaderror: function () {
            if (events.onloaderror) {
              events.onloaderror.call(self);
            }
          },
          onplay: function () {
            window.requestAnimationFrame(self._step.bind(self, itemId));
            if (events.onplay) {
              events.onplay.call(self);
            }
          },
          onpause: function () {
            if (events.onpause) {
             events.onpause.call(self);
           }
          },
          onstop: function () {
            if (events.onstop) {
              events.onstop.call(self);
            }
          },
          onend: function () {
            if (events.onend) {
              events.onend.call(self);
            }
          }
        });
      } else if (sound.playing()) {
        return;
      }

      this.pause(this.curItemId);
      sound.seek(item.currentTime.toFixed(0));
      sound.play();

      this.playLists[itemId].howl = sound;
      this.curItemId = item.id;
      this.curItemIndex = this._getCurItemIndex(itemId);
      return this;
    },

    pause: function (itemId) {
      var item = this.playLists[itemId],
        sound = item && item.howl;

      if (sound) {
        this.curItemId = '';
        sound.pause();
        this.playLists[itemId].currentTime = sound.seek();
      }

      return this;
    },

    stop: function (itemId) {
      var item = this.playLists[itemId],
        sound = item && item.howl;

      if (sound) {
        this.curItemId = '';
        sound.stop();
        this.playLists[itemId].currentTime = 0;
      }

      return this;
    },

    destory: function (itemId, callback) {
      if (typeof itemId === 'function') {
        callback = itemId;
        itemId = '';
      }

      // destory one sound
      if (itemId) {
        var item = this.playLists[itemId],
          sound = item && item.howl;

        if (!sound) {
          return this;
        }

        sound.unload();
        this.playLists[itemId].howl = null;
        this.playLists[itemId].currentTime = 0;

        if (callback) {
          callback(this.playLists[itemId]);
        }

        return this;
      }

      // destory all sound
      var keys = Object.keys(this.playLists);
      var self = this;
      keys.forEach(function (item, index) {
        var itemSound = self.playLists[item];
        if (itemSound && itemSound.howl) {
          itemSound.howl.unload();
          self.playLists[item].howl = null;
          self.playLists[item].currentTime = 0;
        }
        if (callback && keys.length - 1 === index) {
          callback(self.playLists);
        }
      });
      return this;
    },

    playNext: function (currentTime) {
      if (this.curItemIndex === '') {
        return;
      }

      var nextItem = this.originLists[++this.curItemIndex];
      if (!nextItem) {
        return;
      }

      var sound = this.playLists[nextItem.id];
      if (currentTime !== undefined && sound && sound.howl) {
        sound.howl.seek(0, nextItem.id);
      }

      this.play(nextItem.id);
    },

    playPre: function (currentTime) {
      if (this.curItemIndex === '') {
        return;
      }

      var preItem = this.originLists[--this.curItemIndex];
      if (!preItem) {
        return;
      }

      var item = this.playLists[preItem.id],
        sound = item && item.howl;
      if (currentTime !== undefined && sound) {
        sound.seek(0);
      }

      this.play(preItem.id);
    }
  };

  return VoiceLive;
}));
