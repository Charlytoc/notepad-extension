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


const TodoComponent = (todo) => {
    return `<div class="todo">
                <h3>${todo.title}</h3>
                <p>${todo.description}</p>
                <section class="todo-extra-info">
                    <div>
                        <code class=" ${todo.done ? "done" : "pending"}">${todo.time}</code>
                        <span>Every ${todo.period} min</span>
                    </div>
                    
                    <div>
                   
                        <input class="done-checkbox clickeable" data-todo-index="${todo.index}" type="checkbox" ${todo.done ? "checked" : ""} />
                    </div>
                    <button class="delete-todo-button button" data-todo-index="${todo.index}">
                        <i class="fas fa-trash clickeable"></i>
    
                    </button>
                </section>
                </div>`
}

const todoListComponent = (todos) => {
    // Picar el array de todos en dos partes de igual o casi igual length
    // y devolver dos columnas de todos
    const indexedTodos = todos.map((todo, index) => {
        return { ...todo, index }
    })
    const half = Math.ceil(indexedTodos.length / 2);
    const firstHalf = indexedTodos.slice(0, half);
    const secondHalf = indexedTodos.slice(half, todos.length);

    return `
        <section class="todos-container">
        <div class="column">
        ${firstHalf.map((todo) => {
        return TodoComponent(todo)
    }).join('')}
        </div>
        <div class="column">
        ${secondHalf.map((todo) => {
        return TodoComponent(todo)
    }).join('')}
        
        </div>
        </section>
    `
}


const Button = ({ extraClass, identifier, content }) => {
    return `<button tabindex="1" class="button ${extraClass}" id="${identifier}">
    ${content}
    </button>`
}

const FloatingLeftButton = ({identifier}) => {
    const extraClass = "fixed-right-bottom"
    
    return Button({ extraClass, identifier, content: "+" })
}

const mdToHtml = (md) => {4

    var converter = new showdown.Converter();
var html = converter.makeHtml(md);
    return html;
    // var md = new Remarkable();
    // return md.render(md);
}


const notify = (opts) => {
    chrome.notifications.create('', {
        title: opts.title,
        message: opts.message,
        iconUrl: 'icon.png',
        type: 'basic'
    }, function (notificationId) {
        console.log('Notification created with ID:', notificationId);
    });
}
