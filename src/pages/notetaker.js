const STORAGE_KEY = "notetaker"
const OPENED_CATEGORIES_KEY = "openedCategories"

function filterCharacters(inputString) {
    return inputString.replace(/[^a-zA-Z]/g, '')
}
function getRandomNumber() {
    return Math.floor(Math.random() * 360) // 0 a 359
}
function getRandomColors(n) {
    const colors = []
    const random = getRandomNumber()
    for (let i = random; i < n + random; i++) {
        const hue = (i * 360) / n 
        const color = `hsla(${hue}, 100%, 50%, 1)` 
        colors.push(color)
    }
    return colors
}
function changeOpacity(hslaString, newOpacity) {
    // Verificamos que el nuevo valor de opacidad esté entre 0 y 1
    if (newOpacity < 0 || newOpacity > 1) {
        throw new Error("La opacidad debe estar entre 0 y 1.");
    }
    
    // Usamos una expresión regular para reemplazar el valor de opacidad
    return hslaString.replace(/,\s*\d+(\.\d+)?\)$/, `, ${newOpacity})`);
}

const noteForm = `
    <form id="note-form">
    <h1>Add a new note</h1>
    <input placeholder="Title" id="scratchpad" type="text" name="title"/>
    <input type="text" placeholder="Category" name="category" />
    <textarea placeholder="Content" name="content"></textarea>
    <button class="button sz-big" id="save-button">Save</button>
    </form>
`

const createMasonry = (notes) => {
    const oddNotes = notes.filter((note, index) => index % 2 !== 0)
    const evenNotes = notes.filter((note, index) => index % 2 === 0)

    return `
        <div class="masonry">
        <div class="column">
        ${evenNotes.map((note) => `
            <li class="note" data-noteindex="${note.index}" draggable="true" tabindex="0">
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
    `
}

const NotesContainer = ({ notes, openedCategories }) => {
    const categories = [...new Set(notes.map(note => note.category || "Uncategorized"))]
    const totalNotes = notes.length // Total de notas


    const colors = getRandomColors(totalNotes)
    return `
        <div id="notes-container">
            ${categories.map((category, categoryIndex) => {

        const categoryNotes = notes.filter(note => (note.category || "Uncategorized") === category)

        const notesPercentage = categoryNotes.length / totalNotes
        return `
                    <div class="category-group" data-category="${category}">
                        <h2 class="category-title">
                         <canvas data-fill="${colors[categoryIndex]}"  data-percentage="${notesPercentage}" width="50" height="50"></canvas>
                        ${category} (${categoryNotes.length})</h2>
                       
                        <ul class="category-list ${filterCharacters(category)}" style="display: ${openedCategories.includes(category) ? 'block' : 'none'};">
                            ${createMasonry(categoryNotes)}
                        </ul>
                    </div>
                `
    }).join('')}
        </div>
    `
}

let html = () => {
    saveLastPageVisited("notetaker.html")
    let notesArray = getDataFromLocalStorage(STORAGE_KEY)
    let openedCategories = getDataFromLocalStorage(OPENED_CATEGORIES_KEY) || []

    if (!Array.isArray(notesArray)) notesArray = []
    const [query, setQuery] = useState(getDataFromLocalStorage("searchTerm"))

    const filteredNotes = notesArray.filter(note => note.title.toLowerCase().includes(query))

    actions.goToNotePage = (e) => {
        const noteIndex = e.target.closest('.note').dataset.noteindex
        window.location.href = `note.html?index=${noteIndex}`
    }

    actions.save = (e) => {
        e.preventDefault()
        const noteForm = document.querySelector("#note-form")

        const noteTitle = noteForm.title.value
        const noteContent = noteForm.content.value

        if (!noteTitle || !noteContent) {
            window.location.reload()
            return
        }

        const noteCategory = noteForm.category.value
        const noteCreated = new Date().toISOString()
        const newNote = { title: noteTitle, content: noteContent, created: noteCreated, category: noteCategory }
        const newNotesArray = [...notesArray, newNote]
        const indexedNotes = newNotesArray.map((note, index) => {
            return { ...note, index: index }
        })

        saveDataToLocalStorage(STORAGE_KEY, indexedNotes)
        window.location.reload()
    }

    actions.displayForm = () => {
        toggleElementDisplay("show", "#note-form-container")
    }

    actions.filterNotes = () => {
        const searchTerm = document.getElementById('search-input').value.toLowerCase()
        saveDataToLocalStorage("searchTerm", searchTerm)
        setQuery(searchTerm)
    }

    actions.toggleCategory = (e) => {

        const category = e.target.closest('.category-group').dataset.category
        console.log(`Hello ${category}`)
        const categoryIndex = openedCategories.indexOf(category)
        const notesList = document.querySelector(`ul.${filterCharacters(category)}`)


        if (categoryIndex > -1) {
            openedCategories.splice(categoryIndex, 1)
            if (notesList) {
                notesList.style.display = "none"
            }
        } else {
            openedCategories.push(category)
            if (notesList) {
                notesList.style.display = "block"
            }
        }
        saveDataToLocalStorage(OPENED_CATEGORIES_KEY, openedCategories)
    }

    actions.allowDrop = (e) => {
        e.preventDefault()
    }

    actions.drag = (e) => {
        e.dataTransfer.setData("text", e.target.dataset.noteindex)
    }

    actions.drop = (e) => {
        e.preventDefault()
        const x = event.clientX // Obtener la posición X del cursor
        const y = event.clientY // Obtener la posición Y del cursor

        const elementUnderCursor = document.elementFromPoint(x, y)
        let isH3 = elementUnderCursor && elementUnderCursor.tagName.toLowerCase() === 'h3'

        console.log(isH3, "IS H3")

        const noteIndex = e.dataTransfer.getData("text")
        const newCategory = e.target.closest('.category-group').dataset.category

        let notesArray = getDataFromLocalStorage(STORAGE_KEY)
        notesArray = notesArray.map(note => {
            if (note.index == noteIndex) {
                note.category = newCategory === "Uncategorized" ? undefined : newCategory
            }
            return note
        })

        saveDataToLocalStorage(STORAGE_KEY, notesArray)
        window.location.reload()
    }

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
    `
}

document.addEventListener("render", () => {
    document.querySelector("#save-button").addEventListener('click', actions.save)
    document.querySelector("#add-new-button").addEventListener('click', actions.displayForm)
    document.querySelectorAll('.open-button').forEach((button) => {
        button.addEventListener('click', actions.goToNotePage)
    })

    const searchinput = document.querySelector("#search-input")
    searchinput.addEventListener('input', actions.filterNotes)

    searchinput.focus()
    searchinput.setSelectionRange(searchinput.value.length, searchinput.value.length)

    document.querySelectorAll('.category-title').forEach((title) => {
        title.addEventListener('click', actions.toggleCategory)
    })

    document.querySelectorAll('.note').forEach((note) => {
        note.addEventListener('dragstart', actions.drag)
    })

    document.querySelectorAll('.category-group').forEach((group) => {
        group.addEventListener('dragover', actions.allowDrop)
        group.addEventListener('drop', actions.drop)
    })

    // Retrieve the saved scroll height from local storage
    const savedScrollHeight = getDataFromLocalStorage('scrollHeight')

    if (savedScrollHeight) {
        document.querySelector("#notes-container").scrollTo(0, parseInt(savedScrollHeight, 10))
    }



    document.querySelector("#notes-container").addEventListener('scroll', (e) => {
        const scrollHeight = e.target.scrollTop
        console.log(`saving scroll ${scrollHeight}`)

        saveDataToLocalStorage('scrollHeight', scrollHeight)
    })
    let cumulative = 0

    function drawPercentageWheel(canvas, percentage) {
        const group = canvas.closest(".category-group")
        console.log(group, "GROUP", canvas.dataset.fill)

        const ctx = canvas.getContext('2d')
        const radius = canvas.width / 2
        const startAngle = cumulative * 2 * Math.PI
        cumulative += percentage
        const endAngle = cumulative  * 2 * Math.PI

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.beginPath()
        ctx.arc(radius, radius, radius, 0, 2 * Math.PI)
        ctx.fillStyle = '#e0e0e009'
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(radius, radius)
        ctx.arc(radius, radius, radius, startAngle, endAngle)
        ctx.lineTo(radius, radius)
        ctx.fillStyle = canvas.dataset.fill
        ctx.fill()
        if (group) {
            group.style.setProperty("--dynamic-color", changeOpacity(canvas.dataset.fill, 0.06))
        }
    }



    document.querySelectorAll("canvas").forEach(c => {


        drawPercentageWheel(c, Number(c.dataset.percentage))
    })

})
