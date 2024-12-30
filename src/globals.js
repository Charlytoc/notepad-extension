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


// <button class="edit-todo-button clickeable" data-todo-index="${todo.index}"><i class="fa-solid fa-edit"></i> Edit</button>
const TodoComponent = (todo) => {

    return `<div class="todo">
                <h3 >${todo.title}</h3>
                <p >${todo.description}</p>
                <section class="todo-extra-info">
                    <div>
                        <span>Will notify at</span>
                        <code >${todo.time}</code>
                        <span>every ${todo.period} min</span>
                    </div>
                    
           
          
                    <div>
                    <button class="delete-todo-button button" data-todo-index="${todo.index}">
                        <i class="fas fa-trash clickeable" data-todo-index="${todo.index}"></i>
    
                    </button>
                    <button class="edit-todo-button button" data-todo-index="${todo.index}">
                            <i class="fas fa-edit clickeable" data-todo-index="${todo.index}"></i>
                        </button>
                        <input class="done-checkbox clickeable" data-todo-index="${todo.index}" type="checkbox" ${todo.done ? "checked" : ""} />
                        <span class=" ${todo.done ? "done" : "pending"}">${todo.done ? "DONE" : "PENDING"}</span>
                    </div>
                </section>  
                ${Form({
        innerHTML: `
                <form class="todo-editor" data-todo-index="${todo.index}">
            <h2>Edit task</h2>
            <input type="text" name="title" placeholder="Todo title" value="${todo.title}">
            <textarea name="description" placeholder="Todo description">${todo.description}</textarea>
            <input type="time" name="time" placeholder="Todo time" value="${todo.time}"/>
            <p>Remember me every <input type="number" class="cm-1" name="period" min="0" max="1440" value="${todo.period}"/> minutes</p>
            <input type="text" name="category" placeholder="Todo category" value="${todo.category}"/>
            <button type="submit" class="simple-button" id="edit-todo"><i class="fa-solid fa-check"></i></button>
        </form>
        `, identifier: `edit-todo-form-${todo.index}`
    })}
                </div>`
}

const todoListComponent = (todos) => {
    const indexedTodos = todos.map((todo, index) => {
        return { ...todo, index }
    })
    console.log(indexedTodos);

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

const FloatingLeftButton = ({ identifier }) => {
    const extraClass = "fixed-right-bottom"

    return Button({ extraClass, identifier, content: "+" })
}

const mdToHtml = (md) => {
    4

    var converter = new showdown.Converter();
    converter.setOption('tasklists', true);
    var html = converter.makeHtml(md);
    return html;
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



const navigation = (activeUrl) => {
    const views = [
        {
            name: "copylinks",
            url: "copies.html"
        },
        {
            name: "tasks",
            url: "tasks.html"
        },
        {
            name: "notes",
            url: "notetaker.html"
        },
        {
            name: "⚙️",
            url: "menu.html"
        }
    ]

    return `
    <h3 class="upper-section">Charlytoc's notepad</h3>
    <div class="navigation">
    ${views.map((window) => {
        return `<a tabindex="-1" href="${window.url}" class="navigation-urls link ${activeUrl === window.url ? "active" : ""}">${window.name}</a>`
    }).join('')}
    </div>
    `
}