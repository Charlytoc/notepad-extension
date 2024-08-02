const STORAGE_KEY = "notetaker";
const MODE_KEY = "mode";


const PromptForm = `
    <form id="prompt-form">
    <h1>What you want the AI to do?</h1>
    <textarea name="prompt"></textarea>
    <button class="button sz-big" type="submit">Save</button>
    </form>
`


const _footer = (note, mode) => {
    return `
    <div id="footer">
            <section>
                <button id="back-button" class="button">Back</button>
                <button class="delete-button danger clickeable button">
                    <i class="fa-solid fa-trash clickeable"></i>
                </button>
                ${mode === "text" ? `<button id="ai-button" class=" clickeable button">
                <i class="fa-solid fa-robot clickeable"></i>
                </button>` : ""}

                <button id="mode-button" class="clickeable button">
                    ${mode === "md" ? "txt" : "md"}
                </button>
                <button id="download-button" class="clickeable button">
                    Download
                </button>
            </section>
            <section>
            <p>#${note.tags.join(' #')}</p>
                <p>${note.created.slice(0, 10)}</p>
            </section>
        </div>
        `
}


let html = () => {
    let params = new URLSearchParams(window.location.search);
    let noteIndex = params.get('index');
    saveLastPageVisited("note.html"+`?index=${noteIndex}`);
    let notesArray = getDataFromLocalStorage(STORAGE_KEY);
    let mode = getDataFromLocalStorage(MODE_KEY);

    if (mode === null) {
        mode = "md";
        saveDataToLocalStorage(MODE_KEY, mode);
    }

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
        const newNotesArray = notesArray.filter((note, index) => note.index !== parseInt(noteIndex)).map((note, index)=>{
            return {...note, index}
        });

        saveDataToLocalStorage(STORAGE_KEY, newNotesArray);
        // Reload the page
        window.location.href = "notetaker.html";
    }


    actions.generateAIContent = () => {
        toggleElementDisplay("show", "#prompt-form");
    };

    actions.sendPrompt = (e) => {
        e.preventDefault();
        const prompt = document.querySelector("#prompt-form textarea").value;
        
        notify({ title: "AI is not available at the moment!", message: "Wait, I'll give it the time soon!" });

        toggleElementDisplay("hide", "#prompt-form");
    }


    actions.changeMode = () => {
        mode = mode === "md" ? "text" : "md";
        saveDataToLocalStorage(MODE_KEY, mode);
        window.location.reload();
    }

    actions.downloadNote = () => {
        const element = document.createElement('a');
        const file = new Blob([note.content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${note.title}.txt`;
        document.body.appendChild(element);
        element.click();
    }

    return `
    <main class="principal">
        <h1 contenteditable="true" data-editable="title">${note.title}</h1>
        
        ${mode === "md"
            ? `<div id="preview">${mdToHtml(note.content)}</div>`
            : `<textarea id="scratchpad" type="text" data-editable="description">${note.content}</textarea>`
        }
        ${Form({
            identifier: "prompt-form",
            innerHTML: PromptForm
        })}
        ${_footer(note, mode)}
    </main>
        `
}

document.addEventListener("render", () => {
    try {
        document.querySelector("#scratchpad").addEventListener('change', actions.modifyNote);
        document.querySelector("#ai-button").addEventListener('click', actions.generateAIContent);
    } catch (error) {
        console.log("Error", error);
    }


    document.querySelector("#back-button").addEventListener('click', actions.goToNotesPage);

    document.querySelector("#mode-button").addEventListener('click', actions.changeMode);
    document.querySelector("#prompt-form").addEventListener('submit', actions.sendPrompt);
    document.querySelector("h1[contenteditable]").addEventListener('blur', actions.modifyNote);


    document.querySelectorAll('.delete-button').forEach((button) => {
        button.addEventListener('click', actions.deleteNote)
    })

    document.querySelector("#download-button").addEventListener('click', actions.downloadNote);
})
