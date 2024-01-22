const changeThemeComponent = () => {
    return `
    <div class="theme-palette">
        <ul>
            <li class="theme-option" data-theme="dark">Dark</li>
            <li class="theme-option" data-theme="light">Light</li>
        </ul>
    </div>
    `
}

let html = () => {
    const [todos, setTodos] = useState({})
    const [fetched, setFetched] = useState(false)

    if (!fetched) {
        console.log("fetching data needed for the view");
        // setFetched(true)
        // getDataFromChromeStorage(TODOS_STORAGE_KEY, (prevTodos) => {
        //     setTodos(prevTodos)
        //     setFetched(true)
        // })
    }

    
    actions.log = () => {
        console.log("logging, minimal action");
    }

    return `<main class="menu principal">
        <h1>Menu</h1>
        ${Link("calendar.html", "Back to calendar")}
        
        ${changeThemeComponent()}
        <div class="menu-options">
            <a href="tasks.html" class="menu-option">Tasks</a>
            <a href="settings.html" class="menu-option">Settings</a>
        </div>
    </main>`
}

document.addEventListener("render", () => {
    document.querySelector("#log-button").addEventListener('click', actions.log)
})