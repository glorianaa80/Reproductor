const form = document.querySelector('#form');
const ul = document.getElementById('column');

function createItem (name, artist, album, year, mp3, image, wav, ogg) {
  let item = {
    name: name,
    artist: artist,
    album: album,
    year: year,
    songs:`songs/${mp3}`,
    image: image,
    wav:`songs/${wav}`,
    ogg:`songs/${ogg}`,
  }

  inventory.push(item);
  return item;
}

function save() {
  localStorage.setItem('Data-Song', JSON.stringify(inventory));
  printDOM();
}

function printDOM() {
  // ul.innerHTML = '';
  inventory = JSON.parse(localStorage.getItem('Data-Song'));

  if(inventory === null){
    inventory = [];
  } else {
    inventory.forEach(element => {
     ul.innerHTML += `<li data-id="" draggable="true" data-src=""><span>${element.name}</span></li>`
      
    })
  }
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

  createItem(name1, artist1, album1, year1, mp31, image1, wav1, ogg1);
  save();
  form.reset();
});
console.log(inventory);

document.addEventListener('DOMContentLoaded', printDOM);
