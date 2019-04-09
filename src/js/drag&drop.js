function main() {
  let container = document.querySelectorAll('.draggable');
  container.forEach(container => {
    container.addEventListener('drop', drop);
    container.addEventListener('dragover', dragover);
    for (let item of container.children) {
      draggableEvent(item);
    }
  });
}

function draggableEvent(item) {
  item.draggable = true;
  item.addEventListener('dragstart', dragstart);
}

function drop(event) {
  let id = event.dataTransfer.getData('text');
  let item = document.querySelector(`[data-id="${id}"]`);
  if (!item) return false;
  let target = event.target;
  if (target.tagName === 'LI') target = target.parentNode;
  let clone = item.cloneNode(true);
  draggableEvent(clone);
  target.appendChild(clone);
  item.parentNode.removeChild(item);
  player(clone.getAttribute('data-src'));
}

function dragover(event) {
  event.preventDefault();
}

function dragstart(event) {
  let id = event.target.getAttribute('data-id');
  event.dataTransfer.setData('text', id);
}
main();