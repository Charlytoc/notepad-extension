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

window.onload = render();

