const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const generateRandomHash = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

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

const TODOS_STORAGE_KEY = "TODOS_STORAGE";

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
    saveLastPageVisited("tasks.html");
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth();

    const [todos, setTodos] = useState([]);
    const [fetched, setFetched] = useState(false);

    if (!fetched) {
        getDataFromChromeStorage(TODOS_STORAGE_KEY, (prevTodos) => {
            setTodos(prevTodos || []);
            setFetched(true);
        });
    }

    actions.clearAllAlarms = () => {
        chrome.alarms.clearAll((wasCleared) => {
            console.log(wasCleared ? "All alarms were cleared successfully." : "Failed to clear alarms.");
            if (wasCleared) {
                notify({
                    title: "🟩 Alarms Cleared",
                    message: "All Chrome alarms have been cleared successfully! 🤖"
                });
            }
            else {
                notify({
                    title: "🟥 Alarms Not Cleared",
                    message: "Failed to clear alarms. Please try again later. 🤖"
                });
            }
        });
    };

    actions.deleteTodo = (e) => {
        const todoIndex = e.target.dataset.todoIndex;
        const newTodos = [...todos];
        clearAlarm(newTodos[todoIndex].title);
        newTodos.splice(todoIndex, 1);
        saveDataToChromeStorage(TODOS_STORAGE_KEY, newTodos);
        setTodos(newTodos);
    };

    actions.markTodoAsDone = (e) => {
        const todoIndex = e.target.dataset.todoIndex;
        const newTodos = [...todos];
        const todo = newTodos[todoIndex];

        newTodos[todoIndex].done = e.target.checked;
        saveDataToChromeStorage(TODOS_STORAGE_KEY, newTodos);
        setTodos(newTodos);

        if (!e.target.checked) {
            setAlarm(todo);
        } else {
            clearAlarm(todo.hash);
        }
    };

    const setAlarm = (todo) => {
        // Remove previous alarm if it exists
        clearAlarm(todo.hash);

        // Set new alarm
        const dateInMilliseconds = getDateInMilliseconds(todo.time, day, month);
        const periodInMinutes = Number(todo.period) === 0 ? 1 : Number(todo.period);
        alarm(todo.hash, todo.title, todo.description, dateInMilliseconds, periodInMinutes);

        notify(
            {
                title: `🟩 Todo: ${todo.title}`,
                message: `I will remember you at ${todo.time} every ${todo.period} minutes! 🤖`
            }
        );
    }

    actions.addTodo = (e) => {
        e.preventDefault();
        const form = document.querySelector('#todo-form');
        const formData = new FormData(form);
        const todoData = {};
        for (const [key, value] of formData.entries()) {
            todoData[key] = value;
        }

        todoData.hash = generateRandomHash();

        todoData.done = false;
        const newTodos = [...todos];

        if (!todoData.time || !todoData.period) {
            todoData.time = "00:00";
            todoData.period = 1;
        }

        const insertIndex = newTodos.findIndex(existingTodo =>
            timeToMinutes(existingTodo.time) > timeToMinutes(todoData.time)
        );
        if (insertIndex === -1) {
            newTodos.push(todoData);
        } else {
            newTodos.splice(insertIndex, 0, todoData);
        }
        saveDataToChromeStorage(TODOS_STORAGE_KEY, newTodos);

        setAlarm(todoData);

        setTodos(newTodos);
        toggleElementDisplay('hide', "#f-todo");
    };

    actions.showForm = () => {
        toggleElementDisplay('show', "#f-todo");
    };

    actions.showEditForm = (e) => {
        const todoIndex = e.target.dataset.todoIndex;
        toggleElementDisplay('show', `#edit-todo-form-${todoIndex}`);
    }

    actions.editTodo = (e) => {
        e.preventDefault();
        const todoIndex = e.target.dataset.todoIndex;
        const form = document.querySelector(`#edit-todo-form-${todoIndex} > form`);

        const formData = new FormData(form);
        const todoData = {};
        for (const [key, value] of formData.entries()) {
            todoData[key] = value;
        }


        const newTodos = [...todos];
        newTodos[todoIndex] = todoData;
        saveDataToChromeStorage(TODOS_STORAGE_KEY, newTodos);
        setTodos(newTodos);
        toggleElementDisplay('hide', `#edit-todo-form-${todoIndex}`);

        setAlarm(todoData);
    }

    return `<main class="principal">
    ${navigation("tasks.html")}
    <button class="simple-button" id="clear-alarms"><i class="fa-solid fa-trash"></i> Clear All Alarms</button>
    ${FloatingLeftButton({ identifier: "show-form-button" })}
    ${Form(
        {
            innerHTML: `
        <form id="todo-form">
            <h2>Add a task</h2>
            <input type="text" name="title" placeholder="Todo title">
            <textarea name="description" placeholder="Todo description"></textarea>
            <input type="time" name="time" placeholder="Todo time"/>
            <p>Remember me every <input type="number" class="cm-1" name="period" min="0" max="1440"/> minutes</p>
            <input type="text" name="category" placeholder="Todo category"/>
            <button class="simple-button" id="add-todo"><i class="fa-solid fa-plus"></i></button>
        </form>
        `,
            identifier: "f-todo",
        }
    )}
    
        ${todos.length ? todoListComponent(todos) : ""}
    
</main>`;
};

document.addEventListener("render", () => {
    document.querySelector('#todo-form').addEventListener('submit', actions.addTodo);
    document.querySelectorAll('.delete-todo-button').forEach((button) => {
        button.addEventListener('click', actions.deleteTodo);
    });
    document.querySelectorAll('.done-checkbox').forEach((checkbox) => {
        checkbox.addEventListener('change', actions.markTodoAsDone);
    });
    document.querySelector("#show-form-button").addEventListener('click', actions.showForm);

    document.querySelectorAll(".edit-todo-button").forEach((button) => {
        button.addEventListener('click', actions.showEditForm);
    });

    document.querySelector(".todo-editor")?.addEventListener('submit', actions.editTodo);

    document.querySelector("#clear-alarms").addEventListener('click', actions.clearAllAlarms);
});
