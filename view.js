const input = document.querySelector(".new-todo");
const ul = document.querySelector(".todo-list");

document.querySelector(".new-todo").addEventListener("keydown", event => {
  if (event.key.toLocaleLowerCase() === "enter" && input.value) {
    const action = actions.addTodo(event.target.value);
    store.dispatch(action);
    input.value = "";
  }
});

store.subscribe(latestState => {
  console.log(latestState);

  ul.innerHTML = "";

  latestState.todos.forEach(todo => {
    const item = document.createElement("li");

    const divView = document.createElement("div");
    divView.classList.add("view");

    const checkBox = document.createElement("input");
    checkBox.classList.add("toggle");
    checkBox.setAttribute("type", "checkbox");
    checkBox.addEventListener("change", completedItem);
    divView.appendChild(checkBox);

    const label = document.createElement("Label");
    label.innerHTML = todo.text;
    divView.appendChild(label);

    const removeButton = document.createElement("button");
    removeButton.classList.add("destroy");
    removeButton.addEventListener("click", event => {
      const action = actions.removeTodo(todo.id);
      store.dispatch(action);
    });
    divView.appendChild(removeButton);

    item.appendChild(divView);
    ul.appendChild(item);
  });
});

document.getElementById("active").addEventListener("click", function() {
  console.log("test");
  const action = actions.displayActive();
  store.dispatch(action);
});

function completedItem(event) {
  let item = this.parentNode.parentNode;
  if (event.target.checked) {
    item.classList.add("completed");
  } else {
    item.classList.remove("completed");
  }
}
