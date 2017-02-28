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

![img](http://o4a7cbihz.qnssl.com/cover/4b602607-ceb4-4e0d-9ecd-4806a7ed2620)

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
      progress = (progress * 100).toFixed(2) // for to 100
      if (progress > 99) {
        progress = 100.00
      }
      $('#currentTime-' + itemId).text(Math.floor(currentTime) + 's');
      $('#progress-' + itemId).text(progress + '%')
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

4. vl.seek(id, time)

5. vl.playNext()

6. vl.playPre()

7. vl.addVoice(data)

8. vl.destory([id][,fn])

9. vl.replace(id, src)
