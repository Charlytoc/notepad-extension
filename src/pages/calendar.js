// Must be called html
const days = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
}

const daysHeader = () => {
    return Object.values(days).map((day) => `<div class="day-marker">${day}</div>`).join('')
}

const makeDay = (day, today) => {
    if (day === today) {
        return `<div class="today">${day}</div>`
    }
    return `<div>${day}</div>`
}

let html = () => {



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

    return `<main class="calendar principal">
                ${navigation("calendar.html")}
                <div class="grid-calendar">
                    ${daysHeader()}
                    ${calendar.map((item) => makeDay(item, dayOfMonth)).join(' ')}
                </div>
            </main>`;
}

document.addEventListener("render", () => {
})