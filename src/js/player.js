const player = (function () {
  const request = new XMLHttpRequest();
  let response;
  let holding = false;
  const track = document.getElementById('track');
  const progress = document.getElementById('progress');
  const play = document.getElementById('play');
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');
  const nameSong = document.getElementById('name-song');
  const singer = document.getElementById('singer');
  const art = document.getElementById('art');
  let currentTrack = 0;
  let song;
  let audio;
  let duration;
  let playing = false;

  request.addEventListener('load', (event) => {
    response = event.target.response;
    song = response[currentTrack];
    audio = new Audio();
    audio.src = song.song;
    nameSong.textContent = song.name;
    singer.textContent = song.artist;
    art.src = song.image;
    cargarListeners();
  });

  function cargarListeners() {
    audio.addEventListener('timeupdate', updateTrack, false);
    audio.addEventListener('loadedmetadata', function () {
      duration = this.duration;
    }, false);

    track.onmousedown = function (e) {
      holding = true;
      seekTrack(e);
    }
    play.onclick = function () {
      playing ? audio.pause() : audio.play();
      playing = !playing;
    }
    audio.addEventListener("pause", function () {
      play.innerHTML = '<img class="pad" src="img/play.svg"/>';
      playing = false;
    }, false);

    audio.addEventListener("playing", function () {
      play.innerHTML = '<img src="img/pause.svg"/>';
      playing = true;
    }, false);
    next.addEventListener("click", nextTrack, false);
    prev.addEventListener("click", prevTrack, false);
  }

  request.responseType = 'json';
  request.open('GET', '/data.json');
  request.send();

  function updateTrack() {
    const curtime = audio.currentTime;
    const percent = Math.round((curtime * 100) / duration);
    progress.style.width = percent + '%';
    handler.style.left = percent + '%';
  }

  function seekTrack(e) {
    event = e || window.event;
    const x = e.pageX - player.offsetLeft - track.offsetLeft;
    percent = Math.round((x * 100) / track.offsetWidth);
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;
    progress.style.width = percent + '%';
    handler.style.left = percent + '%';
    audio.play();
    audio.currentTime = (percent * duration) / 100
  }

  function nextTrack() {
    currentTrack++;
    currentTrack = currentTrack % (response.length);
    song = response[currentTrack];
    audio.src = song.song;
    audio.onloadeddata = function () {
      updateInfo();
    }
  }

  function prevTrack() {
    currentTrack--;
    currentTrack = (currentTrack == -1 ? (response.length - 1) : currentTrack);
    song = response[currentTrack];
    audio.src = song.song;
    audio.onloadeddata = function () {
      updateInfo();
    }
  }

  function updateInfo() {
    nameSong.textContent = song.name;
    singer.textContent = song.artist;
    art.src = song.image;
    art.onload = function () {
      audio.play();
    }
  }

  function FormatTime (time) {
		if(time === 0) return '00:00';
		let secs = Math.round(time);
		// let hours = Math.floor(secs / (60 * 60));

		let minutesDivisor = secs % (60 * 60);
		let minutes = Math.floor(minutesDivisor / 60);

		let secondsDivisor = minutesDivisor % 60;
		let seconds = Math.ceil(secondsDivisor);

		// hours = hours ? (hours < 10 ? `0${hours}` : hours) : '--';
		minutes = minutes ? (minutes < 10 ? `0${minutes}` : minutes) : '00';
		seconds = seconds < 10 ? `0${seconds}` : seconds;

		return `${minutes}:${seconds}`;
}
})();