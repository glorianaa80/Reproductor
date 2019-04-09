(function () {

	const KEYS = ['name'];
	let removeBtn = null;
	let editBtn = null;
	let ul = null;
	let ul2 = null;
	let selected = null;
	// const hola = getAttribute('data-id');

	function removeSong() {
		let index = null;
		if (selected) {
			index = selected.getAttribute('data-id');
			item = inventory[index];
		}

		let content = document.createElement('div');

		let dialog = createDialog({
			title: 'Delete Song',
			content: content,
			saveText: 'Delete',
		});


		dialog.showModal();

	}

	function createDialog({
		title,
		content,
		cancelText = 'Cancel',
		saveText = 'Delete',
		oncancel,
		onsave }) {
		let dialog = document.createElement('dialog');
		let header = document.createElement('header');


		if (typeof title === 'string') {
			let h1 = document.createElement('h1');
			h1.innerText = title;
			header.appendChild(h1);
		}
		else header.appendChild(title);

		let p1 = document.createElement('p');
		p1.innerText = 'Are you sure you want to remove this song?';

		let p2 = document.createElement('p');
		p2.innerText = `This action will delete the song ${inventory[0].name}`;

		let p3 = document.createElement('p');
		p3.innerText = 'The song will be removed on all the playlist';


		let section = document.createElement('section');
		section.appendChild(p1)
		section.appendChild(p2)
		section.appendChild(p3)
		section.appendChild(typeof content === 'string' ? document.createTextNode(content) : content);


		let footer = document.createElement('footer');
		let cancelBtn = document.createElement('button');
		let saveBtn = document.createElement('button');
		saveBtn.setAttribute('id', '')


		cancelBtn.innerText = cancelText;
		saveBtn.innerText = saveText;

		cancelBtn.classList.add('mgnT');
		saveBtn.classList.add('mgnT');
		footer.appendChild(cancelBtn);
		footer.appendChild(saveBtn);


		if (typeof oncancel === 'function')
			cancelBtn.addEventListener('click', oncancel);

		if (typeof onsave === 'function')
			saveBtn.addEventListener('click', onsave);


		cancelBtn.addEventListener('click', close);
		saveBtn.addEventListener('click', remove);
		saveBtn.addEventListener('click', close);


		dialog.appendChild(header);
		dialog.appendChild(section);
		dialog.appendChild(footer);


		document.body.appendChild(dialog);

		return dialog;

		function close() {
			dialog.close();
			document.body.removeChild(dialog);
		}
	}

	function renderTable(data = inventory) {
		ul.innerHTML = '';
		data.forEach((item, index) => ul.appendChild(composeRow(item, index)));

		if (selected) {
			let li = li.querySelector(`li[data-index="${selected.getAttribute('data-index')}"]`);
			if (li) {
				selected = li;
				selected.classList.add('selected');
			}
		}
	}

	function composeRow(item, index) {
		let li = document.createElement('li');

		li.setAttribute('data-id', index);
		li.setAttribute('draggable', true);
		li.setAttribute('data-src', inventory[index].id);
		li.appendChild(composeTd(item.name));

		let keys = Object.keys(item);


		let summary = keys.filter(key => !!item[key] || !KEYS.includes(key))
			.map(key => `${key}: ${item[key]}`);
		return li;
	}

	function composeTd(text) {
		let span = document.createElement('span');
		span.innerText = text;
		return span;
	}

	function search(event) {
		if (!inventory.length) return;

		let text = event.target.value;

		text = new RegExp(text, 'i');

		let data = inventory.filter(item => text.test(item.name));


		renderTable(data);
	}


	function select(event) {
		let li = event.target.parentNode;


		if (selected) selected.classList.remove('selected');


		if (selected && selected.getAttribute('data-id') === li.getAttribute('data-id')) {
			selected = null;
		}

		else {
			selected = li;
			selected.classList.add('selected');
		}

		toggleButtons(!selected);
	}

	function toggleButtons(hidden) {
		editBtn.hidden = hidden;
		removeBtn.hidden = hidden;
	}


	function remove() {
		var lis = document.querySelectorAll('li');
		for(var i=0; li=lis[i]; i++) {
			if(li.className === 'selected') {
				li.parentNode.removeChild(li);
			}
		}
	}


	function init() {
		editBtn = document.getElementById('edit');
		removeBtn = document.getElementById('delete');
		ul = document.getElementById('column');
		ul2 = document.getElementById('column-2');

		let searchInput = document.getElementById('space');

		ul.addEventListener('click', select);
		ul2.addEventListener('click', select);
		removeBtn.addEventListener('click', removeSong);
		searchInput && searchInput.addEventListener('keyup', search);

		renderTable();
	}
	init();
})();
