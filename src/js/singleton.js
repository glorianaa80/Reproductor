const w = (function() {
  let insta = null;
  return class Singleton {
    constructor(){
     this.songs = inventory; 
     return insta ? insta : insta = this;
    }
  }
})();

let k = new w();
console.log(k.songs)