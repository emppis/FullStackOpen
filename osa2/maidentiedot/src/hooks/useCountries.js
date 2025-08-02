import { useState, useEffect } from "react"
import axios from "axios"

const useCountries = (query) => {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    if (query.length > 0) {
      axios
        .get("https://studies.cs.helsinki.fi/restcountries/api/all")
        .then((response) => {
          const filtered = response.data.filter((country) =>
            country.name.common.toLowerCase().includes(query.toLowerCase())
          )
          setCountries(filtered)
        })
    } else {
      setCountries([])
    }
  }, [query])

  return countries
}

export default useCountries
