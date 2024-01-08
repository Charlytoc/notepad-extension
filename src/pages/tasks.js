// Must be called html
const returnSticker = (item, index) => {
    return `<div class="sticker ${item.done ? "done" : null}">
                <section >
                    <input data-note-id=${index} type="checkbox" class="checkbox mark-as-done" ${item.done ? "checked" : null} />
                    <i  data-note-id=${index} class="fa-solid fa-trash erase-note"></i>
                
                </section>
                <p>${item.title}</p>
            </div>`
}

let html = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const addNote = (title) => {
        let data = JSON.parse(localStorage.getItem('tasks')) || [];
        data.push({ title: title, class: "" });
        localStorage.setItem('tasks', JSON.stringify(data));
        location.reload()
    }

    actions.deleteNote = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        clearAlarm(tasks[index].title);
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks))
        location.reload()
    }

    actions.markAsDone = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        tasks[index].class === "done" ? tasks[index].class = "" : tasks[index].class = "done"
        tasks[index].done ? tasks[index].done = false : tasks[index].done = true;

        clearAlarm(tasks[index].title)
        localStorage.setItem('tasks', JSON.stringify(tasks))
        location.reload()
    }

    actions.addTask = (e) => {
        e.preventDefault();
        const title = document.getElementById('title-input').value;
        const hours = document.getElementById('hours-input').value;
        const minutes = document.getElementById('minutes-input').value;
        const seconds = document.getElementById('seconds-input').value;
        const period = parseInt(document.getElementById('period-input').value);

        const milliseconds = (parseInt(hours) * 60 * 60 * 1000) + (parseInt(minutes) * 60 * 1000) + parseInt(seconds) * 1000;

        alarm(title, milliseconds, period);
        addNote(title);
    }

    actions.showForm = () => {
        document.getElementById('add-task-form').style.display = "block";
        document.getElementById('show-form-button').style.display = "none";
    }

    
    return `<div class="tasks principal" tabindex="-1">
    ${navigation("tasks.html")}
    <button tabindex="1" class="simple-button self-center" id="show-form-button">Add a task</button>
    <form id="add-task-form">
        <span>Add a meaningful title to help you remember what to do</span>
        <input  id="title-input" placeholder="i.e: Wash the plates" type="text" required/>
        <span>Set a timer to remind you when to do it</span>
        <section class="time-section">
            <span>hours</span>
            <span>minutes</span>
            <span>seconds</span>
            <input placeholder="i.e: 2" type="number" id="hours-input" min="0" max="24" value="3" required>
            <input type="number" placeholder="i.e: 59" id="minutes-input" min="0" max="60" value="30" required>
            <input type="number" placeholder="i.e: 32" id="seconds-input" min="0" max="60" value="32" required>
        </section>
        <p>Repeat each <input class="inline cm-1" type="number" placeholder="i.e: 32" id="period-input" min="1" value="5" required /> minutes</p>
        <button tabindex="0" type="submit" class="simple-button">Add task</button>
    </form>
        
    <section class="sticker-board">
    ${tasks.map((item, index) => returnSticker(item, index)).join(' ')}
    </section>
    </div>`;
}

document.addEventListener("render", () => {
    document.querySelectorAll(".erase-note").forEach((button) => {
        button.addEventListener("click", actions.deleteNote);
    });
    document.querySelectorAll(".mark-as-done").forEach((button) => {
        button.addEventListener("click", actions.markAsDone);
    });
    document.querySelector("#add-task-form").addEventListener('submit', actions.addTask)
    document.querySelector("#show-form-button").addEventListener('click', actions.showForm)

})