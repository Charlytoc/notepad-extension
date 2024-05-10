const STORAGE_KEY = "notetaker"

const noteForm = `
    <form id="note-form">
    <h1>Add a new note</h1>
    <input placeholder="Title" id="scratchpad" type="text" name="title"/>
    <input type="text" placeholder="Tags" name="tags" />
    <textarea placeholder="Content" name="content"></textarea>
    <button class="button sz-big" id="save-button">Save</button>
    </form>
    `


const createMasonry = (notes) => {
    // Split the notes array into 2 arrays of similar length
    
    // Add the property masonryIndex to each note and assign it as the original index
    notes.forEach((note, index) => note.masonryIndex = index);
    const half = Math.ceil(notes.length / 2);
    const firstHalf = notes.splice(0, half);
    const secondHalf = notes.splice(-half);

    return `
        <div class="masonry">
        <div class="column">
        ${firstHalf.map((note) => `
            <li class="note " data-noteindex="${note.masonryIndex}">
            <h3>${note.title}</h3>
            <section class="footer">
            <button class="open-button clickeable button">
                <i class="fa-brands fa-readme clickeable"></i>
            </button>
            </section>
            </li>
            `).join('')}
        </div>
        <div class="column">
        ${secondHalf.map((note) => `
            <li class="note " data-noteindex="${note.masonryIndex}">
            <h3>${note.title}</h3>
            <section class="footer">
            <button class="open-button clickeable button">
                <i class="fa-brands fa-readme clickeable"></i>
            </button>
            </section>
            </li>
            `).join('')}
        </div>
        </div>
        `
}



const NotesContainer = ({notes}) => {

    return `
        <div id="notes-container">
            <ul id="notesList">
            ${notes && !(typeof notesArray === "string") && createMasonry(notes)}
            </ul>
        </div>
        `


}

let html = () => {
    saveLastPageVisited("notetaker")
    let notesArray = getDataFromLocalStorage(STORAGE_KEY);

    if (!Array.isArray(notesArray)) notesArray = [];

    const [query, setQuery] = useState("");

    const filteredNotes = notesArray.filter(note => note.title.toLowerCase().includes(query));

    actions.goToNotePage = (e) => {
        const noteIndex = e.target.closest('.note').dataset.noteindex;
        window.location.href = `note.html?index=${noteIndex}`;
    };


    actions.save = (e) => {
        e.preventDefault();
        const noteForm = document.querySelector("#note-form")

        const noteTitle = noteForm.title.value;
        const noteContent = noteForm.content.value;


        if (!noteTitle || !noteContent) {
            window.location.reload();
            return
        }


        const noteTags = noteForm.tags.value.split(',');
        const noteCreated = new Date().toISOString();
        const newNote = { title: noteTitle, content: noteContent, created: noteCreated, tags: noteTags };
        const newNotesArray = [...notesArray, newNote];

        saveDataToLocalStorage(STORAGE_KEY, newNotesArray);
        // Reload the page
        window.location.reload();
    }

    actions.displayForm = () => {
        toggleElementDisplay("show", "#note-form-container");
    }

    actions.filterNotes = () => {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        setQuery(searchTerm);
    };
    
    return `
    <main class="principal">
        ${navigation("notetaker.html")}
        <input value="${query}" type="text" id="search-input" placeholder="Search by title...">
        ${NotesContainer({notes: filteredNotes})}
        ${Form({
            innerHTML: noteForm,
            identifier: "note-form-container"
        })}
        ${FloatingLeftButton(
            {
                identifier: "add-new-button",
            }
        )}
        </main>
        `
}
// <p>${note.created}</p>
// <p>Tags: ${note.tags.join(', ')}</p>

document.addEventListener("render", () => {
    // document.querySelector("#scratchpad").addEventListener('change', actions.takeNotes);
    document.querySelector("#save-button").addEventListener('click', actions.save);
    document.querySelector("#add-new-button").addEventListener('click', actions.displayForm);
    document.querySelector("button").addEventListener('click', actions.populateNotes);
    // Select all the .note and add a click event listener to listen the function action.populateNotes
    document.querySelectorAll('.open-button').forEach((button) => {
        button.addEventListener('click', actions.goToNotePage)
    })
    
    document.querySelector("#search-input").addEventListener('input', actions.filterNotes);

    // all the .delete-button should have a click listener to actions.deleteNote

})
