// Rule 1: single source of truth
const filterTypes = {
    allItems: "ALL",
    activeItems: "ACTIVE",
    completedItems: "COMPLETED"
};


let globalId = 0;
let initialState;
console.log("teste");
if (localStorage.getItem("appState")) {
    initialState = JSON.parse(localStorage.getItem("appState"));
    initialState.todos.forEach(value => {
        if (value.id >= globalId) {globalId = value.id + 1;}
    });
} else {
    initialState = {
        todos: [],
        currentFilter: filterTypes.allItems
    };
}


// Rule 2: State is read-only
// Fire an action that intends a change
const actionTypes = {
    addTodo: "ADD_TODO",
    removeTodo: "REMOVE_TODO",
    toggleTodo: "TOGGLE_TODO",
    updateTodo: "UPDATE_TODO",
    changeVisibility: "CHANGE_VISIBILITY",
    clearCompleted: "CLEAR_COMPLETED",
    toggleAll: "COMPLETE_ALL",
    toggleEditing: "TOGGLE_EDITING"
};

const actions = {
    addTodo: text => {
        return {
            type: actionTypes.addTodo,
            payload: text
        };
    },
    removeTodo: (id, key) => {
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
    updateTodo: (id, newText) => {
        return {
            type: actionTypes.updateTodo,
            payload: {
                id: id,
                newText: newText
            }
        };
    },

    toggleEditing: (id, editing) => {
        return {
            type: actionTypes.toggleEditing,
            payload: {
                id: id,
                editing: editing
            }
        };
    },

    changeVisibility: visible => {
        return {
            type: actionTypes.changeVisibility,
            payload: visible
        };
    },
    clearCompletedItems: visible => {
        return {
            type: actionTypes.clearCompleted,
            payload: visible
        };
    },
    toggleAll: () => {
        return {
            type: actionTypes.toggleAll
        };
    }
};

// Rule 3: Reducers interpret actions
const reducer = (state = initialState, action) => {
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

        case actionTypes.updateTodo:
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

        case actionTypes.clearCompleted:
            return {
                ...state,
                todos: state.todos.filter(todo => !todo.complete)
            };

        case actionTypes.changeVisibility:
            return {
                ...state,
                currentFilter: action.payload
            };

        case actionTypes.toggleAll:
            const isAnyItemNotComplete = state.todos.some(t => t.complete === false);

            const makeTodoComplete = (obj, complete) => {
                return {
                    ...obj,
                    complete: complete
                };
            };

            return {
                ...state,
                todos: state.todos.map(todo =>
                    makeTodoComplete(todo, isAnyItemNotComplete)
                )
            };

        case actionTypes.toggleEditing:
            return {
                ...state,
                todos: state.todos.map(todo => {
                    if (todo.id === action.payload.id) {
                        return {
                            ...todo,
                            editing: action.payload.editing
                        };
                    } else {
                        return todo;
                    }
                })
            };

        default:
            return state;
    }
};

const createTodo = text => {
    return {
        id: globalId++,
        text: text,
        complete: false,
        editing: false
    };
};

const createStore = () => {
    let currentState = initialState;
    console.log(currentState);
    let listeners = [];

    const observable = {
        dispatch: action => {
            currentState = reducer(currentState, action);

            localStorage.setItem("appState", JSON.stringify(currentState));

            listeners.forEach(listener => {
                listener(currentState);
            });
        },
        // storing observers/subscribers/functions
        subscribe: observerFunction => {
            listeners.push(observerFunction);
        }
    };

    return observable;
};

window.actions;
window.store = createStore();


