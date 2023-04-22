// Must be called html
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
        <h2>notepad <i class="fa-regular fa-comment-dots rose"></i></h2>
             <div class="navigation">
            <a class="link current">calendar</a>
            <a href="home.html" class="link">easy-copies</a>
            <a href="tasks.html" class="link">tasks for today</a>
            <a href="calendar.html" class="link">month goals</a>
            </div>
             <div class="grid-calendar">
            <div class="today">sun</div>
            <div class="today">mon</div>
            <div class="today">tue</div>
            <div class="today">wed</div>
            <div class="today">thu</div>
            <div class="today">fri</div>
            <div class="today">sat</div>
                    ${
                        calendar.map((item) => item === dayOfMonth ? `<div class="today">${item}</div>` : `<div>${item}</div>`).join(' ')
                    }
                    
                </div>
                </div>`;
}

document.addEventListener("render", ()=>{


})