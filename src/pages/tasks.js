const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const getMillisecondsToFire = (time, day, month) => {
  const currentYear = new Date().getFullYear();
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(currentYear, month, day, hours, minutes, 0, 0);
  // Calculate the difference in milliseconds
  return date.getTime() - Date.now();
};

const getDateInMilliseconds = (time, day, month) => {
  const currentYear = new Date().getFullYear();
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(currentYear, month, day, hours, minutes, 0, 0);
  return date.getTime();
};


const TODOS_STORAGE_KEY = "TODOS_STORAGE"

const toggleFormTodo = (action) => {
    const actions = {
        show: () => {
            document.querySelector('#todo-form').style.display = "block";
            document.querySelector('#show-form-button').style.display = "none";
        },
        hide: () => {
            document.querySelector('#todo-form').style.display = "none";
            document.querySelector('#show-form-button').style.display = "block";
        }
    }
    actions[action]()
}

const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
};

const todoListComponent = (todos) => {
    return `
    <h2>Todos</h2>
        <section class="todos-container">
        ${todos.map((todo, index) => {
            return `<div class="todo">
            <h3>${todo.title}</h3>
            <p>${todo.description}</p>
            <section class="todo-extra-info">
            <span>👀</span>
            <span>${todo.time}</span>
            <span>☑️</span>
            <div>
            <input type="checkbox" ${todo.done ? "checked" : ""} />
            </div>
            </section>
            <button class="delete-todo-button" data-todo-index="${index}">Delete</button>
            </div>`
        }).join('')}
        </section>
    `
}

let html = () => {
    const date = new Date();
    let day =date.getDate();
    let month = date.getMonth();

    const [todos, setTodos] = useState({})
    const [fetched, setFetched] = useState(false)

    if (!fetched) {
        getDataFromChromeStorage(TODOS_STORAGE_KEY, (prevTodos) => {
            setTodos(prevTodos)
            setFetched(true)
        })

    }

    actions.deleteTodo = (e) => {
        const todoIndex = e.target.dataset.todoIndex;
        const newTodos = todos;
        clearAlarm(newTodos[todoIndex].title)
        newTodos[month][day].splice(todoIndex, 1);
        saveDataToChromeStorage(TODOS_STORAGE_KEY, newTodos);
        setTodos(newTodos);
    }

    actions.addTodo = (e) => {
        e.preventDefault();
        const form = document.querySelector('#todo-form');
        const formData = new FormData(form);
        const todoData = {};
        for (const [key, value] of formData.entries()) {
            todoData[key] = value;
        }
        todoData.done = false;
        let newTodos = {}
        if (todos) {
            newTodos = todos
        }
        if (!newTodos[month]) {
            newTodos[month] = {}
        }
        if (!newTodos[month][day]) {
            newTodos[month][day] = []
        }
        
        const insertIndex = newTodos[month][day].findIndex(existingTodo =>
            timeToMinutes(existingTodo.time) > timeToMinutes(todoData.time)
        );
        if (insertIndex === -1) {
            newTodos[month][day].push(todoData);
        } else {
            newTodos[month][day].splice(insertIndex, 0, todoData);
        }
        saveDataToChromeStorage(TODOS_STORAGE_KEY, newTodos);


        const dateInMilliseconds = getDateInMilliseconds(todoData.time, day, month);

        const periodInMinutes = Number(todoData.period) === 0 ? 1 : Number(todoData.period);

        alarm(todoData.title,
            todoData.description,
            dateInMilliseconds,
            periodInMinutes
            );

        setTodos(newTodos);
    }

    actions.showForm = () => {
        toggleFormTodo('show')
    }

    return `<main class="day principal">
        ${navigation("tasks.html")}

        <button tabindex="1" class="simple-button w-100" id="show-form-button">Add a task</button>
        <form id="todo-form">
            <input type="text" name="title" placeholder="Todo title">
            <textarea name="description" placeholder="Todo description"></textarea>
            <input type="time" name="time" placeholder="Todo time"/>
            <p>Remember me every <input type="number" class="cm-1" name="period"/> minutes</p>
            <button class="simple-button" id="add-todo">Add todo</button>
        </form>
        
            ${todos && todos[month] && todos[month][day] ? todoListComponent(todos[month][day]) : ""}
        
    </main>`
}

document.addEventListener("render", () => {
    document.querySelector('#todo-form').addEventListener('submit', actions.addTodo)
    document.querySelectorAll('.delete-todo-button').forEach((button) => {
        button.addEventListener('click', actions.deleteTodo)
    })
    document.querySelector("#show-form-button").addEventListener('click', actions.showForm)
})