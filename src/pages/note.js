const STORAGE_KEY = "notetaker";
const MODE_KEY = "mode";


const SYSTEM_PROMPT = (content) => `
You are a helpful note assistant.
Your task is to make the changes the user asks for in the note.
This is the current content of the note:

${content}
`

const PromptForm = `
    <form id="prompt-form">
    <h1>What you want the AI to do?</h1>
    <textarea name="prompt"></textarea>
    <button class="button sz-big" type="submit">Send</button>
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
                <button id="ai-button" class="clickeable button">
                <i class="fa-solid fa-robot clickeable"></i>
                </button>
                <button id="mode-button" class="clickeable button">
                    ${mode === "md" ? "txt" : "md"}
                </button>
                <button id="download-button" class="clickeable button">
                    Download
                </button>
            </section>
            <section>
                <p contenteditable="true" data-editable="category">${note.category || "No category"}</p>
                <p>${note.created.slice(0, 10)}</p>
            </section>
        </div>
    `
}

let html = () => {
    let params = new URLSearchParams(window.location.search);
    let noteIndex = params.get('index');
    saveLastPageVisited("note.html" + `?index=${noteIndex}`);
    let notesArray = getDataFromLocalStorage(STORAGE_KEY);
    const GROQ_API_KEY = getDataFromLocalStorage("GROQ_API_KEY")
    let mode = getDataFromLocalStorage(MODE_KEY);

    if (mode === null) {
        mode = "md";
        saveDataToLocalStorage(MODE_KEY, mode);
    }

    let note = notesArray[noteIndex];

    if (note === undefined) {
        note = { title: "", created: "", category: "" }
    }

    actions.modifyNote = (e) => {
        const editableType = e.target.dataset.editable;
        if (editableType === "description") {
            note.content = e.target.value;
        } else if (editableType === "title") {
            note.title = e.target.innerText;
        } else if (editableType === "category") {
            note.category = e.target.innerText;
        }
        const newNotesArray = notesArray;
        newNotesArray[noteIndex] = note;
        saveDataToLocalStorage(STORAGE_KEY, newNotesArray);
    }

    actions.goToNotesPage = () => {
        window.location.href = `notetaker.html`;
    }

    actions.deleteNote = (e) => {
        const newNotesArray = notesArray.filter((note, index) => note.index !== parseInt(noteIndex)).map((note, index) => {
            return { ...note, index }
        });

        saveDataToLocalStorage(STORAGE_KEY, newNotesArray);
        window.location.href = "notetaker.html";
    }

    actions.generateAIContent = () => {
        toggleElementDisplay("show", "#prompt-form");
    };

    actions.sendPrompt = (e) => {
        e.preventDefault();
        const prompt = document.querySelector("#prompt-form textarea").value;

        fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{
                    role: 'system', content: SYSTEM_PROMPT(note.content)
                },
                { role: 'user', content: prompt }],
                model: 'llama-3.1-70b-versatile'
            })
        })
            .then(response => response.json())
            .then(data => {
                const aiResponse = data.choices[0].message.content;
                note.content += `\n\n${aiResponse}`;
                const newNotesArray = notesArray;
                newNotesArray[noteIndex] = note;
                saveDataToLocalStorage(STORAGE_KEY, newNotesArray);
                notify({ title: "AI Response", message: aiResponse });
                window.location.reload()
            })
            .catch(error => {
                console.error('Error:', error);
                notify({ title: "Error", message: "Failed to get response from AI" });
            });

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
            ?
            `<div id="preview">${mdToHtml(note.content)}</div>`
            // `<textarea id="scratchpad" type="text" data-editable="description">${note.content}</textarea>`
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
    }
    catch (e) {
        console.log("Textarea not found");

    }
    document.querySelector("#ai-button").addEventListener('click', actions.generateAIContent);
    document.querySelector("#back-button").addEventListener('click', actions.goToNotesPage);
    document.querySelector("#mode-button").addEventListener('click', actions.changeMode);
    document.querySelector("#prompt-form").addEventListener('submit', actions.sendPrompt);
    document.querySelector("h1[contenteditable]").addEventListener('blur', actions.modifyNote);
    document.querySelector("p[contenteditable]").addEventListener('blur', actions.modifyNote);
    document.querySelectorAll('.delete-button').forEach((button) => {
        button.addEventListener('click', actions.deleteNote)
    })
    document.querySelector("#download-button").addEventListener('click', actions.downloadNote);
})
