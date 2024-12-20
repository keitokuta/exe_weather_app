// OpenWeatherMap APIの設定
const API_KEY = "YOUR_API_KEY"; // ※実際のAPIキーに置き換えてください
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// DOM要素の取得
const currentLocation = document.getElementById("current-location");
const currentTemp = document.getElementById("current-temp");
const currentWeatherDesc = document.getElementById("current-weather-desc");
const currentHumidity = document.getElementById("current-humidity");

const searchInput = document.getElementById("location-search");
const searchButton = document.getElementById("search-button");
const searchLocation = document.getElementById("search-location");
const searchTemp = document.getElementById("search-temp");
const searchWeatherDesc = document.getElementById("search-weather-desc");
const searchHumidity = document.getElementById("search-humidity");

// 天気情報の取得と表示を行う関数
async function getWeatherData(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("天気情報の取得に失敗しました:", error);
        return null;
    }
}

// 都市名から天気情報を取得する関数
async function getWeatherByCity(cityName) {
    try {
        const response = await fetch(`${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=metric&lang=ja`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("天気情報の取得に失敗しました:", error);
        return null;
    }
}

// 天気情報を画面に表示する関数
function displayWeatherData(data, type = "current") {
    if (!data) return;

    const elements = {
        location: type === "current" ? currentLocation : searchLocation,
        temp: type === "current" ? currentTemp : searchTemp,
        desc: type === "current" ? currentWeatherDesc : searchWeatherDesc,
        humidity: type === "current" ? currentHumidity : searchHumidity,
    };

    elements.location.textContent = data.name;
    elements.temp.textContent = `${Math.round(data.main.temp)}℃`;
    elements.desc.textContent = data.weather[0].description;
    elements.humidity.textContent = `湿度: ${data.main.humidity}%`;
}

// 現在位置の取得と天気情報の表示
function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        currentLocation.textContent = "位置情報が利用できません";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            const weatherData = await getWeatherData(latitude, longitude);
            displayWeatherData(weatherData, "current");
        },
        (error) => {
            currentLocation.textContent = "位置情報の取得に失敗しました";
            console.error("位置情報の取得に失敗:", error);
        }
    );
}

// 検索ボタンのクリックイベント
searchButton.addEventListener("click", async () => {
    const cityName = searchInput.value.trim();
    if (!cityName) {
        searchLocation.textContent = "地域名を入力してください";
        return;
    }

    searchLocation.textContent = "検索中...";
    const weatherData = await getWeatherByCity(cityName);

    if (weatherData && weatherData.cod === 200) {
        displayWeatherData(weatherData, "search");
    } else {
        searchLocation.textContent = "地域が見つかりませんでした";
        searchTemp.textContent = "--℃";
        searchWeatherDesc.textContent = "--";
        searchHumidity.textContent = "湿度: --%";
    }
});

// Enterキーでも検索可能にする
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchButton.click();
    }
});

// アプリケーションの初期化
getCurrentLocationWeather();
