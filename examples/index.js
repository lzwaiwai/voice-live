var datas = [{
    id: 1,
    src: 'http://oe72nssoc.bkt.clouddn.com/8aa14d97-ba07-4a0f-a4a5-176508a40267.mp3',
    time: 26,
    currentTime: 0
}, {
    id: 2,
    src: 'http://oe72nssoc.bkt.clouddn.com/28792619-0fc7-40de-a9bc-8633d32b6c05.mp3',
    time: 20,
    currentTime: 0
}, {
    id: 3,
    src: 'http://oe72nssoc.bkt.clouddn.com/e7e3c17e-0dab-49b0-99fe-8ac4b6449b59.mp3',
    time: 5,
    currentTime: 0
}, {
    id: 4,
    src: 'http://oe72nssoc.bkt.clouddn.com/8aa14d97-ba07-4a0f-a4a5-176508a40267.mp3',
    time: 26,
    currentTime: 0
}, {
    id: 5,
    src: 'http://oe72nssoc.bkt.clouddn.com/28792619-0fc7-40de-a9bc-8633d32b6c05.mp3',
    time: 20,
    currentTime: 0
}];

var tpls = '';

datas.forEach(function (item, index) {
  var time = item.time
  if (item.time < 10) {
    time = '0' + item.time
  }
  tpls += '<ul> \
    <li data-id="' + item.id + '"> \
      第 ' + index + ' 条(' + time + 's): \
      <span class="play handle">play</span> \
      <span class="pause handle last">pause</span> \
      <span class="view first">time: <span id="currentTime-' + item.id + '"></span></span> \
      <span class="view">progress: <span id="progress-' + item.id + '"></span></span> \
    </li> \
  </ul>';
});

var appEle = $('#app');
appEle.html(tpls);

appEle.delegate('.play', 'click', function (event) {
  var id = $(event.target).parents('li').attr('data-id')
  play(id)
})

appEle.delegate('.pause', 'click', function (event) {
  var id = $(event.target).parents('li').attr('data-id')
  pause(id)
})

var howls = new VoiceLive({
  datas: this.datas,
  step: (itemId, currentTime, progress) => {
    $('#currentTime-' + itemId).text(Math.floor(currentTime) + 's');
    $('#progress-' + itemId).text((progress * 100).toFixed(1) + '%')
  },
  events: {
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
      this.playNext();
      console.log('onend');
    }
  }
});

function play (id) {
  howls.play(id);
};

function pause (id) {
  howls.pause(id);
};
