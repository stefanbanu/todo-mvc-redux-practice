const input = document.querySelector(".new-todo");
const ul = document.querySelector(".todo-list");
const clearCompletedButton = document.querySelector(".clear-completed");
const activeItemsLeft = document.querySelector(".todo-count");

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

  if (latestState.currentFilter === filterTypes.allItems) {
    document.getElementById("all").classList.add("selected");
    document.getElementById("active").classList.remove("selected");
    document.getElementById("completed").classList.remove("selected");
  } else if (latestState.currentFilter === filterTypes.activeItems) {
    document.getElementById("active").classList.add("selected");
    document.getElementById("all").classList.remove("selected");
    document.getElementById("completed").classList.remove("selected");
  } else if (latestState.currentFilter === filterTypes.completedItems) {
    document.getElementById("completed").classList.add("selected");
    document.getElementById("active").classList.remove("selected");
    document.getElementById("all").classList.remove("selected");
  }

  filteredTodos.forEach(todo => {
    const divView = document.createElement("div");
    divView.classList.add("view");
    const item = document.createElement("li");
    item.classList.toggle("completed", todo.complete);
    const checkBox = createCheckBox(todo);
    const removeButton = createRemoveButton(todo);
    divView.appendChild(removeButton);
    divView.appendChild(checkBox);
    item.appendChild(divView);
    ul.appendChild(item);
    checkIfItemIsEdited(todo, item, divView);
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

function createCheckBox(todo) {
  const checkBox = document.createElement("input");
  checkBox.classList.add("toggle");
  checkBox.setAttribute("type", "checkbox");
  checkBox.addEventListener("change", function() {
    const action = actions.toggleTodo(todo.id);
    store.dispatch(action);
  });
  checkBox.toggleAttribute("checked", todo.complete);
  return checkBox;
}

document.querySelector(".new-todo").addEventListener("keydown", event => {
  if (event.key.toLocaleLowerCase() === "enter" && input.value) {
    const action = actions.addTodo(event.target.value);
    store.dispatch(action);
    input.value = "";
  }
});

function createRemoveButton(todo) {
  const removeButton = document.createElement("button");
  removeButton.classList.add("destroy");
  removeButton.addEventListener("click", () => {
    const action = actions.removeTodo(todo.id, todo.text);
    store.dispatch(action);
  });
  return removeButton;
}

function addTextBoxFunctionalityOnBlur(textBox, todo) {
  textBox.addEventListener("blur", () => {
    const action = actions.toggleEditing(todo.id, false);
    store.dispatch(action);
  });
}

function addTextBoxFunctionalityOnKeyDown(textBox, todo) {
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
}

function checkIfItemIsEdited(todo, item, divView) {
  if (todo.editing) {
    const textBox = document.createElement("input");
    textBox.className = "edit";
    item.classList.add("editing");
    addTextBoxFunctionalityOnBlur(textBox, todo);
    addTextBoxFunctionalityOnKeyDown(textBox, todo);
    item.appendChild(textBox);
    textBox.value = todo.text;
    textBox.focus();
  } else {
    const label = document.createElement("label");
    label.innerHTML = todo.text;
    divView.appendChild(label);
    label.addEventListener("dblclick", () => {
      const action = actions.toggleEditing(todo.id, true);
      store.dispatch(action);
    });
  }
}
