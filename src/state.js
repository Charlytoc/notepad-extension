window.stateValues = []
let currentRefCount = 0;
window.actions = {};

const addThemeToBody = (newTheme) => {
    // console.log(document.body.classList.value);
    document.body.classList.add(`theme-${newTheme}`);
    document.body.classList.add(`${newTheme}`);
    saveDataToLocalStorage("theme", newTheme);
}

const makeTheme = (theme) => {
    if (!theme) {
        theme = getDataFromLocalStorage("theme");
    }
    addThemeToBody(theme);
}

const removePreviousThemes = () => {
    document.body.classList.forEach(className => {
        if (className.startsWith('theme-')) {
            document.body.classList.remove(className);
            className = className.replace('theme-', '');
            document.body.classList.remove(className);
        }
    });
}

const listenForThemeChange = () => {
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function () {
            const desiredTheme = this.getAttribute('data-theme')
            // console.log(`desiredTheme: ${desiredTheme}`);
            // addThemeToBody(desiredTheme)
            saveDataToLocalStorage("theme", desiredTheme);
            removePreviousThemes();
            render();
        });
    });

    document.querySelectorAll('.navigation-urls').forEach(option => {
        option.addEventListener('click', function (event) {
            event.preventDefault();
            const _href = this.getAttribute('href');
            deletePageCacheAndRedirect(_href.split('.')[0]);
        });
    });

    document.addEventListener('mousemove', function (e) {
        var follower = document.getElementById('cursor-follower');
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';


        // Obtener el elemento en la posición del cursor
        var elementAtCursor = document.elementFromPoint(e.clientX, e.clientY);

        // Obtener la clase del elemento
        var elementClass = elementAtCursor.className;

        if (elementClass.includes("button") ||
            elementClass.includes("link") || elementClass.includes("clickeable")) {
            follower.style.width = "20px";
            follower.style.height = "20px";
        }
        else {
            follower.style.width = "10px";
            follower.style.height = "10px";
        }
    });


}


const RENDER_EVENT = new Event('render')
const render = () => {
    document.querySelector('#root').innerHTML = html();
    currentRefCount = 0;
    document.dispatchEvent(RENDER_EVENT);

    makeTheme();
    listenForThemeChange();
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
        // console.log(`Data saved successfully with key: ${ls_key}`);
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
function getDataFromLocalStorage(ls_key) {
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




window.onload = render();


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
    chrome.storage.local.set({ [name]: object });
}

const alarm = (hash, title, message, dateInMilliseconds, periodInMinutes = 5) => {
    const updateAlarms = (alarms) => {
        saveInLs("alarms", { ...alarms, [hash]: { title, message, dateInMilliseconds, periodInMinutes } })
    }
    retrieveFromLs("alarms", updateAlarms);

    chrome.alarms.create(hash, { when: dateInMilliseconds, periodInMinutes: periodInMinutes });

    console.log(`Alarm ${title} was created`);
}

const clearAlarm = (hash) => {
    chrome.alarms.clear(hash, function (wasCleared) {
        console.log(`Alarm ${hash} was cleared: ${wasCleared}`);
    });
}




function getDataFromChromeStorage(key, callback) {
    chrome.storage.local.get([key], function (result) {
        callback(result[key]);
    });
}

function saveDataToChromeStorage(key, data) {
    chrome.storage.local.set({ [key]: data }, function () {
        // console.log('Data saved ', data);
    });
}


function saveLastPageVisited(pageUrl) {
    saveDataToChromeStorage("lastPageVisited", pageUrl);
}

function deleteDataFromChromeStorage(key, callback) {
    chrome.storage.local.remove(key, callback);
}

function redirectToLastPage() {
    getDataFromChromeStorage("lastPageVisited", function (url) {
        if (!url) {
            return
        }
        window.location.href = url;
    }
    );
}

function deletePageCacheAndRedirect(pageName) {
    const _r = () => {
        window.location.href = pageName + ".html";
    }
    deleteDataFromChromeStorage("lastPageVisited", _r);
}