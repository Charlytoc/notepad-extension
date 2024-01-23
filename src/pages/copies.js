const modal = (id) => {
    return `
    <div id="modal-${id}" class="copied-modal">
    Copied to clipboard!
    </div>
    `
}

const linkComponent = (href) => {
    return `<a tabindex="-1" href="${href}" target="_blank"><i class="fa-solid fa-up-right-from-square"></i></a>`
}

const noteComponent = (item, index) => `
<div data-note-id=${index} tabindex=0 class="note">
${modal(index)}
<p>${item.name}</p>
<div>
    <button class="" tabindex="-1">
        <i data-note-id=${index} class="fa-solid fa-trash erase-note"></i>
    </button>
    <button class="" tabindex="-1">
        <i data-note-id=${index}  class="fa-solid fa-copy copy-note"></i>
    </button>
    ${item.link.includes("http") ? linkComponent(item.link) : ""}
</div>
</div>
 `

let html = () => {
    // const CURRENT_WINDOW = 'HOME'
    // const LAST_WINDOW = localStorage.getItem('LAST_WINDOW');
    // if (LAST_WINDOW !== CURRENT_WINDOW) {
    //     localStorage.setItem('LAST_WINDOW', CURRENT_WINDOW);
    // }

    const copiesList = JSON.parse(localStorage.getItem('data')) || [];

    const easyCopy = {
        name: "",
        link: ""
    }

    actions.addNote = (e) => {
        if (e.keyCode === 13) {
            const inputValue = e.target.value
            easyCopy.link = inputValue
            if (inputValue) {
                let data = JSON.parse(localStorage.getItem('data')) || [];
                data.push(easyCopy);
                localStorage.setItem('data', JSON.stringify(data));
                location.reload()
            }
        }
    }

    actions.handleKeyup = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        const copy = copiesList[index]
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
            if (index < copiesList.length - 1) {
                const nextNote = document.querySelector(`[data-note-id="${index + 1}"]`);
                nextNote.focus();
            }
        }
        if (e.keyCode === 40) {
            if (index < copiesList.length - 1) {
                const nextNote = document.querySelector(`[data-note-id="${index + 3}"]`);
                nextNote.focus();
            }
        }

    }

    actions.addName = (e) => {
        easyCopy.name = e.target.value
    }

    actions.deleteNote = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        copiesList.splice(index, 1);
        localStorage.setItem('data', JSON.stringify(copiesList))
        location.reload()
    }
    
    actions.notifyUser = (e) => {
        // notify({title: "Hello bro", message: "You are doing great!"})
        // alarm("Hello bro, this alarm will be fired was fired in 10 seconds", "You are doing great!", 1000)
    }

    actions.copyNote = (e) => {
        const index = parseInt(e.target.dataset.noteId);
        const text = copiesList[index].link
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
    return `<div class="home principal">
    ${navigation('copies.html')}
    <input  id="name-input" placeholder="Title of the new note" type="text" />
    <textarea rows=1  id="note-input" placeholder="Write here the content to save and press enter" type="text" ></textarea>
    <section class="note-container">
    ${copiesList.map(noteComponent).join(' ')}
    </section>
    </div>`;
}

document.addEventListener("render", () => {
    document.querySelector("#note-input").addEventListener('keyup', actions.addNote);
    document.querySelector("#name-input").addEventListener('keyup', actions.addName);
    document.querySelectorAll(".note").forEach((note) => {
        note.addEventListener("keyup", actions.handleKeyup);
        note.addEventListener("click", actions.notifyUser);
    })
    document.querySelectorAll(".erase-note").forEach((button) => {
        button.addEventListener("click", actions.deleteNote);
    });
    document.querySelectorAll(".copy-note").forEach((button) => {
        button.addEventListener("click", actions.copyNote);
    });

})