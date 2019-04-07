// iife
(function () {

  const KEYS = ['name']; 
	let removeBtn = null;
	let editBtn = null;
	let ul = null;
	let ul2 = null;
	let selected = null;

	function removeSong() {
		let item = null;
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

		// dialog.open = true;
		dialog.showModal();

	}

	/**
	 * Compose a dialog
	 * @param {Object} config {title, content}
	 * @returns {HTMLElement} dialog
	 */
	function createDialog({
		title,
		content,
		cancelText = 'Cancel',
		saveText = 'Delete',
		oncancel,
		onsave }) {
		let dialog = document.createElement('dialog');
		let header = document.createElement('header');

		// title is string uses a H1 element
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

		// dialog content
    let section = document.createElement('section');
    section.appendChild(p1)
    section.appendChild(p2)
    section.appendChild(p3)
		section.appendChild(typeof content === 'string' ? document.createTextNode(content) : content);
    
		// dialog footer
		let footer = document.createElement('footer');
		let cancelBtn = document.createElement('button');
		let saveBtn = document.createElement('button');

		// dialog buttons
		cancelBtn.innerText = cancelText;
		saveBtn.innerText = saveText;

		cancelBtn.classList.add('mgnT');
		saveBtn.classList.add('mgnT');
		footer.appendChild(cancelBtn);
		footer.appendChild(saveBtn);

		// custom buttons events
		if (typeof oncancel === 'function')
			cancelBtn.addEventListener('click', oncancel);

		if (typeof onsave === 'function')
			saveBtn.addEventListener('click', onsave);

		// default buttons events
		cancelBtn.addEventListener('click', close);
		saveBtn.addEventListener('click', close);

		// adds the dialog header, content and footer
		dialog.appendChild(header);
		dialog.appendChild(section);
		dialog.appendChild(footer);

		// add the dialog to the body
		document.body.appendChild(dialog);

		return dialog;

		function close() {
			dialog.close();
			document.body.removeChild(dialog);
		}
	}

	/**
	 * Compose a label and input
	 * @param {Object} config {name, type, placeholder, remove, value}
	 * @returns {{label: HTMLElement, input: HTMLElement}}
	 */
	function createInput({ name, type = 'text', placeholder, remove, value = null }) {
		if (!name) throw new Error(`Invalid name on config: ${name}`);



		// set the value of the input

		let div = document.createElement('div');
		div.appendChild(p1);
		div.appendChild(p2);

		if (remove) {
			let btn = document.createElement('button');
			btn.innerText = 'Remove';

			if (typeof remove === 'function')
				btn.addEventListener('click', remove);

			div.appendChild(btn);
		}

		console.log('div', div);
		return div;
	}

	/**
	 * Render the table body
	 * @param {Array} data
	 */
	function renderTable(data = inventory) {
		ul.innerHTML = '';
		data.forEach((item, index) => ul.appendChild(composeRow(item, index)));

		// there is a selected row
		if (selected) {
			// finds the row to select and add the selected class
			let li = li.querySelector(`li[data-index="${selected.getAttribute('data-index')}"]`);
			if (li) {
				selected = li;
				selected.classList.add('selected');
			}
		}
	}

	/**
	 * Compose the table tr and tds for the item
	 * @param {Object} item
	 * @param {Number} index
	 * @returns {HTMLElement}
	 */
	function composeRow(item, index) {
		let li = document.createElement('li');

    li.setAttribute('data-id', index);
    li.setAttribute('draggable', true);
		li.appendChild(composeTd(item.name));

		// gets all the items object keys
		let keys = Object.keys(item);

		// filter and ingores the name, price and date keys
		// and compose the summary
		let summary = keys.filter(key => !!item[key] || !KEYS.includes(key))
			.map(key => `${key}: ${item[key]}`);
		return li;
	}

	function composeTd(text) {
		let span = document.createElement('span');
		span.innerText = text;
		return span;
	}

	/**
	 * Search into the inventory
	 */
	function search(event) {
		if (!inventory.length) return;

		let text = event.target.value;

		text = new RegExp(text, 'i');

		let data = inventory.filter(item => text.test(item.name));

		// refresh the table body
		renderTable(data);
	}

	/**
	 * Selects the table body row on click
	 * @param {Event} event
	 */
	function select(event) {
		let li = event.target.parentNode;

		// reset previous selected row
		if (selected) selected.classList.remove('selected');

		// previous selected row is the same as the new selected row
		if (selected && selected.getAttribute('data-id') === li.getAttribute('data-id')) {
			selected = null; // unselect the row
		}
		// new row selected
		else {
			selected = li;
			selected.classList.add('selected');
		}

		toggleButtons(!selected);
	}

	/**
	 * Toogle the hidden values for the action buttons
	 */
	function toggleButtons(hidden) {
		editBtn.hidden = hidden;
		removeBtn.hidden = hidden;
	}

	/**
	 * Init the selectors
	 */
	function init() {
		editBtn = document.getElementById('edit');
		removeBtn = document.getElementById('delete');
		ul = document.getElementById('column');
		ul2 = document.getElementById('column-2');

		let searchInput = document.getElementById('space');

		// eventss
		ul.addEventListener('click', select);
		ul2.addEventListener('click', select);
		removeBtn.addEventListener('click', removeSong);
		searchInput && searchInput.addEventListener('keyup', search);

		renderTable();
	}


	init();
})();