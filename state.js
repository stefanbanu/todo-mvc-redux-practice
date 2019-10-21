// Rule 1: single source of truth
const filterTypes = {
  allItems: "ALL",
  activeItems: "ACTIVE",
  completedItems: "COMPLETED"
};

const initialState = {
  todos: [],
  currentFilter: filterTypes.allItems
};
let globalId = 0;

// Rule 2: State is read-only
// Fire an action that intends a change
const actionTypes = {
  addTodo: "ADD_TODO",
  removeTodo: "REMOVE_TODO",
  toggleTodo: "TOGGLE_TODO",
  editTodo: "EDIT_TODO",
  displayActive: "DISPLAY_ACTIVE",
  displayCompleted: "DISPLAY_COMPLETED",
  displayAll: "DISPLAY_ALL"
};

const actions = {
  addTodo: text => {
    return {
      type: actionTypes.addTodo,
      payload: text
    };
  },
  removeTodo: id => {
    return {
      type: actionTypes.removeTodo,
      payload: id
    };
  },
  toggleTodo: id => {
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
  },
  displayActive: () => {
    return {
      type: actionTypes.displayActive
    };
  },
  displayAll: () => {
    return {
      type: actionTypes.displayAll
    };
  },
  displayCompleted: () => {
    return {
      type: actionTypes.displayCompleted
    };
  }
};

// Rule 3: Reducers interpret actions
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.addTodo:
      const todo = createTodo(action.payload);

      return {
        ...state,
        todos: [...state.todos, todo]
      };

    case actionTypes.removeTodo:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };

    case actionTypes.toggleTodo:
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload) {
            return {
              ...todo,
              complete: !todo.complete
            };
          } else {
            return todo;
          }
        })
      };

    case actionTypes.editTodo:
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            return {
              ...todo,
              text: action.payload.newText
            };
          } else {
            return todo;
          }
        })
      };

    case actionTypes.displayAll:
      return {
        ...state,
        currentFilter: filterTypes.allItems
      };

    case actionTypes.displayActive:
      return {
        ...state,
        currentFilter: filterTypes.activeItems
      };

    case actionTypes.displayCompleted:
      return {
        ...state,
        currentFilter: filterTypes.completedItems
      };
  }
};

const createTodo = text => {
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
    dispatch: action => {
      currentState = reducer(currentState, action);

      listeners.forEach(listener => {
        listener(currentState);
      });
    },
    subscribe: callbackFunction => {
      listeners.push(callbackFunction);
    }
  };

  return store;
};

window.actions;
window.store = createStore();
