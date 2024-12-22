const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    windSpeed = document.querySelector(".wind-speed"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status");
weatherCards = document.querySelector("#weather-cards"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    searchForm = document.querySelector("#search"),
    search = document.querySelector("#query");

let currentCity = "";
let currentUnit = "C";
let hourlyorWeek = "Week";
function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    hour = hour % 12;
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}
date.innerText = getDateTime();
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);
function getPublicIp() {
    fetch("https://geolocation-db.com/json/",
        {
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            currentCity = data.city;
            getWeatherData(data.city, currentUnit, hourlyorWeek);
        });
}
getPublicIp();
function getWeatherData(city, unit, hourlyorWeek) {
    console.log(city);
    const apiKey = "2VXNCLWCN2QYBZTHRJU89EP8Q";
    fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
        {
            method: "GET",
        }
    )
        .then((response) => response.json())

        .then((data) => {
            let today = data.currentConditions;
            if (unit === "C") {
                temp.innerText = today.temp;
            } else {
                temp.innerText = celciusToFahrenheit(today.temp);
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            rain.innerText = "Perc -" + today.precip + "%";
            windSpeed.innerText = today.windspeed;
            humidity.innerText = today.humidity + "%";
            visibility.innerText = today.visibility;
            airQuality.innerText = today.winddir;
            measureHumidityStatus(today.humidity);
            mainIcon.src = getIcon(today.icon);
            if (hourlyorWeek === "hourly") {
                updateForecast(data.days[0].hours, unit, "day");
            } else {
                updateForecast(data.days, unit, "week");
            }
        })
        .catch((err) => {
            alert("Invalid Entry ");
        });
}
function celciusToFahrenheit(temp) {
    console.log(temp);
    return ((temp * 9) / 5 + 32).toFixed(1);
}
function measureHumidityStatus(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low";
    } else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate";
    } else {
        humidityStatus.innerText = "High";
    }
}
function getIcon(condition) {
    if (condition === "Partly-cloudy-day") {
        return "icons/sun/27.png";
    } else if (condition === "partly-cloudy-night") {
        return "icons/moon/15.png";
    } else if (condition === "rain") {
        return "icons/rain/39.png";
    } else if (condition === "clear-day") {
        return "icons/sun/26.png";
    } else if (condition === "clear-night") {
        return "icons/moon/10.png";
    } else {
        return "icons/sun/26.png";
    }
}
function getDayName(date) {
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[day.getDay()];
}
function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`;
    } else {
        return `${hour}:${min} AM`;
    }
}
function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";
    let day = 0;
    let numCards = 0;
    if (type === "day") {
        numCards = 24;
    } else {
        numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if (unit === "F") {
            dayTemp = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if (unit === "F") {
            tempUnit = "°F";
        }
        card.innerHTML = `
                        <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" alt="" />
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
            </div>
      
      `;
        weatherCards.appendChild(card);
        day++;
    }
}
fahrenheitBtn.addEventListener("click", () => {
    changeUnit("F");
});
celciusBtn.addEventListener("click", () => {
    changeUnit("C");
});
function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit;
        {
            tempUnit.forEach((elem) => {
                elem.innerText = `°${unit.toUpperCase()}`;
            });
            if (unit === "c") {
                celciusBtn.classList.add("active");
                fahrenheitBtn.classList.remove("active");
            } else {
                celciusBtn.classList.remove("active");
                fahrenheitBtn.classList.add("active");
            }
            getWeatherData(currentCity, currentUnit, hourlyorWeek);
        }
    }
}
hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
    changeTimeSpan("week");
});
function changeTimeSpan(unit) {
    if (hourlyorWeek !== unit) {
        hourlyorWeek = unit;
        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
        currentCity = location;
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
});
‎style.css
    + 234
Original file line number	Diff line number	Diff line change
@@ -0, 0 + 1, 234 @@
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");
:root {
    --primary - clr: #5598fd;
}
* {
    margin: 0;
    padding: 0;
    box- sizing: border - box;
font - family: "Poppins", sans - serif;
}
body {
    display: flex;
    justify - content: center;
    min - height: 100vh;
    min - width: 100px;
    padding: 50px;
    background: var(--primary - clr);
    transition: background - image 0.3s ease;
    background - image: linear - gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
    background - size: cover;
    background - position: center;
}
img {
    width: 100 %;
}
.wrapper {
    display: flex;
    width: 500px;
    min - width: 900px;
    border - radius: 20px;
    overflow: hidden;
}
.sidebar {
    width: 25 %;
    min - width: 230px;
    padding: 15px;
    display: flex;
    flex - direction: column;
    justify - content: space - between;
    background - color: #caf0f8;;
}
.search {
    display: flex;
    align - items: center;
    justify - content: space - between;
    margin - bottom: 30px;
    margin - top: 20px;
    position: relative;
}
.search input {
    width: 100 %;
    height: 40px;
    border: 1px solid #ced4da;
    border - top - left - radius: 4px;
    border - bottom - left - radius: 5px;
    padding: 0 15px;
    font - size: 14px;
    color: #495057;
}
.search button {
    min - width: 40px;
    height: 40px;
    border: none;
    border - top - right - radius: 5px;
    border - bottom - right - radius: 5px;
    background - color: var(--primary - clr);
    font - size: 14px;
    color: #fff;
    cursor: pointer;
}
.weather - icon {
    width: 80 %;
    height: 160px;
    text - align: center;
    margin - top: 5px;
}
.weather - icon #icon {
    width: 80 %;
    object - fit: cover;
}
.temperature {
    display: flex;
}
.temperature #temp {
    font - size: 70px;
    font - weight: 100;
    line - height: 1;
}
.temperature span {
    font - size: 40px;
    margin - top: -10px;
    display: block;
}
.divider {
    width: 100 %;
    height: 1px;
    margin: 20px 0;
    background - color: #000;
}
.condition - rain {
    font - size: 12px;
    text - transform: capitalize;
}
.condition - rain div {
    display: flex;
    align - items: center;
    gap: 10px;
    margin - bottom: 10px;
}
.condition - rain div i {
    width: 20px;
}
.location {
    display: flex;
    align - items: center;
    font - size: 14px;
    gap: 10px;
    margin - top: 10px;
}
.main {
    width: 100 %;
    min - width: 400px;
    padding: 20px 40px;
    position: relative;
    padding - bottom: 90px;
    background - color: #ade8f4;;
}
.main nav {
    display: flex;
    align - items: center;
    justify - content: space - between;
}
nav.options {
    display: flex;
    gap: 20px;
    align - items: center;
}
.options button {
    border: none;
    background: transparent;
    font - size: 16px;
    font - weight: 600;
    color: #495057;
    cursor: pointer;
    text - transform: capitalize;
}
.options button.active {
    color: var(--primary - clr);
}
nav.units button {
    width: 40px;
    height: 40px;
    border - radius: 50 %;
    color: #1a1a1a;
    background - color: #fff;
}
.units button.active {
    color: #fff;
    background - color: #1a1a1a;
}
.main.cards {
    display: flex;
    flex - wrap: wrap;
    gap: 20px;
    margin - top: 50px;
}
.cards.card {
    width: 100px;
    height: 130px;
    border - radius: 20px;
    color: #1a1a1a;
    background - color: #fff;
    text - align: center;
    padding: 10px 0;
    display: flex;
    flex - direction: column;
    justify - content: space - between;
}
.card h2 {
    font - size: 15px;
    font - weight: 600;
}
.card.card - icon {
    width: 50 %;
    margin: 0 auto;
}
.card.day - temp {
    font - size: 12px;
    display: flex;
    align - items: center;
    justify - content: center;
}
.highlights {
    display: flex;
    flex - wrap: wrap;
    gap: 20px;
    margin - top: 50px;
}
.highlights.heading {
    width: 100 %;
    font - size: 20px;
    font - weight: 600;
    text - transform: capitalize;
}
.highlights.card2 {
    width: 250px;
    height: 150px;
    border - radius: 20px;
    color: #1a1a1a;
    background - color: #fff;
    padding: 10px 20px;
    display: flex;
    flex - direction: column;
}
.card2.card - heading {
    color: #2f3e46;
}
.card2.content {
    margin - top: 20px;
}
.card2.content p: first - child {
    text - align: center;
    font - size: 30px;
}
.card2.content p: last - child {
    font - size: 12px;
    margin - top: 20px;
    text - align: left;
}