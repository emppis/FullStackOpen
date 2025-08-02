import { useEffect, useState } from "react"
import axios from "axios"

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    if (capital) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then((response) => setWeather(response.data))
        .catch((error) => console.error("Weather data retrieval failed:", error))
    }
  }, [capital, api_key])

  if (!weather) return null

  return (
    <div>
      <h3>Weather in {capital}:</h3>
      <p>Temperature: {weather.main.temp} °C</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Weather icon"
      />
    </div>
  )
}

export default Weather
