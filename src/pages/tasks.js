// Must be called html
let html = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
   
    const task = {
        
    }
    actions.handleTitle = (e) => {
        task.title = e.target.value;
        if (e.keyCode === 13 && task.title) {
            let data = JSON.parse(localStorage.getItem('tasks')) || []; 
            data.push(task);
            localStorage.setItem('tasks', JSON.stringify(data));
            location.reload()
        }
    }

    actions.addNote = (e) => {
        if (e.keyCode === 13) { 
            const inputValue = e.target.value 
            if (inputValue) { 
                let data = JSON.parse(localStorage.getItem('tasks')) || []; 
                data.push(inputValue); 
                localStorage.setItem('tasks', JSON.stringify(data)); 
                location.reload()
                
            }
        }
    }
    actions.deleteNote = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        console.log(tasks[index], index, e.target.dataset)
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks))
        location.reload()
    }
    actions.markAsDone = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        tasks[index].class === "done" ? tasks[index].class = "" : tasks[index].class = "done"
        
        console.log(tasks[index], index, e.target.dataset)
        localStorage.setItem('tasks', JSON.stringify(tasks))
        location.reload()
    }

    const returnSticker = (item, index) => {
        return `<div class="${item.class}">
                    <h3>${item.title}</h3>
                    <div>
                    <i  data-note-id=${index} class="fa-solid fa-trash erase-note"></i>
                    <i data-note-id=${index} class="fa-solid fa-square-check mark-as-done"></i>
                    </div>
                </div>`
    }

    return `<div class="home principal">
    <h2>notepad <i class="fa-regular fa-comment-dots rose"></i> - by charlytoc</h2>
    <div class="navigation">
    <a href="calendar.html" class="link">calendar</a>
    <a href="home.html" class="link">easy-copies</a>
    <a class="link current">tasks for today</a>
    <a href="calendar.html" class="link">month goals</a>
    </div>
    <input  id="title-input" placeholder="it's easy to do simple tasks than harder ones!" type="text" />
    <section class="sticker-board">
    ${tasks.map((item, index)=> returnSticker(item, index)).join(' ')}
    </section>
    </div>`;
}

document.addEventListener("render", ()=>{
    document.querySelector("#title-input").addEventListener('keyup', actions.handleTitle);

    document.querySelectorAll(".erase-note").forEach((button) => {
        button.addEventListener("click", actions.deleteNote);
      });
    document.querySelectorAll(".mark-as-done").forEach((button) => {
        button.addEventListener("click", actions.markAsDone);
      });

})