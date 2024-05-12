const STORAGE_KEY = "notetaker";
const MODE_KEY = "mode";

const websocket = new WebSocket('ws://localhost:8000/message');

websocket.onopen = function () {
    console.log('WebSocket connection established');
}



websocket.onerror = function (error) {
    console.error('WebSocket error:', error);
    websocket.close(); // Close the connection if an error occurs
};

websocket.onclose = function () {
    console.log('WebSocket connection closed');
};



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
        const newNotesArray = notesArray.filter((note, index) => index !== parseInt(noteIndex));
        saveDataToLocalStorage(STORAGE_KEY, newNotesArray);
        // Reload the page
        window.location.href = "notetaker.html";
    }


    websocket.onmessage = function (message) {
        const messageData = JSON.parse(message.data);

        const event = messageData.event

        if (event === "finish") {
            let currentValue = document.querySelector("#scratchpad").value;
            note.content = `${currentValue}`; // Append the received message to the note content
            notesArray[noteIndex] = note; // Update the note in the array
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notesArray)); // Save the updated notes array to local storage
            return;
        }

        let currentValue = document.querySelector("#scratchpad").value;
        document.querySelector("#scratchpad").value = currentValue += messageData.content;
    };


    actions.generateAIContent = () => {
        toggleElementDisplay("show", "#prompt-form");
    };

    actions.sendPrompt = (e) => {
        e.preventDefault();
        const prompt = document.querySelector("#prompt-form textarea").value;

        websocket.send(JSON.stringify(
            {
                system_prompt: `
                Title: ${note.title}
                Content: ${note.content}
                `,
                prompt: `
                TASKS FOR AI:
                ${prompt}
                `
            }
        ))
        
        notify({ title: "AI is working!", message: "Wait, your note will be ready soon!" });

        toggleElementDisplay("hide", "#prompt-form");

    }


    actions.changeMode = () => {
        mode = mode === "md" ? "text" : "md";
        saveDataToLocalStorage(MODE_KEY, mode);
        window.location.reload();
    }

    console.log("Rendering in mode", mode);
    return `
    <main class="principal">
        <h3 contenteditable="true" data-editable="title">${note.title}</h3>
        
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
    document.querySelector("h3[contenteditable]").addEventListener('blur', actions.modifyNote);


    document.querySelectorAll('.delete-button').forEach((button) => {
        button.addEventListener('click', actions.deleteNote)
    })
})
