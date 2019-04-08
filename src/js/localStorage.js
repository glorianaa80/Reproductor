const TodoData = (function () {
  // private
  const PREFIX = 'TODO_DATA';
  let DATA = [];

  let instance = null;

  return class TodoData {
    static Subscriptions = Object.freeze({
      'TODO_ADDED': Symbol('TODO_ADDED'),
      'TODO_DONE': Symbol('TODO_DONE'),
    });

    constructor() {
      if (!instance) {
        this.restore();
        instance = this;
      }
      return instance;
    }

    /**
     * Returns the todo list
     * @returns {Array}
     */
    get todo() {
      return DATA.filter(item => !item.done);
    }

    /**
     * Returns the done list
     * @returns {Array}
     */
    get done() {
      return DATA.filter(item => item.done);
    }

    /**
     * Finds a todo list
     * @param {number} id
     * @returns {null|array}
     */
    get(id) {
      return DATA.find(item => item.id == id);
    }

    /**
     * Add a new todo
     * @param {TodoItem} todo
     */
    add(todo) {
      if (!todo || !(todo instanceof TodoItem))
        throw new Error(`Invalid todo: ${todo}`);

      // add the todo
      DATA.push(todo);

      // save the data into the localstorage
      this.save();

      Mediator.Publish(TodoData.Subscriptions.TODO_ADDED, todo);
    }

    /**
     * Remove a todo
     * @param {TodoItem} todo
     */
    remove(todo) {
      let idx = DATA.findIndex(i => i === todo);
      if (idx > -1) DATA.splice(idx, 1);
    }

    toggleItem(todo) {
      todo.done = !todo.done;

      this.save();

      if (todo.done) Mediator.Publish(TodoData.Subscriptions.TODO_DONE, todo);
    }

    save() {
      console.log('save')
      try {
        let data = JSON.stringify(DATA.map(i => i.toObject()));
        localStorage.setItem(PREFIX, data);
      } catch (error) {
        console.error(`Can not save the todo data into the localstorage.`);
      }
    }

    restore() {
      try {
        let data = localStorage.getItem(PREFIX);
        if (data) {
          data = JSON.parse(data);
          if (Array.isArray(data)) {
            DATA = data.map(item => new TodoItem(item.text, item.done));
          }
        }
      } catch (err) {
        console.error(`Can not get the todo data into the localstorage.`);
      }
    }
  }
})();