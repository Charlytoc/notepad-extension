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
    // actions.handleContent = (e) => {
    //     task.content = e.target.value;
    //     if (e.keyCode === 13 && task.title) {
    //         let data = JSON.parse(localStorage.getItem('tasks')) || []; 
    //         data.push(task);
    //         localStorage.setItem('tasks', JSON.stringify(data));
    //         location.reload()
    //     }}


    actions.addNote = (e) => {
        if (e.keyCode === 13) { // check if Enter key was pressed
            const inputValue = e.target.value // get the value of the input field and remove any leading/trailing spaces
            if (inputValue) { // check that the input value is not empty
                let data = JSON.parse(localStorage.getItem('tasks')) || []; // get the existing data array from localStorage, or initialize an empty array if it doesn't exist
                data.push(inputValue); // add the input value to the data array
                localStorage.setItem('tasks', JSON.stringify(data)); // save the updated data array back to localStorage
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

    const returnSticker = (item, index) => {
       
        return `<div >
                    <h3>${item.title}</h3>
                    <i  data-note-id=${index} class="fa-solid fa-trash erase-note"></i>
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

})