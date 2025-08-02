import { useState } from "react"
import useCountries from "./hooks/useCountries"
import CountryList from "./components/CountryList"



const App = () => {
  const [query, setQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(null)
  const countries = useCountries(query)

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <label>find countries </label>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setSelectedCountry(null)
        }}
        placeholder=""
      />
      <CountryList
        countries={countries}
        selectedCountry={selectedCountry}
        onSelect={handleShowCountry}
      />
    </div>
  )
}

export default App
