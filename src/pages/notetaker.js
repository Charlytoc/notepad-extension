let html = () => {
    scratchpadContent = getValueFromLocalStorage("scratchpad")

    console.log(scratchpadContent);
    actions.takeNotes = (e) => {
        saveDataToLocalStorage("scratchpad", e.target.value);
    }
    return `
    <main class="principal">
        ${navigation("notetaker.html")}
        <textarea id="scratchpad">${scratchpadContent}</textarea>
    </main>

    
    `
}

document.addEventListener("render", ()=>{
    document.querySelector("#scratchpad").addEventListener('change', actions.takeNotes);

})