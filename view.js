const input = document.querySelector(".new-todo");
const ul = document.querySelector(".todo-list");

document.querySelector(".new-todo").addEventListener("keydown", event => {
  if (event.key.toLocaleLowerCase() === "enter" && input.value) {
    const action = actions.addTodo(event.target.value);
    window.store.dispatch(action);
    input.value = "";
  }
});

store.subscribe(latestState => {
  console.log(latestState);
  ul.innerHTML = "";

  latestState.forEach(todo => {
    const item = document.createElement("li");
    // li.innerHTML = todo.text;

    let divView = document.createElement("div");
    divView.classList.add("view");

    let checkBox = document.createElement("input");
    checkBox.classList.add("toggle");
    checkBox.setAttribute("type", "checkbox");

    checkBox.addEventListener('change', completedItem);

    divView.appendChild(checkBox);

    let label = document.createElement("Label");
    label.innerHTML = input.value;

    divView.appendChild(label);

    let removeButton = document.createElement("button");
    removeButton.classList.add("destroy");
    removeButton.addEventListener("click", removeItem);

    divView.appendChild(removeButton);

    item.appendChild(divView);

    ul.appendChild(item);
    // ul.insertBefore(item, ul.childNodes[0]);
  });
});

function completedItem(checked){
  let item = this.parentNode.parentNode;
  if (checked) {
    item.classList.add("completed");
  } else {
    item.classList.remove("completed");
  }
}

function removeItem() {
  let item = this.parentNode.parentNode;
  let parent = item.parentNode;
  parent.removeChild(item);
}
