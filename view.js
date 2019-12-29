const input = document.querySelector(".new-todo");
const ul = document.querySelector(".todo-list");
const clearCompletedButton = document.querySelector(".clear-completed");
const activeItemsLeft = document.querySelector(".todo-count");

document.querySelector(".new-todo").addEventListener("keydown", event => {
  if (event.key.toLocaleLowerCase() === "enter" && input.value) {
    const action = actions.addTodo(event.target.value);
    store.dispatch(action);
    input.value = "";
  }
});

const filterTodosByVisibility = (todos, visibility) => {
  if (visibility === filterTypes.allItems) {
    return todos;
  } else if (visibility === filterTypes.activeItems) {
    return todos.filter(todo => todo.complete === false);
  } else if (visibility === filterTypes.completedItems) {
    return todos.filter(todo => todo.complete === true);
  }
};

store.subscribe(latestState => {
  const clearCompletedList = latestState.todos.some(t => t.complete === true);
  setClearCompletedButtonVisibility(clearCompletedList);

  const activeTodos = latestState.todos.filter(t => t.complete === false);
  activeItemsLeft.innerHTML = getCountText(activeTodos);

  ul.innerHTML = "";
  const filteredTodos = filterTodosByVisibility(
    latestState.todos,
    latestState.currentFilter
  );

  filteredTodos.forEach(todo => {
    const item = document.createElement("li");
    item.classList.toggle("completed", todo.complete);
    const divView = document.createElement("div");
    divView.classList.add("view");

    const checkBox = document.createElement("input");
    checkBox.classList.add("toggle");
    checkBox.setAttribute("type", "checkbox");
    checkBox.addEventListener("change", function(event) {
      const action = actions.toggleTodo(todo.id);
      store.dispatch(action);
    });

    checkBox.toggleAttribute("checked", todo.complete);

    const removeButton = document.createElement("button");
    removeButton.classList.add("destroy");
    removeButton.addEventListener("click", event => {
      const action = actions.removeTodo(todo.id, todo.text);
      store.dispatch(action);
    });

    divView.appendChild(removeButton);
    divView.appendChild(checkBox);

    item.appendChild(divView);
    ul.appendChild(item);

    if (todo.editing) {
      const textBox = document.createElement("input");
      textBox.className = "edit";

      item.classList.add("editing");

      textBox.addEventListener("blur", () => {
        const action = actions.toggleEditing(todo.id, false);
        store.dispatch(action);
      });

      textBox.addEventListener("keydown", event => {
        const ENTER_KEY = 13;
        const ESCAPE_KEY = 27;

        const stopEditing = actions.toggleEditing(todo.id, false);
        const updateTodo = actions.updateTodo(todo.id, textBox.value);

        if (event.keyCode === ESCAPE_KEY) {
          store.dispatch(stopEditing);
        } else if (event.keyCode === ENTER_KEY) {
          store.dispatch(stopEditing);
          store.dispatch(updateTodo);
        }
      });

      item.appendChild(textBox);
      textBox.value = todo.text;

      textBox.focus();
    } else {
      const label = document.createElement("label");
      label.innerHTML = todo.text;
      divView.appendChild(label);

      label.addEventListener("dblclick", event => {
        const action = actions.toggleEditing(todo.id, true);
        store.dispatch(action);
      });
    }
  });
});

// trigger store.dispatch in order
// to load the data from localstorage
store.dispatch({
  type: "APP_INIT"
});

document.getElementById("active").addEventListener("click", function() {
  const action = actions.changeVisibility(filterTypes.activeItems);
  store.dispatch(action);
});

document.getElementById("all").addEventListener("click", function() {
  const action = actions.changeVisibility(filterTypes.allItems);
  store.dispatch(action);
});

document.getElementById("completed").addEventListener("click", function() {
  const action = actions.changeVisibility(filterTypes.completedItems);
  store.dispatch(action);
  setClearCompletedButtonVisibility(filterTypes.completedItems);
});

document.getElementById("toggle-all").addEventListener("change", function() {
  const action = actions.toggleAll();
  store.dispatch(action);
});

clearCompletedButton.addEventListener("click", function() {
  const action = actions.clearCompletedItems(filterTypes.allItems);
  store.dispatch(action);
});

function setClearCompletedButtonVisibility(visible) {
  clearCompletedButton.style.display = visible ? "block" : "none";
}

function getCountText(itemsLeft) {
  const suffix = itemsLeft.length === 1 ? " item left" : " items left";
  return itemsLeft.length + suffix;
}
