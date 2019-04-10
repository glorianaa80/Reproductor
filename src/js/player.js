
const track = document.getElementById('track');
const progress = document.getElementById('progress');
const play = document.getElementById('play');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const nameSong = document.getElementById('name-song');
const singer = document.getElementById('singer');
const albumSong = document.getElementById('albumSong');
const art = document.getElementById('art');
let currentTrack = 0;
let song;
let audio;
let duration;
let playing = false;

document.addEventListener('load', play);

function player(index) {
  song = inventory[index];
  audio = new Audio();
  audio.src = song.songs;
  nameSong.textContent = song.name;
  singer.textContent = song.artist;
  albumSong.textContent = song.album;
  art.src = song.image;
  cargarListeners();
}

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

function seekSong(audio) {
  audio.currentTime = progress.value;
  audio.currentTime.textContent = FormatTime(song.currentTime);
  console.log(FormatTime(audio.currentTime));
}


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
  currentTrack = currentTrack % (inventory.length);
  song = inventory[currentTrack];
  audio.src = song.songs;
  audio.onloadeddata = function () {
    updateInfo();
  }
}

function prevTrack() {
  currentTrack--;
  currentTrack = (currentTrack == -1 ? (inventory.length - 1) : currentTrack);
  song = inventory[currentTrack];
  audio.src = song.songs;
  audio.onloadeddata = function () {
    updateInfo();
  }
}

function updateInfo() {
  nameSong.textContent = song.name;
  singer.textContent = song.artist;
  albumSong.textContent = song.album;
  art.src = song.image;
  art.onload = function () {
    audio.play();
  }
}

function FormatTime(time) {
  if (time === 0) return '00:00';
  let secs = Math.round(time);

  let minutesDivisor = secs % (60 * 60);
  let minutes = Math.floor(minutesDivisor / 60);

  let secondsDivisor = minutesDivisor % 60;
  let seconds = Math.ceil(secondsDivisor);
  minutes = minutes ? (minutes < 10 ? `0${minutes}` : minutes) : '00';
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${seconds}`;
}
