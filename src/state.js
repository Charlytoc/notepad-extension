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
            name: "calendar",
            url: "calendar.html"
        },
        {
            name: "easy-copies",
            url: "copies.html"
        },
        {
            name: "tasks for today",
            url: "tasks.html"
        },
        {
            name: "notetaker",
            url: "notetaker.html"
        }
    ]

    return `
    <h2>Charlytoc's notepad</h2>
    <div class="navigation">

    ${windows.map((window) => {
        return `<a tabindex="-1" href="${window.url}" class="${activeUrl === window.url ? "active" : ""}">${window.name}</a>`
    }).join('')}
    </div>
    `
}

window.onload = render();


const notify = (opts) => {
    chrome.notifications.create('', {
        title: opts.title,
        message: opts.message,
        iconUrl: 'icon.png',
        type: 'basic'
    }, function (notificationId) {
        console.log('Notification created with ID:', notificationId);
    });
}

function retrieveFromLs(name, callback) {
    // name: string - the key of the object to retrieve from chrome.storage.local
    // callback: function - a function to call with the retrieved object
    chrome.storage.local.get([name], function (result) {
        callback(result[name]);
    });
}


/**
 * 
 * @param {name} name: string 
 * @param {object}  object: object 
 */
function saveInLs(name, object) {
    // name: string - the key under which to store the object
    // object: any - the object to be stored in chrome.storage.local
    chrome.storage.local.set({ [name]: object });
}



const alarm = (title, timeToFireInMilisecond, periodInMinutes=5) => {
    const updateAlarms = (alarms) => {
        saveInLs("alarms", { ...alarms, [title]: "Hey Charly, remember to make this now! 😤" })
    }
    retrieveFromLs("alarms", updateAlarms);

    chrome.alarms.create(title, { when: Date.now() + timeToFireInMilisecond, periodInMinutes: periodInMinutes });
}

const clearAlarm = (title) => {
    chrome.alarms.clear(title, function (wasCleared) {
        console.log(`Alarm ${title} was cleared: ${wasCleared}`);
    });
}