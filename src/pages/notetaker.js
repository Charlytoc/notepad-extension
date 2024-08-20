const STORAGE_KEY = "notetaker";
const OPENED_CATEGORIES_KEY = "openedCategories";



const noteForm = `
    <form id="note-form">
    <h1>Add a new note</h1>
    <input placeholder="Title" id="scratchpad" type="text" name="title"/>
    <input type="text" placeholder="Tags" name="tags" />
    <input type="text" placeholder="Category" name="category" />
    <textarea placeholder="Content" name="content"></textarea>
    <button class="button sz-big" id="save-button">Save</button>
    </form>
`;

const createMasonry = (notes) => {
    const oddNotes = notes.filter((note, index) => index % 2 !== 0);
    const evenNotes = notes.filter((note, index) => index % 2 === 0);

    return `
        <div class="masonry">
        <div class="column">
        ${evenNotes.map((note) => `
            <li class="note" data-noteindex="${note.index}" draggable="true">
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
        ${oddNotes.map((note) => `
            <li class="note" data-noteindex="${note.index}" draggable="true">
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
    `;
};

const NotesContainer = ({ notes, openedCategories }) => {
    const categories = [...new Set(notes.map(note => note.category || "Uncategorized"))];

    return `
        <div id="notes-container">
            ${categories.map(category => {
                const categoryNotes = notes.filter(note => (note.category || "Uncategorized") === category);
                return `
                    <div class="category-group" data-category="${category}">
                        <h2 class="category-title">${category} (${categoryNotes.length})</h2>
                        <ul style="display: ${openedCategories.includes(category) ? 'block' : 'none'};">
                            ${createMasonry(categoryNotes)}
                        </ul>
                    </div>
                `;
            }).join('')}
        </div>
    `;
};

let html = () => {
    saveLastPageVisited("notetaker.html");
    let notesArray = getDataFromLocalStorage(STORAGE_KEY);
    let openedCategories = getDataFromLocalStorage(OPENED_CATEGORIES_KEY) || [];

    if (!Array.isArray(notesArray)) notesArray = [];
    const [query, setQuery] = useState("");

    const filteredNotes = notesArray.filter(note => note.title.toLowerCase().includes(query));

    actions.goToNotePage = (e) => {
        const noteIndex = e.target.closest('.note').dataset.noteindex;
        window.location.href = `note.html?index=${noteIndex}`;
    };

    actions.save = (e) => {
        e.preventDefault();
        const noteForm = document.querySelector("#note-form");

        const noteTitle = noteForm.title.value;
        const noteContent = noteForm.content.value;

        if (!noteTitle || !noteContent) {
            window.location.reload();
            return;
        }

        const noteTags = noteForm.tags.value.split(',');
        const noteCategory = noteForm.category.value;
        const noteCreated = new Date().toISOString();
        const newNote = { title: noteTitle, content: noteContent, created: noteCreated, tags: noteTags, category: noteCategory };
        const newNotesArray = [...notesArray, newNote];
        const indexedNotes = newNotesArray.map((note, index) => {
            return { ...note, index: index };
        });

        saveDataToLocalStorage(STORAGE_KEY, indexedNotes);
        window.location.reload();
    };

    actions.displayForm = () => {
        toggleElementDisplay("show", "#note-form-container");
    };

    actions.filterNotes = () => {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        setQuery(searchTerm);
    };

    actions.toggleCategory = (e) => {
        const category = e.target.closest('.category-group').dataset.category;
        const categoryIndex = openedCategories.indexOf(category);

        if (categoryIndex > -1) {
            openedCategories.splice(categoryIndex, 1);
        } else {
            openedCategories.push(category);
        }

        saveDataToLocalStorage(OPENED_CATEGORIES_KEY, openedCategories);
        window.location.reload();
    };

    actions.allowDrop = (e) => {
        e.preventDefault();
    };

    actions.drag = (e) => {
        e.dataTransfer.setData("text", e.target.dataset.noteindex);
    };

    actions.drop = (e) => {
        e.preventDefault();
        const noteIndex = e.dataTransfer.getData("text");
        const newCategory = e.target.closest('.category-group').dataset.category;

        let notesArray = getDataFromLocalStorage(STORAGE_KEY);
        notesArray = notesArray.map(note => {
            if (note.index == noteIndex) {
                note.category = newCategory === "Uncategorized" ? undefined : newCategory;
            }
            return note;
        });

        saveDataToLocalStorage(STORAGE_KEY, notesArray);
        window.location.reload();
    };

    return `
    <main class="principal">
        ${navigation("notetaker.html")}
        <input value="${query}" type="text" id="search-input" placeholder="Search by title...">
        ${NotesContainer({ notes: filteredNotes, openedCategories })}
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
    `;
};

document.addEventListener("render", () => {
    document.querySelector("#save-button").addEventListener('click', actions.save);
    document.querySelector("#add-new-button").addEventListener('click', actions.displayForm);
    document.querySelectorAll('.open-button').forEach((button) => {
        button.addEventListener('click', actions.goToNotePage);
    });

    const searchinput = document.querySelector("#search-input");
    searchinput.addEventListener('input', actions.filterNotes);

    searchinput.focus();
    searchinput.setSelectionRange(searchinput.value.length, searchinput.value.length);

    // Category Toggle Handlers
    document.querySelectorAll('.category-title').forEach((title) => {
        title.addEventListener('click', actions.toggleCategory);
    });

    // Drag and Drop Handlers
    document.querySelectorAll('.note').forEach((note) => {
        note.addEventListener('dragstart', actions.drag);
    });

    document.querySelectorAll('.category-group').forEach((group) => {
        group.addEventListener('dragover', actions.allowDrop);
        group.addEventListener('drop', actions.drop);
    });
});
