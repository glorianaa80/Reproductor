const form = document.querySelector('#form');
const ul = document.getElementById('column');

function createItem (name, artist, album, year, mp3, image, wav, ogg) {
  let item = {
    name: name,
    artist: artist,
    album: album,
    year: year,
    songs: mp3,
    image: image,
    wav: wav,
    ogg: ogg,
  };

  inventory.push(item);
  return item;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name1 = document.getElementById('name').value;
  const artist1 = document.getElementById('artist').value;
  const album1 = document.getElementById('album').value;
  const year1 = document.getElementById('year').value;
  const mp31 = document.getElementById('mp3').value;
  const image1 = document.getElementById('image').value;
  const wav1 = document.getElementById('WAV').value;
  const ogg1 = document.getElementById('OGG').value;

  function save() {
    const li = document.createElement('li');
    const span = document.createElement('span');
    li.setAttribute('draggable', true);
    span.innerHTML = name1;
    li.appendChild(span);
    ul.appendChild(li);
  }
  save();
  // drop();
  createItem(name1, artist1, album1, year1, mp31, image1, wav1, ogg1);
  form.reset();

});