// Must be called html
let html = () => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name')
    const organization = localStorage.getItem('organization')
    const organizationName = localStorage.getItem('organizationName')
    const topic = localStorage.getItem('topic')
    const template_id = localStorage.getItem('template')

    const [fetched, setFetched] = useState(false)
    const [template, setTemplate] = useState([])
    const url = 'https://8000-charlytoc-rigobot-zs3y5cs1199.ws-us88.gitpod.io'

    if (!fetched) {
        fetch(url+'/extension/complete/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                organization: organization,
                topic: topic,
                template: template_id
            })
          })
          .then(response => response.json())
          .then((data) =>{
            setTemplate(data.template);
            setFetched(true);
          } )
    }

    actions.goToTemplates = (e) => {
        e.preventDefault();
        localStorage.removeItem('template');
        window.location.href = "templates.html"
    }
    actions.generate = (e) => {
        fetch(`${url}/v1/prompting/complete/?template_id=${template_id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: inputsObject,
                extension: true
            })
          })
          .then(response => response.json())
          .then((data) =>{
            // const modal = document.querySelector(".modal-copied")
            // let answer = JSON.stringify(data.answer);
            // answer = answer.replace(/\\n/g, '').replace(/\\/g, '').replace(/"/g, '');
            // navigator.clipboard.writeText(answer);
            // modal.style.display = 'block';
            // setTimeout(()=>{
            //     modal.style.display = 'none';
            // }, 1000)
            chrome.tabs.create({url: `${url}/view/complete/?completion=${data.completion}`});
          } )
    }
    const inputsObject = {}
    actions.handleInput = (e) => {
        inputsObject[e.target.name] = e.target.value
    }
    const returnInputs = (obj) => {
        let inputs = ""
        for (let variable in obj) {
            inputs += `<input class="variable-input" name="${variable}" type="text" placeholder="${obj[variable]}"/>`
        }
        return inputs
    }

     return `<div class="generate">
        <header class="header"><a>Generate</a><a href="train.html">Train</a></header>
        <main>
        <a id="go-to-templates">Generate something else</a>
        <h2>${template.name}:</h2>
        ${returnInputs(template.variables)}
        <button id="generate-button">Generate</button>
        <div class="modal-copied">Answer copied to clipboard!</div>
        </main>
        <footer>
        <div>
        <img src="rigo-icon.png"/>
        <div><p>${name}</p><div><p>${organizationName}</p><button id="switch-organization">switch</button></div></div>
        </div>
        <div>
        <button>Logout</button>
        </div>
        </footer>
    </div>`;
}

document.addEventListener("render", ()=>{
    document.querySelector("#go-to-templates").addEventListener('click', actions.goToTemplates)
    document.querySelector("#generate-button").addEventListener('click', actions.generate)
    const variableInputs = document.querySelectorAll(".variable-input")
    variableInputs.forEach((input) => input.addEventListener('change', actions.handleInput))
    document.querySelector("#switch-organization").addEventListener('click', actions.switchToOrganization)

})