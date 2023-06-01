// Must be called html


const navigation = () => `<div class="navigation">
<a href="calendar.html" class="link current">calendar</a>
<a href="home.html" class="link ">easy-copies</a>
<a href="tasks.html" class="link">tasks for today</a>
<a href="monthGoals.html" class="link">month goals</a>
</div>
`
let html = () => {

    const days = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    }


    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const dayOfMonth = date.getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
const makeCalendar = (firstDay, numberOfDays) => {
    let whiteSpaces = firstDay - 1
    const calendar = Array.from({ length: numberOfDays }, (_, i) => i + 1);
    while (whiteSpaces >= 0) {
        calendar.unshift(' ')
        whiteSpaces -= 1
    }
    return calendar
}

const calendar = makeCalendar(firstDayOfMonth, daysInMonth)

        return `<div class="calendar principal">
        <h2>Notepad <i class="fa-regular fa-comment-dots rose"></i> - by Charlytoc</h2>
            ${navigation()}
             <div class="grid-calendar">
            <div class="today">s</div>
            <div class="today">m</div>
            <div class="today">t</div>
            <div class="today">w</div>
            <div class="today">t</div>
            <div class="today">f</div>
            <div class="today">s</div>
                    ${
                        calendar.map((item) => item === dayOfMonth ? `<div class="today">${item}</div>` : `<div>${item}</div>`).join(' ')
                    }
                    
                </div>
                </div>`;
}

document.addEventListener("render", ()=>{


})