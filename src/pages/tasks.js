// Must be called html
const returnSticker = (item, index) => {
    return `<div class="sticker ${item.class}">
                <p>${item.title}</p>
                <div>
                <i  data-note-id=${index} class="fa-solid fa-trash erase-note"></i>
                <i data-note-id=${index} class="fa-solid fa-square-check mark-as-done"></i>
                </div>
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

    actions.addNote = (e) => {
        if (e.keyCode === 13) {
            const inputValue = e.target.value
            if (inputValue) {
                addNote(inputValue)
            }
        }
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

        const milliseconds = (parseInt(hours) * 60 * 60 * 1000) + (parseInt(minutes) * 60 * 1000) + parseInt(seconds) * 1000;

        alarm(title, milliseconds);
        addNote(title);
    }

    actions.showForm = () => {
        document.getElementById('add-task-form').style.display = "block";
        document.getElementById('show-form-button').style.display = "none";
    }


    return `<div class="tasks principal">
    ${navigation("tasks.html")}
    <button tabindex="0" class="simple-button self-center" id="show-form-button">Add a task</button>
    <form id="add-task-form">
        <span>Add a meaningful title to help you remember what to do</span>
        <input  id="title-input" placeholder="i.e: Wash the plates" type="text" />
        <span>Set a timer to remind you when to do it</span>
        <section class="time-section">
            <span>hours</span>
            <span>minutes</span>
            <span>seconds</span>
            <input placeholder="i.e: 2" type="number" id="hours-input" min="0" max="24" value="3" required>
            <input type="number" placeholder="i.e: 59" id="minutes-input" min="0" max="60" value="30" required>
            <input type="number" placeholder="i.e: 32" id="seconds-input" min="0" max="60" value="32" required>
        </section>
    <button type="submit" class="simple-button">Add task</button>
    </form>

    <section class="sticker-board">
    ${tasks.map((item, index) => returnSticker(item, index)).join(' ')}
    </section>
    </div>`;
}

document.addEventListener("render", () => {
    // document.querySelector("#title-input").addEventListener('keyup', actions.handleTitle);

    document.querySelectorAll(".erase-note").forEach((button) => {
        button.addEventListener("click", actions.deleteNote);
    });
    document.querySelectorAll(".mark-as-done").forEach((button) => {
        button.addEventListener("click", actions.markAsDone);
    });

    document.querySelector("#add-task-form").addEventListener('submit', actions.addTask)
    document.querySelector("#show-form-button").addEventListener('click', actions.showForm)

})