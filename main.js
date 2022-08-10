const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var heading = $('header h2');
var cdthumb = $('.cd-thumb');
var audio = $('#audio');
var cd = $('.cd');
var playlist = $('.playlist');
var playbtn = $('.btn-toggle-play');
var player = $('.player');
var progress = $('#progress');
var nextBtn = $('.btn-next');
var prevBtn = $('.btn-prev');
var randomBtn = $('.btn-random');
var repeatBtn = $('.btn-repeat');
var newIndex;

const app = {
  currentIndex: 1,
  _this: this,
  isRandom: false,
  isRepeat: false,
  isPlaying: false,
  songs: [
    {
      name: 'Em nên dừng lại',
      singer: 'Chung Tình',
      path: './accsets/music/song1.mp3',
      image: './accsets/image/em-nen-dung-lai-remix-khang-viet.jpg'
    },
    {
      name: 'Khả Năng (可能)',
      singer: 'Trình Hưởng',
      path: './accsets/music/song2.mp3',
      image: './accsets/image/khanang.jpg'
    },
    {
      name: 'Yêu Lần Nữa Không',
      singer: 'A.C Xuân Tài; Thanh Maii',
      path: './accsets/music/song3.mp3',
      image: './accsets/image/yeu-lan-nua-khong.jpg'
    },
    {
      name: 'Lạc Trôi (Masew Mix)',
      singer: 'Sơn Tùng M-TP',
      path: './accsets/music/Lac-Troi-Masew-Mix-Son-Tung-M-TP-Masew.mp3',
      image: './accsets/image/lac-troi.jpg'
    },
    {
      name: 'Anh Sai Rồi',
      singer: 'Sơn Tùng M-TP',
      path: './accsets/music/Anh-Sai-Roi-Son-Tung-M-TP.mp3',
      image: './accsets/image/anhsairoi.jpg'
    },
    {
      name: 'That Girl',
      singer: ' Olly Murs',
      path: './accsets/music/song4.mp3',
      image: './accsets/image/thatgirl.jpg'
    },
    {
      name: 'Reality',
      singer: 'Lost Frequencies ft.Janieck Devy',
      path: './accsets/music/Reality-Lost-Frequencies-Janieck-Devy.mp3',
      image: './accsets/image/reality.jpg'
    },
    {
      name: 'That Girl VN',
      singer: 'Cover Cao Tùng Anh',
      path: './accsets/music/That-Girl-Vietnamese-Version-Cover-Cao-Tung-Anh.mp3',
      image: './accsets/image/sondang.jpg'
    }
  ]
  ,
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  }
  ,
  handleEvent: function () {
    //hàm dùng chung
    var playCallback = function () {
      audio.play();
      player.classList.add('playing');
      _this.isPlaying = true;
      cdthumbAnimate.play();
      _this.render();
    }
    //xử lý khi bài hát đc click
    playlist.onclick = function (e) {
      var songnode = e.target.closest('.song:not(.active)');
      if (songnode || (e.target.closest('.option'))) {
        if (songnode) {
          _this.currentIndex = Number(songnode.dataset.index);
          _this.loadCurrentSong();
          playCallback();
        }
        if (e.target.closest('.option')) {

        }
      }
    }
    //xử lý play and pause CD
    const cdthumbAnimate = cdthumb.animate([{
      transform: 'rotate(360deg)',

    }
    ], {
      duration: 10000,
      iterations: Infinity
    })
    cdthumbAnimate.pause();

    //xử lý phóng to thu nhỏ khi User scroll
    var cdWidth = cd.offsetWidth;
    const _this = this;
    document.onscroll = function () {
      var newWidth = cdWidth - window.scrollY || document.body.scrollTop;
      cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
      cd.style.opacity = newWidth / cdWidth;
    };
    //Xử khi user click onpause or onplay audio
    playbtn.onclick = function () {
      if (!_this.isPlaying) {
        playCallback();
      }
      else {
        audio.pause();
        _this.isPlaying = false;
        player.classList.remove('playing');
        cdthumbAnimate.pause();
      }
    };
    //khi tiến độ bài hát bị thay đổi
    audio.ontimeupdate = function () {
      var progresspercent = (((audio.currentTime / audio.duration) * 100));
      progress.value = progresspercent;
    };
    //xử lý khi tua song
    progress.onchange = function (e) {
      var seektime = audio.duration / 100 * e.target.value;
      audio.currentTime = seektime;
    }
    //khi click next sẽ chuyển bài kế tiếp
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      }
      else {
        _this.nextSong();
      };
      playCallback();
    }
    prevBtn.onclick = function () {
      _this.prevSong();
      playCallback();
    }
    //xử lý random bài hát
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle('active', _this.isRandom);
      repeatBtn.classList.remove('active');
      _this.isRepeat = false;
    }
    audio.onended = function () {
      if (!_this.isRepeat) {
        nextBtn.click();
      }
      else {
        _this.loadCurrentSong();
        playCallback();
      }
    }
    //xử lý khi lặp lại 1 bài hát
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle('active', _this.isRepeat);
      _this.isRandom = false;
      randomBtn.classList.remove('active');
    }
  }
  ,
  render: function () {
    var html = '';
    this.songs.map(function (song, index) {
      html += `<div class="song ${index === app.currentIndex ? 'active' : ''}" data-index="${index}">
  <div class="thumb" style="background-image: url('${song.image}')">
  </div>
  <div class="body">
    <h3 class="title">${song.name}</h3>
    <p class="author">${song.singer}</p>
  </div>
  <div class="option">
    <i class="fas fa-ellipsis-h"></i>
  </div>
</div>` });
    playlist.innerHTML = html;
  },
  loadCurrentSong: function () {
    // console.log(this.currentSong);
    heading.textContent = this.currentSong.name;
    cdthumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  }
  ,
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    newIndex = this.currentIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    }
    while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    //định nghĩa các thuộc tính
    this.defineProperties();
    //xử lý sự kiện
    this.handleEvent();
    //load bài hát hiện tại cho UI khi mới chạy ứng dụng
    this.loadCurrentSong();
    //hiển thị danh sách các bài hát ra giao diện
    this.render();

  }
}

app.start();
