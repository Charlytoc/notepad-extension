// Must be called html
let html = () => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name')
    const organization = localStorage.getItem('organization')
    const organizationName = localStorage.getItem('organizationName')
    const topic = localStorage.getItem('topic')

    const [fetched, setFetched] = useState(false)
    const [templates, setTemplates] = useState([])


    const url = 'https://8000-charlytoc-rigobot-zs3y5cs1199.ws-us88.gitpod.io/extension/complete/'
    if (!fetched) {
        fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                organization: organization,
                topic: topic,
                template: null
            })
          })
          .then(response => response.json())
          .then((data) =>{
            
            setTemplates(data.templates)
            setFetched(true);
          } )
    }
    actions.selectTemplate = (e) => {
        e.preventDefault();
        localStorage.setItem('template', e.currentTarget.getAttribute('data-template'));
        window.location.href = 'generate.html'
    }
    actions.goToTopics = (e) => {
        e.preventDefault();
        localStorage.removeItem('topic')
        window.location.href = 'topics.html'
    }

    return `<div class="templates">
        <header class="header"><a>Generate</a><a href="train.html">Train</a></header>
        <main>
        <a id="go-to-topics">Choose another topic</a>
        ${templates.map((item) => `<a data-template=${item.id} class="template-container"><h2>${item.name}</h2>
        <div><small>${item.variables} variables</small><i class="fa-solid fa-circle-info information-icon"></i>
        <div class="info-modal">${item.description}</div></div>
    </a>`
        
        )}
        
        </main>
        <footer>
        <div>
        <img src="rigo-icon.png"/>
        <div><p>${name}</p><div><p>${organizationName}</p><button>switch</button></div></div>
        </div>
        <div>
        <button>Logout</button></div>
        </footer>
    </div>`;
}

document.addEventListener("render", ()=>{
    const templateContainers = document.querySelectorAll(".template-container");
    templateContainers.forEach((container) => {
        container.addEventListener('click', actions.selectTemplate);
    });
    document.querySelector("#go-to-topics").addEventListener('click', actions.goToTopics)

})

