const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "PLAYER";
const playlist = $(".playlist");
const dashboard = $(".dashboard");
const cd = $(".cd");
const header = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBTN = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const startTime = $(".start-time");
const endTime = $(".end-time");
const volumeBlock = $(".volume-block");
const hightVolumeBtn = $(".btn-volume-high");
const muteVolumeBtn = $(".btn-volume-mute");
const volumeProgress = $(".volume-progress");
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isDraggingProcess: false,
    currentVolume: 0,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: "See tình",
            singer: "Hoàng Thùy Linh",
            path: "./music/Hoang Thuy Linh See Tinh  .mp3",
            image: "./img/seetinh.jpg",
            background:
                "https://img.docbao.vn/images/uploads/2023/04/13/sao/see-tinh.jpg",
        },
        {
            name: "Kẻ cắp gặp bà già",
            singer: "Hoàng Thùy Linh",
            path: "./music/Hoang Thuy Linh Ke Cap Gap Ba Gia .mp3",
            image: "https://bazaarvietnam.vn/wp-content/uploads/2020/04/ke-cap-gap-ba-gia.jpg",
            background:
                "https://mediacms.thethaovanhoa.vn/Upload/qPf4BjfjvkrFearu8hrw/files/2020/03/92212920_10157335551897055_2473758432142819328_o.jpg",
        },
        {
            name: "Salt",
            singer: "Avamax",
            path: "./music/Salt Official .mp3",
            image: "./img/salt.jpg",
            background: "https://i.ytimg.com/vi/TTaTni6y464/maxresdefault.jpg",
        },
        {
            name: "Sweet but psychol",
            singer: "Avamax",
            path: "./music/Ava Max Sweet but Psycho Official Music Video.mp3",
            image: "./img/Ava_Max_–_Sweet_but_Psycho.png",
            background:
                "https://static.qobuz.com/images/covers/sc/ak/i2qsbm5kiaksc_600.jpg",
        },
        {
            name: "2002",
            singer: "Anne marie",
            path: "./music/2002 Official Video.mp3",
            image: "https://i.ytimg.com/vi/AQEqT-o0yBo/maxresdefault.jpg",
            background:
                "https://home.voca.vn/assets/img/upload/images/Loi-dich-bai-hat-2002.jpg",
        },
        {
            name: "Flower",
            singer: "Miley Cyrus",
            path: "./music/Flowers-Miley-Cyrus.mp3",
            image: "./img/flower.jpg",
            background: "https://i.ytimg.com/vi/7V3jqsIe8c0/maxresdefault.jpg",
        },
        {
            name: "Hồi kết",
            singer: "Hà Nhi",
            path: "./music/Hoi-Ket-Ha-Nhi.mp3",
            image: "https://images2.thanhnien.vn/Uploaded/thynhm/2022_11_14/ha-nhi1-2501.jpg",
            background: "https://i.ytimg.com/vi/QqJ2VmZP010/maxresdefault.jpg",
        },
        {
            name: "Có em",
            singer: "Madihu",
            path: "./music/Madihu Co em Feat. Low G .mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2023/01/09/f/5/7/7/1673261552140_640.jpg",
            background: "https://i.ytimg.com/vi/DcCISK3sCYg/maxresdefault.jpg",
        },
        {
            name: "Vì anh đâu có biết",
            singer: "Madihu",
            path: "./music/Vi Anh Dau Co Biet Madihu Feat. Vu.mp3",
            image: "https://i.ytimg.com/vi/Z0S92UkrAbk/maxresdefault.jpg",
            background:
                "https://avatar-ex-swe.nixcdn.com/song/share/2022/08/05/a/9/1/b/1659667076562.jpg",
        },
        {
            name: "This is what you came for",
            singer: "Rihana",
            path: "./music/This Is What You Came For. Rihanna.mp3",
            image: "./img/thiswhatyoucf.jpg",
            background: "https://i.ytimg.com/vi/kOkQ4T5WO9E/maxresdefault.jpg",
        },
        {
            name: "Bật tình yêu lên",
            singer: "Hòa Minzy & Tăng Duy Tân",
            path: "./music/Bat-Tinh-Yeu-Len-Hoa-Minzy-x-Tang-Duy-Tan.mp3",
            image: "./img/btyl.jpg",
            background: "https://i.ytimg.com/vi/KUx2Pod0KJ4/maxresdefault.jpg",
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    // Hàm xử lý show danh sách bài hát ra màn hình
    render: function () {
        const html = this.songs.map((song, index) => {
            return `
        <div class="song ${
            index === this.currentIndex ? "active" : ""
        }" data-index=${index}>
                  <div class="thumb"
                      style="background-image: url('${song.image}')">
                  </div>
                  <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                  </div>
              </div>
        `;
        });
        playlist.innerHTML = html.join("");
    },
    // Định nghĩa thuộc tính bài hát đầu tiên
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    // Hàm bắt các sự kiện xảy ra
    handleEvent: function () {
        _this = this;
        // Thu nhỏ và làm mờ đĩa nhạc khi kéo thanh cuộn
        const cdWidth = cd.offsetWidth;
        // Quay CD
        const thumbAnimate = cdThumb.animate(
            [
                {
                    transform: "rotate(360deg)",
                },
            ],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );
        thumbAnimate.pause();
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
            cd.style.opacity = newWidth / cdWidth;
            volumeBlock.style.opacity = newWidth / cdWidth;
            volumeBlock.style.height = newWidth > 0 ? 36 + "px" : 0 + "px";
        };
        // Xử lý dừng , phát nhạc
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        // Khi nhạc được phát
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            thumbAnimate.play();
        };
        // Khi nhạc dừng
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            thumbAnimate.pause();
        };
        // Khi bài hát chạy bài thanh thời gian chạy
        audio.ontimeupdate = function () {
            if (!_this.isDraggingProcess && audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
                _this.startTimer(audio.currentTime);
                _this.endTimer();
                _this.setConfig("currentIndex", _this.currentIndex);
            }
        };
        // Khi tua bài hát
        progress.onclick = function (e) {
            const time = (e.target.value / 100) * audio.duration;
            audio.currentTime = time;
        };
        // Bắt sự kiện khi nhảy tới bài tiếp theo
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToInterview();
        };
        // Bắt sự kiện khi nhấn nút qua lại bài hát phía trước
        prevBTN.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToInterview();
        };
        // Khi bấm vào random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };
        // Khi phát hết 1 bài tự động chuyển bài
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };
        // Khi nhấn vào nút repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };
        // Chuyển bài khi nhấn vào song trên playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".option")) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        };
        // Trạng thái của isDraggingProgress khi nhấn chuột xuống
        progress.onmousedown = function () {
            _this.isDraggingProgress = true;
        };

        // Trạng thái của isDraggingProgress khi nhấn chuột lên
        progress.onmouseup = function () {
            _this.isDraggingProgress = false;
        };

        // Khi tua progress pc
        progress.onmousemove = function () {
            if (_this.isDraggingProgress) {
                let TimeSkip = (progress.value * audio.duration) / 100;
                _this.startTimer(TimeSkip);
            }
        };
        // Khi tua progress điện thoại
        progress.ontouchmove = function () {
            if (_this.isDraggingProgress) {
                let TimeSkip = (progress.value * audio.duration) / 100;
                _this.startTimer(TimeSkip);
            }
        };
        // Khi nhấn vào biểu tượng để mute và mở âm thanh
        hightVolumeBtn.onclick = function () {
            hightVolumeBtn.style.display = "none";
            muteVolumeBtn.style.display = "inline-block";
            audio.volume = 0;
        };
        muteVolumeBtn.onclick = function () {
            hightVolumeBtn.style.display = "inline-block";
            muteVolumeBtn.style.display = "none";
            _this.currentVolume = volumeProgress.value / 100;
            audio.volume = _this.currentVolume;
        };
        // Chỉnh kéo âm thanh
        volumeProgress.onmousemove = function () {
            _this.currentVolume = volumeProgress.value / 100;
            audio.volume = _this.currentVolume;
            if (_this.currentVolume == 0) {
                hightVolumeBtn.style.display = "none";
                muteVolumeBtn.style.display = "inline-block";
            } else {
                hightVolumeBtn.style.display = "inline-block";
                muteVolumeBtn.style.display = "none";
            }
            _this.setConfig("currentVolume", _this.currentVolume);
        };
        // Tua trên điện thoại
        volumeProgress.ontouchmove = function () {
            _this.currentVolume = volumeProgress.value / 100;
            audio.volume = _this.currentVolume;
            if (_this.currentVolume == 0) {
                hightVolumeBtn.style.display = "none";
                muteVolumeBtn.style.display = "inline-block";
            } else {
                hightVolumeBtn.style.display = "inline-block";
                muteVolumeBtn.style.display = "none";
            }
            _this.setConfig("currentVolume", _this.currentVolume);
        };
        volumeProgress.onclick = function () {
            audio.volume = volumeProgress.value / 100;
        };
    },
    // Chuyển đến bài đc active
    scrollToInterview: function () {
        $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
        });
    },
    // Load config
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.currentVolume = this.config.currentVolume;
        this.currentIndex = this.config.currentIndex;
        this.currentIndex =
            typeof this.config.currentIndex === "undefined"
                ? 0
                : this.config.currentIndex;
    },
    // nhảy đến bài hát tiếp theo
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    // Nhảy tới bài hát phía trước
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    // Random bài hát
    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    // Load bài hát hiện tại thay đổi thông tin UI
    loadCurrentSong: function () {
        header.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
        audio.src = this.currentSong.path;
        dashboard.style.backgroundImage = `url("${this.currentSong.background}")`;
    },
    // Bắt đầu chạy time
    startTimer: function (e) {
        let startMinute = Math.floor(e / 60);
        let startSecond = Math.floor(e % 60);

        let displayStartMinute =
            startMinute < 10 ? "0" + startMinute : startMinute;
        let displayStartSecond =
            startSecond < 10 ? "0" + startSecond : startSecond;

        startTime.textContent = displayStartMinute + " : " + displayStartSecond;
    },

    // Time end

    endTimer: function () {
        let endMinute = Math.floor(audio.duration / 60);
        let endSecond = Math.floor(audio.duration % 60);

        let displayEndMinute = endMinute < 10 ? "0" + endMinute : endMinute;
        let displayEndSecond = endSecond < 10 ? "0" + endSecond : endSecond;

        endTime.textContent = displayEndMinute + " : " + displayEndSecond;
    },
    start: function () {
        // Load config
        this.loadConfig();
        // Định nghĩa các thuộc tính cho object để lấy ra bài hát hiện tại
        this.defineProperties();
        // Gọi hàm lắng nghe sự kiện
        this.handleEvent();
        // Load bài hát hiện tại
        this.loadCurrentSong();
        // Gọi hàm render
        this.render();
        // Hiển thị trạng thái
        randomBtn.classList.toggle("active", _this.isRandom);
        repeatBtn.classList.toggle("active", _this.isRepeat);
        volumeProgress.value = _this.currentVolume * 100;
        if (_this.currentVolume == 0) {
            hightVolumeBtn.style.display = "none";
            muteVolumeBtn.style.display = "inline-block";
        } else {
            hightVolumeBtn.style.display = "inline-block";
            muteVolumeBtn.style.display = "none";
        }
    },
};
app.start();
