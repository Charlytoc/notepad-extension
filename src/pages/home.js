// Must be called html



const navigation = () => `<div class="navigation">
<a href="calendar.html" class="link">calendar</a>
<a class="link current">easy-copies</a>
<a href="tasks.html" class="link">tasks for today</a>
<a href="monthGoals.html" class="link">month goals</a>
</div>
`


const modal = (id) => {
    console.log(id);
    return `
    <div id="modal-${id}" class="copied-modal">
    Copied to clipboard!
    </div>
    `
}

const noteComponent = (item, index) => `
<div data-note-id=${index} class="note">
${modal(index)}
<p>${item.name}</p>
<div><button class=""><i  data-note-id=${index} class="fa-solid fa-trash erase-note"></i></button>
<button class=""><i data-note-id=${index}  class="fa-solid fa-copy copy-note"></i></button>
</div>
</div>
 `

let html = () => {

    const [fetched, setFetched] = useState(false)

    const CURRENT_WINDOW = 'HOME'
    const LAST_WINDOW = localStorage.getItem('LAST_WINDOW');
    if (LAST_WINDOW !== CURRENT_WINDOW) {
        localStorage.setItem('LAST_WINDOW', CURRENT_WINDOW);
    }


    const data = JSON.parse(localStorage.getItem('data')) || [];
   
   const easyCopy = {
        name: "",
        link:""
   }
   
   chrome.commands.onCommand.addListener((command) => {
    console.log(`Command "${command}" triggered`);
  });
    actions.addNote = (e) => {
        if (e.keyCode === 13) { // check if Enter key was pressed
            const inputValue = e.target.value // get the value of the input field and remove any leading/trailing spaces
            easyCopy.link = inputValue
            if (inputValue) { // check that the input value is not empty
                let data = JSON.parse(localStorage.getItem('data')) || []; // get the existing data array from localStorage, or initialize an empty array if it doesn't exist
                data.push(easyCopy); // add the input value to the data array
                localStorage.setItem('data', JSON.stringify(data)); // save the updated data array back to localStorage
                location.reload()
                
            }
        }
    }
    actions.addName = (e) => {
        easyCopy.name = e.target.value
    }
    actions.deleteNote = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        // console.log(data[index], index, e.target.dataset)
        data.splice(index, 1);
        localStorage.setItem('data', JSON.stringify(data))
        location.reload()
    }
    actions.copyNote = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        const text = data[index].link
        navigator.clipboard.writeText(text)
        .then(() => {
            const copyModal = document.querySelector(`#modal-${index}`);
            // copyModal.classList += ' animate-disappear';            
            console.log(copyModal);
            copyModal.style.animationPlayState = 'running';

        })
        .catch((err) => {
        console.error('Failed to copy text: ', err);
        });
    }
    // ${data.map((item, index) => `<span>${item}</span>`)}
    return `<div class="home principal">
    <h2>Notepad <i class="fa-regular fa-comment-dots rose"></i> - by Charlytoc</h2>
    ${navigation()}
    <input  id="name-input" placeholder="what you want to display" type="text" />
    <input  id="note-input" placeholder="what you want to save" type="text" />
    <section class="note-container">
    ${data.map(noteComponent).join(' ')}
    </section>
    </div>`;
}

document.addEventListener("render", ()=>{
    document.querySelector("#note-input").addEventListener('keyup', actions.addNote);
    document.querySelector("#name-input").addEventListener('keyup', actions.addName);
    document.querySelectorAll(".erase-note").forEach((button) => {
        button.addEventListener("click", actions.deleteNote);
      });
    document.querySelectorAll(".copy-note").forEach((button) => {
        button.addEventListener("click", actions.copyNote);
      });

})