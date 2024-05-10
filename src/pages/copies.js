const COPIES_STORAGE_KEY = "copies"

const modal = (id) => {
    return `
    <div id="modal-${id}" class="copied-modal">
    Copied to clipboard!
    </div>
    `
}

const linkComponent = (href) => {
    return `<a tabindex="-1" href="${href}" target="_blank"><i class="fa-solid fa-up-right-from-square clickeable"></i></a>`
}

const noteComponent = (item, index) => `
<div data-note-id=${index} tabindex=0 class="note">
${modal(index)}
<p>${item.name}</p>
<div>
    <button class="" tabindex="-1">
        <i data-note-id=${index} class="fa-solid fa-trash erase-note clickeable"></i>
    </button>
    <button class="" tabindex="-1">
        <i data-note-id=${index}  class="fa-solid fa-copy copy-note clickeable"></i>
    </button>
    ${item.link.includes("http") ? linkComponent(item.link) : ""}
</div>
</div>
 `

let html = () => {
    redirectToLastPage()
    const [query, setQuery] = useState("");

    const copiesList = getDataFromLocalStorage(COPIES_STORAGE_KEY) || [];

    const filteredCopies = copiesList.filter(copy => copy.name.toLowerCase().includes(query));



    actions.handleKeyup = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        const copy = filteredCopies[index]
        // I want to make something in delete is pressed
        if (e.keyCode === 46) {
            actions.deleteNote(e)
        }
        // I want to make something if enter is pressed
        if (e.keyCode === 13) {
            actions.copyNote(e)
        }
        if (e.keyCode === 32 && copy.link.includes("http")) {
            chrome.tabs.create({ url: copy.link });
        }
        if (e.keyCode === 37) {
            if (index > 0) {
                const previousNote = document.querySelector(`[data-note-id="${index - 1}"]`);
                previousNote.focus();
            }
        }
        if (e.keyCode === 38) {
            if (index > 0) {
                const previousNote = document.querySelector(`[data-note-id="${index - 3}"]`);
                previousNote.focus();
            }
        }
        if (e.keyCode === 39) {
            if (index < filteredCopies.length - 1) {
                const nextNote = document.querySelector(`[data-note-id="${index + 1}"]`);
                nextNote.focus();
            }
        }
        if (e.keyCode === 40) {
            if (index < filteredCopies.length - 1) {
                const nextNote = document.querySelector(`[data-note-id="${index + 3}"]`);
                nextNote.focus();
            }
        }

    }


    actions.deleteNote = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        filteredCopies.splice(index, 1);
        saveDataToLocalStorage('copies', filteredCopies);
        location.reload()
    }

    actions.notifyUser = (e) => {
        // notify({title: "Hello bro", message: "You are doing great!"})
    }

    actions.copyNote = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        const text = filteredCopies[index].link
        navigator.clipboard.writeText(text)
            .then(() => {
                const copyModal = document.querySelector(`#modal-${index}`);
                console.log(copyModal);
                copyModal.style.animationPlayState = 'running';

            })
            .catch((err) => {
                console.error('Failed to copy text: ', err);
            });
    }

    actions.filterNotes = () => {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        setQuery(searchTerm);
    };

    actions.showForm = () => {
        toggleElementDisplay("show", "#note-form-container");
    }

    actions.createNote = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const name = formData.get("name");
        const note = formData.get("content");

        if (name && note) {
            copiesList.push({ name, link: note });
            saveDataToLocalStorage(COPIES_STORAGE_KEY, copiesList);
            location.reload()
        }
    }

    return `<div class="home principal">
    ${navigation('copies.html')}
    ${FloatingLeftButton({ identifier: "show-form-button" })}
    <input value="${query}" autofocus type="text" id="search-input" placeholder="Search by title...">
    ${Form({
        innerHTML: `
        <form id="note-form">
        <input name="name"  id="name-input" placeholder="Title of the new note" type="text" />
        <textarea name="content"  rows=3  id="note-input" placeholder="Write here the content to save and press enter" type="text" ></textarea>
        <button class="button" type="submit" >Add</button>
        </form>
        `,
        identifier: "note-form-container"
    })}
    <section class="note-container">
    ${filteredCopies.map(noteComponent).join(' ')}
    </section>
    </div>`;
}

document.addEventListener("render", () => {
    document.querySelectorAll(".note").forEach((note) => {
        note.addEventListener("keyup", actions.handleKeyup);
        // note.addEventListener("click", actions.notifyUser);
    })
    document.querySelectorAll(".erase-note").forEach((button) => {
        button.addEventListener("click", actions.deleteNote);
    });
    document.querySelectorAll(".copy-note").forEach((button) => {
        button.addEventListener("click", actions.copyNote);
    });
    document.querySelector("#show-form-button").addEventListener('click', actions.showForm);
    document.querySelector("#note-form").addEventListener('submit', actions.createNote);
    
    
    document.querySelector("#search-input").addEventListener('input', actions.filterNotes);
    // Focus on search input
    const searchInput =document.querySelector("#search-input")
    searchInput.focus();
    searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    // document.querySelector("#search-input").focus();
})