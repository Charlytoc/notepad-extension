window.stateValues = []
let currentRefCount = 0;
window.actions = {};

// const API_URL = 'https://rigobot.herokuapp.com'
const API_URL = 'https://8000-charlytoc-rigobot-sahoq82otnu.ws-us95.gitpod.io'



const RENDER_EVENT = new Event('render')
const render = () => {

    document.querySelector('#root').innerHTML = html();
    currentRefCount = 0;
    document.dispatchEvent(RENDER_EVENT);
}


const fabricateModifier = (internalIndex) => {
    // console.log("fabricating hook state for variable with ref: "+internalIndex)
    const setter = (value, renderize=true) => {
        window.stateValues[internalIndex] = value;
        // console.log("updating value for ref "+internalIndex+" with ", value, window.stateValues )
        if (renderize) {
            render()
        }
    };
    return setter;
}

const useState = (defaultValue) => {
    if(!window.stateValues[currentRefCount]) window.stateValues.push(defaultValue);
    currentRefCount++;
    return [ window.stateValues[currentRefCount-1], fabricateModifier(currentRefCount-1) ];
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

const navigation = () => `
<h2>Charlytoc's notepad</h2>
<div class="navigation">
<a href="home.html" class="link ">easy-copies</a>
<a href="tasks.html" class="link">tasks for today</a>
<a href="monthGoals.html" class="link">month goals</a>
<a href="notetaker.html" class="link">notetaker</a>
</div>
`

window.onload = render();

