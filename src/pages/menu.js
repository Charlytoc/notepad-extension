const themeOptions = [
    {
        name: "Dark",
        value: "dark"
    },
    {
        name: "Light",
        value: "light"
    },
]

const changeThemeComponent = (currentTheme) => {
    return `
    <div class="theme-palette">
        <h2>Theme</h2>
        <ul>
            ${themeOptions.map((themeOption) => {
        return `<li class="theme-option ${currentTheme === themeOption.value ? "active" : ""}" data-theme="${themeOption.value}">${themeOption.name}</li>`
    }).join('')}
        </ul>
    </div>
`
}


const THEME_KEY = "theme"


let html = () => {
    let currentTheme = ""
    const theme = getDataFromLocalStorage(THEME_KEY)
    currentTheme = theme ? theme : ""

    return `<main class="menu principal">
        <section class="header">
            <h1>Menu </h1>
            <button class="button">
            ${Link("tasks.html", "Back")}
            </button>
        </section>        
        ${changeThemeComponent(currentTheme)}
        
    </main>`
}

document.addEventListener("render", () => {
    // document.querySelector("#log-button").addEventListener('click', actions.log)
})