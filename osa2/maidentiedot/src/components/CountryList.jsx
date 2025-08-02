import { useEffect } from "react"
import Weather from "./Weather"

const CountryList = ({ countries, selectedCountry, onSelect }) => {
  useEffect(() => {
    if (countries.length === 1 && !selectedCountry) {
      onSelect(countries[0])
    }
  }, [countries, selectedCountry, onSelect])

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (selectedCountry) {
    const country = selectedCountry

    return (
      <div>
        <h2>{country.name.common}</h2>
        <img
          src={country.flags.png}
          alt={`Flag of ${country.name.common}`}
          width="150"
        />
        <p><strong>Capital:</strong> {country.capital?.[0]}</p>
        <p><strong>Population:</strong> {country.population.toLocaleString()}</p>

        <p><strong>Languages:</strong></p>
        <ul>
          {Object.values(country.languages).map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>

        <Weather capital={country.capital?.[0]} />
      </div>
    )
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name.common}>
          {country.name.common}{" "}
          <button onClick={() => onSelect(country)}>Show</button>
        </li>
      ))}
    </ul>
  )
}

export default CountryList
