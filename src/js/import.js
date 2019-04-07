const btnSave = document.getElementById('save');
const name1 = document.getElementById('name');
const artist1 = document.getElementById('artist');
const year1 = document.getElementById('year');
const album1 = document.getElementById('album');
const image1 = document.getElementById('image');
const mp31 = document.getElementById('mp3');
const wav1 = document.getElementById('WAV');
const ogg1 = document.getElementById('OGG');
let ul = document.getElementById('column');


function save() {
  let fila = document.createElement('li');  
  const nuevaFila = {
    id:'12',
    name: name1.value,
    artist: artist1.value,
    year: year1.value,
    album: album1.value,
    image: image1.value,
    mp3: mp31.value,
    wav: wav1.value,
    ogg: ogg1.value,
  };
  inventory.push(nuevaFila);
  console.log(inventory)
  fila.setAttribute('draggable', true)
  for (let i = 0; i < inventory.length; i += 1) {
    fila.innerText = inventory[i].name;
  };


  ul.innerHTML = fila;
}

btnSave.addEventListener('click', save);