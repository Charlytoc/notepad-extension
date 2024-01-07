// Must be called html


let html = () => {
    const tasks = JSON.parse(localStorage.getItem('goals')) || [];
   
    const task = {
        
    }
    actions.handleTitle = (e) => {
        task.title = e.target.value;
        if (e.keyCode === 13 && task.title) {
            let data = JSON.parse(localStorage.getItem('goals')) || []; 
            data.push(task);
            localStorage.setItem('goals', JSON.stringify(data));
            location.reload()
        }
    }

    actions.addNote = (e) => {
        if (e.keyCode === 13) { 
            const inputValue = e.target.value 
            if (inputValue) { 
                let data = JSON.parse(localStorage.getItem('goals')) || []; 
                data.push(inputValue); 
                localStorage.setItem('goals', JSON.stringify(data)); 
                location.reload()
                
            }
        }
    }
    actions.deleteNote = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        console.log(tasks[index], index, e.target.dataset)
        tasks.splice(index, 1);
        localStorage.setItem('goals', JSON.stringify(tasks))
        location.reload()
    }
    actions.markAsDone = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        tasks[index].class === "done" ? tasks[index].class = "" : tasks[index].class = "done"
        
        console.log(tasks[index], index, e.target.dataset)
        localStorage.setItem('goals', JSON.stringify(tasks))
        location.reload()
    }

    const returnSticker = (item, index) => {
        return `<div class="${item.class}">
                    <div><span>${item.title}</span></div>
                    <div>
                    <i  data-note-id=${index} class="fa-solid fa-trash erase-note"></i>
                    <i data-note-id=${index} class="fa-solid fa-square-check mark-as-done"></i>
                    </div>
                </div>`
    }

    return `<div class="home principal">
    ${navigation("monthGoals.html")}
    <input  id="title-input" placeholder="Focus in this notes to be succesful" type="text" />
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