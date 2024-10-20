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

    const groqApiKey = getDataFromLocalStorage("GROQ_API_KEY") || ""
    const openaiApiKey = getDataFromLocalStorage("OPENAI_API_KEY") || ""

    return `<main class="menu principal">
        <section class="header">
            <h1>Menu </h1>
            <button class="button">
            ${Link("tasks.html", "Back")}
            </button>
        </section>        
        ${changeThemeComponent(currentTheme)}
        <div class="groq-api-key">
            <h2>GROQ API Key</h2>
            <input type="text" id="groq-api-key-input" value="${groqApiKey}" />
            <button class="button" id="save-groq-api-key-button">Change</button>
        </div>
        <div class="openai-api-key">
            <h2>OpenAI API Key</h2>
            <input type="text" id="openai-api-key-input" value="${openaiApiKey}" />
            <button class="button" id="save-openai-api-key-button">Change</button>
        </div>
    </main>`
}


document.addEventListener("render", () => {
    // document.querySelector("#log-button").addEventListener('click', actions.log)
    document.querySelector("#save-groq-api-key-button").addEventListener('click', () => {
        const newApiKey = document.querySelector("#groq-api-key-input").value
        saveDataToLocalStorage("GROQ_API_KEY", newApiKey)
        window.location.reload()
    })
    document.querySelector("#save-openai-api-key-button").addEventListener('click', () => {
        const newApiKey = document.querySelector("#openai-api-key-input").value
        saveDataToLocalStorage("OPENAI_API_KEY", newApiKey)
        window.location.reload()
    })
})
