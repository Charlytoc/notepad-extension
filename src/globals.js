const Link = (href, name) => {
    return `
    <a href="${href}" class="clickeable">${name}</a>
    `
}

const Form = ({
    innerHTML = "",
    identifier = ""
}) => {
    const _html = `
    <section id="${identifier}" class="modal-form">
        ${innerHTML}
    </section>
    `

    console.log("Returning form", _html);
    return _html
}

const toggleElementDisplay = (action, selector) => {
    const actions = {
        show: () => {
            document.querySelector(selector).style.display = "block";
        },
        hide: () => {
            document.querySelector(selector).style.display = "none";
        }
    }
    actions[action]()
    console.log("Toggling form todo", action);
}

const todoListComponent = (todos) => {
    return `
        <section class="todos-container">
        ${todos.map((todo, index) => {
        return `<div class="todo">
            <h3>${todo.title}</h3>
            <p>${todo.description}</p>
            <section class="todo-extra-info">
                <div>
                    <span>${todo.time}</span>
                    <span>${todo.period}</span>
                </div>
                
                <div>
                ${todo.done ? "🟩" : "⬛"}
                    <input class="done-checkbox" data-todo-index="${index}" type="checkbox" ${todo.done ? "checked" : ""} />
                </div>
                <button class="delete-todo-button button" data-todo-index="${index}">
                    <i class="fas fa-trash"></i>

                </button>
            </section>
            </div>`
    }).join('')}
        </section>
    `
}