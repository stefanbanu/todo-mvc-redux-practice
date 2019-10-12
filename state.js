// Rule 1: single source of truth
const initialState = [];
let globalId = 0;

// Rule 2: State is read-only
// Fire an action that intends a change
const actionTypes = {
  addTodo: 'ADD_TODO',
  removeTodo: 'REMOVE_TODO',
  toggleTodo: 'TOGGLE_TODO',
  editTodo: 'EDIT_TODO'
};

const actions = {
  addTodo: (text) => {
    return {
      type: actionTypes.addTodo,
      payload: text
    };
  },
  removeTodo: (id) => {
    return {
      type: actionTypes.removeTodo,
      payload: id
    };
  },
  toggleTodo: (id) => {
    return {
      type: actionTypes.toggleTodo,
      payload: id
    };
  },
  editTodo: (id, newText) => {
    return {
      type: actionTypes.editTodo,
      payload: {
        id: id,
        newText: newText
      }
    };
  }
};

// Rule 3: Reducers interpret actions
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.addTodo:
      const todo = createTodo(action.payload);

      return [...state, todo];

    case actionTypes.removeTodo:
      return state.filter((todo) => todo.id !== action.payload);

    case actionTypes.toggleTodo:
      return state.map((todo) => {
        if (todo.id === action.payload) {
          return {
            ...todo,
            complete: !todo.complete
          };
        } else {
          return todo;
        }
      });

    case actionTypes.editTodo:
      return state.map((todo) => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            text: action.payload.newText
          };
        } else {
          return todo;
        }
      });
  }
};
const createTodo = (text) => {
  return {
    id: globalId++,
    text: text,
    complete: false
  };
};

const createStore = () => {
  let currentState = initialState;
  let listeners = [];

  const store = {
    dispatch: (action) => {
      currentState = reducer(currentState, action);

      listeners.forEach((listener) => {
        listener(currentState);
      });
    },
    subscribe: (callbackFunction) => {
      listeners.push(callbackFunction);
    }
  };

  return store;
};

window.actions;
window.store = createStore();
