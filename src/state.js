window.stateValues = []
let currentRefCount = 0;
window.actions = {};

// const API_URL = 'https://rigobot.herokuapp.com'

const RENDER_EVENT = new Event('render')
const render = () => {
    document.querySelector('#root').innerHTML = html();
    currentRefCount = 0;
    document.dispatchEvent(RENDER_EVENT);
}

const fabricateModifier = (internalIndex) => {
    const setter = (value, renderize = true) => {
        window.stateValues[internalIndex] = value;
        if (renderize) {
            render()
        }
    };
    return setter;
}

const useState = (defaultValue) => {
    if (!window.stateValues[currentRefCount]) window.stateValues.push(defaultValue);
    currentRefCount++;
    return [window.stateValues[currentRefCount - 1], fabricateModifier(currentRefCount - 1)];
}

/**
  * Function to save data in local storage using a given key.
  * @param {string} ls_key - The key to use for saving the data in local storage.
  * @param {any} data_to_save - The data to be saved in local storage.
  * @returns {void}
  */
function saveDataToLocalStorage(ls_key, data_to_save) {
    try {
        // Convert the data to JSON string before saving
        const dataString = JSON.stringify(data_to_save);
        // Save the data in local storage using the provided key
        localStorage.setItem(ls_key, dataString);
        // Log a success message
        console.log(`Data saved successfully with key: ${ls_key}`);
    } catch (error) {
        // Log an error message if any exception occurs
        console.error(`Error saving data with key: ${ls_key}`, error);
    }
}

/**
  * Retrieves a value from the localStorage based on the provided key.
  *
  * @param {string} ls_key - The key to search for in the localStorage.
  * @returns {any} - The value associated with the provided key in the localStorage.
  */
function getValueFromLocalStorage(ls_key) {
    try {
        // Retrieve the value from the localStorage based on the provided key
        const value = localStorage.getItem(ls_key);
        // Parse the retrieved value to its original data type
        const parsedValue = JSON.parse(value);
        // Return the parsed value
        return parsedValue;
    } catch (error) {
        // Handle any errors that occur during the retrieval or parsing process
        console.error(`Error retrieving value from localStorage: ${error}`);
        return null;
    }
}

const navigation = (activeUrl) => {

    const windows = [
        {
            name: "easy-copies",
            url: "home.html"
        },
        {
            name: "tasks for today",
            url: "tasks.html"
        },
        {
            name: "month goals",
            url: "monthGoals.html"
        },
        {
            name: "notetaker",
            url: "notetaker.html"
        }
    ]

    return `
    <h2>Charlytoc's notepad</h2>
    <div class="navigation">

    ${windows.map((window)=>{
        return `<a tabindex="-1" href="${window.url}" class="link ${activeUrl === window.url ? "active" : ""}">${window.name}</a>`
    }).join('')}
    </div>
    `
}

window.onload = render();

