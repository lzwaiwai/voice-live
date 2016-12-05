# VoiceLive.js

> Voice Live function library with Howler.js.

## Installation

In a browser:

```html
  <script src="voiceLive.js"></script>
```

Using npm:

```
  $ npm i -S howler
  $ npm i -S voiceLive
```

## Examples

![img](http://o3b126ie1.qnssl.com/cover/5e403295-31fb-4173-b88a-46f868c612ac)

``` javascript
  var datas = [{
    id: 4,
    src: 'xxxxx',
    time: 16,
    currentTime: 0
  }, {
    id: 4,
    src: 'xxxxx',
    time: 25,
    currentTime: 0
  }];

  var vl = new LiveAudio({
    datas: this.datas, 
    step: function (itemId, currentTime, progress) { // for live process, and like a timer 
      $('#currentTime-' + itemId).text(Math.floor(currentTime) + 's');
      $('#progress-' + itemId).text((progress * 100).toFixed(1) + '%')
    },
    events: { // events for current voice
      onload: function () {
        console.log('onload');
      },
      onloaderror: function () {
        console.log('onloaderror');
      },
      onplay: function () {
        console.log('onplay');
      },
      onpause: function () {
        console.log('onpause');
      },
      onstop: function () {
        console.log('onstop');
      },
      onend: function () {
        this.playNext(); // for auto play next item
        console.log('onend');
      }
    }
  });
```

## Methods
1. vl.play(id)

2. vl.pause(id)

3. vl.stop(id)

4. vl.playNext()

5. vl.playPre()

6. vl.addVoice(data)
