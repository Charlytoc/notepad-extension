const STORAGE_KEY = "notetaker"


let html = () => {
    let notesArray = getDataFromLocalStorage(STORAGE_KEY);
    if (!Array.isArray(notesArray)) notesArray = [];



    actions.takeNotes = (e) => {
        const noteTitle = e.target.value
        const noteCreated = new Date().toISOString();
        const noteTags = ["helloWorld", "goodbyeWorld"];
        const newNote = { title: noteTitle, created: noteCreated, tags: noteTags };
        const newNotesArray = [...notesArray, newNote];

        saveDataToLocalStorage(STORAGE_KEY, newNotesArray);
    }

    actions.populateNotes = () => {
        const sampleNotes = [
            { title: "Note 1", created: "2023-01-01", tags: ["tag1", "tag2"] },
            { title: "Note 2", created: "2023-01-02", tags: ["tag2", "tag3"] },
            { title: "Note 3", created: "2023-01-03", tags: ["tag3", "tag4"] },
            { title: "Note 4", created: "2023-01-04", tags: ["tag4", "tag5"] },
            { title: "Note 5", created: "2023-01-05", tags: ["tag5", "tag6"] }
        ];
        saveDataToLocalStorage(STORAGE_KEY, sampleNotes);
    }

    actions.goToNotePage = (e) => {
        const noteIndex = e.target.closest('.note').dataset.noteindex;
        window.location.href = `note.html?index=${noteIndex}`;
    };
    

    actions.deleteNote = (e) => {
        const noteIndex = e.target.closest('.note').dataset.noteindex;
        const newNotesArray = notesArray.filter((note, index) => index !== parseInt(noteIndex));
        saveDataToLocalStorage(STORAGE_KEY, newNotesArray);
    }


    return `
    <main class="principal">
        ${navigation("notetaker.html")}
        <input id="scratchpad" type="text"/>
        <ul id="notesList">
            ${notesArray && !(typeof notesArray === "string") && notesArray.map((note, index) => `
            <li class="note" data-noteindex="${index}">
                <h3>${note.title}</h3>
                <p>Created: ${note.created}</p>
                <p>Tags: ${note.tags.join(', ')}</p>
                <button class="delete-button">Delete</button>
                <button class="open-button">Open</button>
            </li>

        `).join('')}
        </ul>
    </main>
    `
}

document.addEventListener("render", () => {
    document.querySelector("#scratchpad").addEventListener('change', actions.takeNotes);
    document.querySelector("button").addEventListener('click', actions.populateNotes);
    // Select all the .note and add a click event listener to listen the function action.populateNotes
    document.querySelectorAll('.open-button').forEach((button) => {
        button.addEventListener('click', actions.goToNotePage)
    })

    // all the .delete-button should have a click listener to actions.deleteNote
    document.querySelectorAll('.delete-button').forEach((button) => {
        button.addEventListener('click', actions.deleteNote)
    })
})
