(function(){
  const tabs = Array.prototype.slice.apply(document.querySelectorAll('.tabs-item'));
  const contents = Array.prototype.slice.apply(document.querySelectorAll('.content-item'));
  
  function changeTabs(e) {
    if (e.target.classList.contains('tabs-item')) {
      const i = tabs.indexOf(e.target);
      tabs.map(tab => tab.classList.remove('active'));
      tabs[i].classList.add('active');
      contents.map(content => content.classList.remove('active'));
      contents[i].classList.add('active');
    }
  }

  document.getElementById('js-tabs').addEventListener('click', changeTabs);

})();