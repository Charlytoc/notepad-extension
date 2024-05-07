const STORAGE_KEY = "notetaker"

const addButton = () => {
    return `<button class="button" id="add-new-button">
    <span>+</span>
    </button>`
}



const noteForm = `
    <form id="note-form">
    <h1>Add a new note</h1>
    <input placeholder="Title" id="scratchpad" type="text" name="title"/>
    <input type="text" placeholder="Tags" name="tags" />
    <textarea placeholder="Content" name="content"></textarea>
    <button class="button sz-big" id="save-button">Save</button>
    </form>
    `


const notesContainer = (notes) => {

    return `
        <ul id="notesList">
        ${notes && !(typeof notesArray === "string") && notes.map((note, index) => `
        <li class="note " data-noteindex="${index}">
        <h3>${note.title}</h3>
        
        <section class="footer">
        <button class="open-button clickeable button">
            <i class="fa-brands fa-readme clickeable"></i>
        </button>
        </section>
        </li>
        `).join('')}
        </ul>
        `


}

let html = () => {
    saveLastPageVisited("notetaker")
    let notesArray = getDataFromLocalStorage(STORAGE_KEY);

    if (!Array.isArray(notesArray)) notesArray = [];

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


    return `
    <main class="principal">
        ${navigation("notetaker.html")}
        ${addButton()}
        ${notesContainer(notesArray)}
        ${Form({
        innerHTML: noteForm,
        identifier: "note-form-container"
    })}
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

    // all the .delete-button should have a click listener to actions.deleteNote
    
})
