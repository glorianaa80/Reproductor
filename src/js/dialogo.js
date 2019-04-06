// iife
(function () {

  const KEYS = ['name', 'price', 'date'];
  const es = [];
  const en = [];

  let addBtn = null;
  let removeBtn = null;
  let qrBtn = null;
  let editBtn = null;
  let selected = null; // html node of selected tr

  /**
   * Display the add item dialog
   * @param {Event} event
   */
  function addItem(event) {
    let item = null;
    let index = null;
    if (selected) {
      index = selected.getAttribute('data-index');
      item = inventory[index];

      console.log('item', item);
    }

    let content = document.createElement('div');
    let form = document.createElement('form');

    let fieldBtn = document.createElement('button');
    fieldBtn.innerText = 'Add';
    let field = createInput({
      name: 'custom',
      placeholder: 'Add Field'
    });
    field.appendChild(fieldBtn);
    fieldBtn.addEventListener('click', addField);
    content.appendChild(field);

    let name = createInput({
      name: 'name',
      placeholder: 'Name',
      value: item ? item.name : null
    });
    let price = createInput({
      name: 'price',
      type: 'number',
      placeholder: 'Price',
      value: item ? item.price : null
    });
    let dateValue = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;
    let date = createInput({
      name: 'date',
      type: 'date',
      placeholder: 'Date',
      value: item ? item.date : dateValue
    });

    form.name = 'itemForm';
    form.appendChild(name);
    form.appendChild(price);
    form.appendChild(date);
    content.appendChild(form);

    let dialog = createDialog({
      title: item ? 'Edit Item' : 'Add Item',
      content: content,
      saveText: item ? 'Edit' : 'Save',
      onsave: save
    });

    // dialog.open = true;
    dialog.showModal();

    function save() {
      let data = {};
      let input = null;

      for (let i = 0; i < form.length; i++) {
        input = form[i];
        if (input.name) data[input.name] = input.value;
      }
      inventory.push(data);
      // dialog.open = false;
      dialog.close();

      renderTable();
    }

    /**
     *
     * @param event
     * @param key
     * @param value
     * @returns {boolean}
     */
    function addField(event, key, value) {
      let fieldName = key ? key : field.querySelector('input').value;
      if (!fieldName) return false;

      let input = createInput({
        name: fieldName,
        placeholder: fieldName,
        remove: () => form.removeChild(input),
      });

      if (value) input.value = value;

      form.appendChild(input);
    }
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
    saveText = 'Save',
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
    // header.appendChild(typeof title === 'string' ? document.createTextNode(title) : title);

    // dialog content
    let section = document.createElement('section');
    section.appendChild(typeof content === 'string' ? document.createTextNode(content) : content);

    // dialog footer
    let footer = document.createElement('footer');
    let cancelBtn = document.createElement('button');
    let saveBtn = document.createElement('button');

    // dialog buttons
    cancelBtn.innerText = cancelText;
    saveBtn.innerText = saveText;

    cancelBtn.classList.add('btn-cancel');
    saveBtn.classList.add('btn-sucess');
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
      console.log("default close method");
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

    let label = document.createElement('label');
    label.innerText = placeholder || name;

    let input = document.createElement('input');
    input.name = name;
    input.type = type;
    input.placeholder = placeholder || name;

    // set the value of the input
    if (value)
      input.setAttribute('value', value);

    let div = document.createElement('div');
    div.appendChild(label);
    div.appendChild(input);

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
    tbody.innerHTML = ''; // clear the the tbody
    data.forEach((item, index) => tbody.appendChild(composeRow(item, index)));

    // there is a selected row
    if (selected) {
      // finds the row to select and add the selected class
      let tr = tbody.querySelector(`tr[data-index="${selected.getAttribute('data-index')}"]`);
      if (tr) {
        selected = tr;
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
    console.log('item', item);
    let row = document.createElement('tr');

    // row.id = index;
    row.setAttribute('data-index', index);
    row.appendChild(composeTd(item.name));
    row.appendChild(composeTd(item.price));
    row.appendChild(composeTd(item.date));

    // gets all the items object keys
    let keys = Object.keys(item);

    // filter and ingores the name, price and date keys
    // and compose the summary
    let summary = keys.filter(key => !!item[key] || !KEYS.includes(key))
      .map(key => `${key}: ${item[key]}`);

    row.appendChild(composeTd(summary.join('\n')));
    return row;
  }

  function composeTd(text) {
    let td = document.createElement('td');
    td.innerText = text;
    return td;
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

    console.log('search', data);
  }

  /**
   * Selects the table body row on click
   * @param {Event} event
   */
  function selectRow(event) {
    let tr = event.target.parentNode;

    // reset previous selected row
    if (selected) selected.classList.remove('selected');

    // previous selected row is the same as the new selected row
    if (selected && selected.getAttribute('data-index') === tr.getAttribute('data-index')) {
      selected = null; // unselect the row
    }
    // new row selected
    else {
      selected = tr;
      selected.classList.add('selected');
    }

    toggleButtons(!selected);

    console.log('selected', selected);
  }

  /**
   * Toogle the hidden values for the action buttons
   */
  function toggleButtons(hidden) {
    editBtn.hidden = hidden;
    removeBtn.hidden = hidden;
    qrBtn.hidden = hidden;
  }

  /**
   * Init the selectors
   */
  function init() {
    editBtn = document.getElementById('editBtn');
    removeBtn = document.getElementById('removeBtn');
    qrBtn = document.getElementById('qrBtn');
    addBtn = document.getElementById('addBtn');
    tbody = document.getElementById('tableBody');
    nav = document.querySelector('nav');

    let searchInput = nav.querySelector('input');

    // events
    tbody.addEventListener('click', selectRow);
    editBtn.addEventListener('click', addItem);
    addBtn.addEventListener('click', addItem);
    searchInput && searchInput.addEventListener('keyup', search);

    renderTable();
  }

  init();
})();