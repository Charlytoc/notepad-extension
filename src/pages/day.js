const TODOS_STORAGE_KEY = "TODOS_STORAGE"


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


let html = () => {
    let params = new URLSearchParams(window.location.search);
    let day = params.get('day');
    let month = params.get('month');
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
        // Convert time string to minutes for comparison
        const timeToMinutes = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };
        // Insert todo in the correct position based on time
        const insertIndex = newTodos[month][day].findIndex(existingTodo =>
            timeToMinutes(existingTodo.time) > timeToMinutes(todoData.time)
        );
        if (insertIndex === -1) {
            newTodos[month][day].push(todoData);
        } else {
            newTodos[month][day].splice(insertIndex, 0, todoData);
        }
        saveDataToChromeStorage(TODOS_STORAGE_KEY, newTodos);
        setTodos(newTodos);
        // toggleElementDisplay("hide", )
    }

    actions.showForm = () => {
        toggleElementDisplay('show', "#todo-modal")
    }

    return `<main class="day principal">
        <div class="header">
            <a href="calendar.html">Back to calendar</a>
        </div>
        <button tabindex="1" class="simple-button self-center" id="show-form-button">Add a task</button>
        ${Form(
        {
            innerHTML: `
                <form id="todo-form">
        <input type="text" name="title" placeholder="Todo title">
        <textarea name="description" placeholder="Todo description"></textarea>
        <input type="time" name="time" placeholder="Todo time"/>
        <button class="simple-button" id="add-todo">Add todo</button>
        </form>`,
        identifier: "todo-modal"

        }
    )}
        <h2>Todos for ${day} of ${months[month]}</h2>
        <section class="todos-container">
            ${todos && todos[month] && todos[month][day] ? todoListComponent(todos[month][day]) : ""}
        </section>
        
    </main>`
}

document.addEventListener("render", () => {
    document.querySelector('#todo-form').addEventListener('submit', actions.addTodo)
    document.querySelectorAll('.delete-todo-button').forEach((button) => {
        button.addEventListener('click', actions.deleteTodo)
    })
    document.querySelector("#show-form-button").addEventListener('click', actions.showForm)
})