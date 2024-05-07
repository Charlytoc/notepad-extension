const STORAGE_KEY = "notetaker";


const _footer = (note) => {
    return `
    <div id="footer">
            <section>
                <button id="back-button" class="button">Back</button>
                <button class="delete-button clickeable button">
                    <i class="fa-solid fa-trash clickeable"></i>
                </button>
            </section>
            <section>
                <p>#${note.tags.join(' #')}</p>
            </section>
            <section>
                <p>${note.created.slice(0, 10)}</p>
            </section>
        </div>
        `
}


let html = () => {
    let params = new URLSearchParams(window.location.search);
    let noteIndex = params.get('index');
    let notesArray = getDataFromLocalStorage(STORAGE_KEY);
    let note = notesArray[noteIndex];

    if (note === undefined) {
        note = { title: "", created: "", tags: [] }
    }

    actions.modifyNote = (e) => {
        // the elemnt should also have a porperty data-editable
        const editableType = e.target.dataset.editable;
        if (editableType === "description") {
            note.content = e.target.value;
        } else if (editableType === "title") {
            note.title = e.target.innerText;
        }
       
        const newNotesArray = notesArray;
        newNotesArray[noteIndex] = note;
        saveDataToLocalStorage(STORAGE_KEY, newNotesArray);
    }

    actions.goToNotesPage = () => {
        window.location.href = `notetaker.html`;
    }

    
    actions.deleteNote = (e) => {
        const newNotesArray = notesArray.filter((note, index) => index !== parseInt(noteIndex));
        saveDataToLocalStorage(STORAGE_KEY, newNotesArray);
        // Reload the page
        window.location.href = "notetaker.html";
    }

    return `
    <main class="principal">
        <h1 contenteditable="true" data-editable="title">${note.title}</h1>
        <textarea id="scratchpad" type="text" data-editable="description">${note.content}</textarea>
        ${_footer(note)}
    </main>
        `
        // <p>Tags: ${note.tags.join(', ')}</p>
        // <p>Created: ${note.created}</p>
}

document.addEventListener("render", () => {
    document.querySelector("#scratchpad").addEventListener('change', actions.modifyNote);
    document.querySelector("#back-button").addEventListener('click', actions.goToNotesPage);
    document.querySelector("h1[contenteditable]").addEventListener('blur', actions.modifyNote);

    document.querySelectorAll('.delete-button').forEach((button) => {
        button.addEventListener('click', actions.deleteNote)
    })
})
