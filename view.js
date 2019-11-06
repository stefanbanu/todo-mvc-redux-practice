const input = document.querySelector(".new-todo");
const ul = document.querySelector(".todo-list");

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
    console.log("after subscribe ", latestState);

    ul.innerHTML = "";
    const filteredTodos = filterTodosByVisibility(latestState.todos, latestState.currentFilter);

    console.log(filteredTodos);
    filteredTodos.forEach(todo => {
        const item = document.createElement("li");
        item.classList.toggle("completed", todo.complete);
        const divView = document.createElement("div");
        divView.classList.add("view");

        const checkBox = document.createElement("input");
        checkBox.classList.add("toggle");
        checkBox.setAttribute("type", "checkbox");
        checkBox.addEventListener("change", function (event) {
            const action = actions.toggleTodo(todo.id);
            store.dispatch(action);
        });

        checkBox.toggleAttribute("checked", todo.complete);

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

document.getElementById("active").addEventListener("click", function () {
    console.log("test");
    const action = actions.changeVisibility(filterTypes.activeItems);
    store.dispatch(action);
});

document.getElementById("all").addEventListener("click", function () {
    const action = actions.changeVisibility(filterTypes.allItems);
    store.dispatch(action);
});

document.getElementById("completed").addEventListener("click", function () {
    console.log("test");
    const action = actions.changeVisibility(filterTypes.completedItems);
    store.dispatch(action);
});


document.querySelector(".clear-completed").addEventListener("click", function () {
    console.log("clear completed");

        const action = actions.clearCompletedItems(filterTypes.allItems);
        store.dispatch(action);

});

