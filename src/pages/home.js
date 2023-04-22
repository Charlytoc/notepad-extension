// Must be called html
let html = () => {
    // const [notes, setNotes] = useState( || [])
    const [fetched, setFetched] = useState(false)

    const data = JSON.parse(localStorage.getItem('data')) || [];
   
   

    actions.addNote = (e) => {
        if (e.keyCode === 13) { // check if Enter key was pressed
            const inputValue = e.target.value // get the value of the input field and remove any leading/trailing spaces
            if (inputValue) { // check that the input value is not empty
                let data = JSON.parse(localStorage.getItem('data')) || []; // get the existing data array from localStorage, or initialize an empty array if it doesn't exist
                data.push(inputValue); // add the input value to the data array
                localStorage.setItem('data', JSON.stringify(data)); // save the updated data array back to localStorage
                location.reload()
                
            }
        }
    }
    actions.deleteNote = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        console.log(data[index], index, e.target.dataset)
        data.splice(index, 1);
        localStorage.setItem('data', JSON.stringify(data))
        location.reload()
    }
    actions.copyNote = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        const text = data[index]
        navigator.clipboard.writeText(text)
        .then(() => {
        console.log('Text copied to clipboard');
        })
        .catch((err) => {
        console.error('Failed to copy text: ', err);
        });
    }
    // ${data.map((item, index) => `<span>${item}</span>`)}
    return `<div class="home principal">
    <h2>notepad <i class="fa-regular fa-comment-dots rose"></i></h2>
    <div class="navigation">
    <a href="calendar.html" class="link">calendar</a>
    <a class="link current">easy-copies</a>
    <a href="tasks.html" class="link">tasks for today</a>
    <a href="calendar.html" class="link">month goals</a>
    </div>
    <input  id="note-input" placeholder="press enter to add the easy-copy" type="text" />
    ${data.map((item, index) => 
    `<div  class="note">
    <p>${item}</p>
    <div><button class=""><i  data-note-id=${index} class="fa-solid fa-trash erase-note"></i></button>
    <button class=""><i data-note-id=${index}  class="fa-solid fa-copy copy-note"></i></button>
    </div>
    </div>`).join(' ')}
    </div>`;
}

document.addEventListener("render", ()=>{
    document.querySelector("#note-input").addEventListener('keyup', actions.addNote);
    document.querySelectorAll(".erase-note").forEach((button) => {
        button.addEventListener("click", actions.deleteNote);
      });
    document.querySelectorAll(".copy-note").forEach((button) => {
        button.addEventListener("click", actions.copyNote);
      });

})