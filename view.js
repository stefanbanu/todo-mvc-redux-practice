const input = document.querySelector('input');
const ul = document.querySelector('ul');

input.addEventListener('keydown', (event) => {
  if (event.keyCode !== 13) {
    return;
  }

  const value = event.target.value.trim();

  if (!value) {
    return;
  }

  const action = actions.addTodo(value);

  store.dispatch(action);

  event.target.value = '';
});

store.subscribe((latestState) => {
  console.log(latestState);
  ul.innerHTML = '';

  latestState.forEach((todo) => {
    const li = document.createElement('li');

    li.innerHTML = todo.text;

    ul.appendChild(li);
  });
});
