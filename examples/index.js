var idRound = 0
var datas = [{
  id: ++idRound,
  src: 'http://oe72nssoc.bkt.clouddn.com/8aa14d97-ba07-4a0f-a4a5-176508a40267.mp3',
  time: 26,
  currentTime: 0
}, {
  id: ++idRound,
  // src: 'http://oe72nssoc.bkt.clouddn.com/28792619-0fc7-40de-a9bc-8633d32b6c05.mp3',
  src: 'http://ofe0v4nhm.qnssl.com/44da9b67-537f-4bf6-9a73-1cb67f4d6169.mp3',
  time: 33,
  currentTime: 0
}, {
  id: ++idRound,
  src: 'http://oe72nssoc.bkt.clouddn.com/e7e3c17e-0dab-49b0-99fe-8ac4b6449b59.mp3',
  time: 5,
  currentTime: 0
}, {
  id: ++idRound,
  src: 'http://oe72nssoc.bkt.clouddn.com/8aa14d97-ba07-4a0f-a4a5-176508a40267.mp3',
  time: 26,
  currentTime: 0
}, {
  id: ++idRound,
  src: 'http://oe72nssoc.bkt.clouddn.com/28792619-0fc7-40de-a9bc-8633d32b6c05.mp3',
  time: 20,
  currentTime: 0
}]

var tpls = ''

datas.forEach(function (item, index) {
  tpls += addTpl(item, index)
})

var appEle = $('#app')
appEle.append(tpls)

appEle.delegate('.play', 'click', function (event) {
  var id = $(event.target).parents('li').attr('data-id')
  play(id)
})

appEle.delegate('.pause', 'click', function (event) {
  var id = $(event.target).parents('li').attr('data-id')
  pause(id)
})

appEle.delegate('.destory', 'click', function (event) {
  var id = $(event.target).parents('li').attr('data-id')
  destory(id, function (playItem) {
    console.log(playItem)
  })
})

appEle.delegate('.replace', 'click', function (event) {
  var id = $(event.target).parents('li').attr('data-id')
  replaceVoice(id, 'http://oe72nssoc.bkt.clouddn.com/e7e3c17e-0dab-49b0-99fe-8ac4b6449b59.mp3')
})

var howls = new VoiceLive({
  datas: this.datas,
  step: function (itemId, currentTime, progress, duration) {
    console.log(duration)
    progress = (progress * 100).toFixed(2)
    if (progress > 99) {
      progress = 100.00
    }
    $('#currentTime-' + itemId).text(Math.floor(currentTime) + 's')
    $('#progress-' + itemId).text(progress + '%')
  },
  events: {
    onload: function () {
      console.log('onload')
    },
    onloaderror: function () {
      console.log('onloaderror')
    },
    onplay: function () {
      console.log('onplay')
    },
    onpause: function () {
      console.log('onpause')
    },
    onstop: function () {
      console.log('onstop')
    },
    onend: function () {
      this.playNext(3) // for auto play next item
      console.log('onend')
    }
  }
})

$(document.body).delegate('.destory-all', 'click', function () {
  howls.destory(function (playLists) { // 需要再所有音频停止播放的时候调用，否则触发下一条重新初始化，然后继续播放
    console.log(playLists)
  })
})

$(document.body).delegate('.add-voice', 'click', function () {
  var voice = {
    id: ++idRound,
    src: 'http://oe72nssoc.bkt.clouddn.com/8aa14d97-ba07-4a0f-a4a5-176508a40267.mp3',
    time: 26,
    currentTime: 0
  }
  howls.addVoice(voice)
  appEle.append(addTpl(voice, datas.length - 1))
})

function play (id) {
  howls.play(id)
};

function pause (id) {
  howls.pause(id)
};

function destory (id, callback) {
  howls.destory(id, callback)
};

function replaceVoice (id, src) {
  howls.replaceVoice(id, src)
};

function addTpl (item, index) {
  var tpls = ''
  var time = item.time
  if (item.time < 10) {
    time = '0' + item.time
  }
  tpls += '<li data-id="' + item.id + '"> \
      NO. ' + index + ' (' + time + 's): \
      <span class="play handle">play</span> \
      <span class="pause handle">pause</span> \
      <span class="replace handle">replace</span> \
      <span class="destory handle last">destory</span> \
      <span class="view first">time: <span id="currentTime-' + item.id + '"></span></span> \
      <span class="view">progress: <span id="progress-' + item.id + '"></span></span> \
    </li>'
  return tpls
}
