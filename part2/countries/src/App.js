import { useEffect, useState } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState("")

  const handleNewSearch = (event) => {
    setSearch(event.target.value)

  }

  const hook = () => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }

  useEffect(hook, [])

  const countriesFiltered = countries.filter(country => {
    let lowerCaseCountry = country.name.common.toLowerCase()
    let lowerCaseSearch = search.toLowerCase()
    return lowerCaseCountry.includes(lowerCaseSearch)
  })

  const showCountry = (name) => {
    setSearch(name)
  }

  return (
    <div className="App">
      <form>
        find countries
        <input
          value={search}
          onChange={handleNewSearch} />
      </form>
      <CountryDisplay countries={countriesFiltered} showCountry={showCountry} />
    </div>
  );
}

const CountryDisplay = (props) => {
  const countries = props.countries
  const showCountry = props.showCountry
  if (countries.length == 1) {
    return <SingleCountry country={countries[0]} />
  } else if (countries.length <= 10) {
    return <CountryList countries={countries} showCountry={showCountry} />
  } else {
    return <div>Too many matches, specify another filter</div>
  }
}

const SingleCountry = ({ country }) =>
  <>
    <h1>{country.name.common}</h1>
    <p>Capital: {country.capital}</p>
    <p>Area: {country.area}</p>
    <Languages languages={Object.values(country.languages)} />
    <Flag country={country} />
    <Weather country={country} />
  </>

const Weather = ({ country }) => {
  const [weatherData, setWeatherData] = useState("")
  
  const hook = () => {
    const cityName = country.capital
    axios
      .get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${api_key}`)
      .then(response => {
        let lat = response.data[0].lat
        let lon = response.data[0].lon
        return { lat, lon }
      }).then(({ lat, lon }) => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`)
          .then(response => {
            return response.data
          }).then(data => {
            console.log("icon", data.weather[0].icon)
            setWeatherData(data)
          })
      })
  }

  useEffect(hook, [])

  let temp = weatherData ? weatherData.main.temp : null
  let wind = weatherData ? weatherData.wind.speed : null
  let icon = weatherData ? weatherData.weather[0].icon : null


  console.log("weather data:", weatherData)
  return (
    <div>
      <h2>Weather in Helsinki</h2>
      <p>Temperature: {temp} Celsius</p>
      <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`}/>
      <p>Wind: {wind}m/s</p>
    </div>
  )


}

const CountryList = (props) => {
  const countries = props.countries
  const showCountry = props.showCountry
  return (
    countries.map(country =>
      <div key={country.name.common}>
        {country.name.common}
        <button onClick={() => showCountry(country.name.common)}>show</button>
      </div>)
  )
}


const Languages = ({ languages }) => {
  const langList = languages.map(lang =>
    <li key={lang}>{lang}</li>)
  return (
    <>
      <h4>Languages</h4>
      <ul>
        {langList}
      </ul>
    </>
  )
}

const Flag = ({ country }) =>
  <img src={country.flags.png} />



export default App;
