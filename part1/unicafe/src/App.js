import { useState } from 'react'

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad

  if (all == 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  } else {
    return (
      <>
        <h1>Statistics</h1>
        <table>
          <tbody>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="average" value={((good - bad) / all).toFixed(1)} />
            <StatisticLine text="positive" value={(good / all * 100).toFixed(1) + "%"} />
          </tbody>
        </table>
      </>
    )
  }
}

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad;


  const handleClick = (setFunction) => () => {
    setFunction((prev) => prev + 1)
  }



  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleClick(setGood)} text="good" />
      {/* <button onClick={handleClick(setGood)}>good</button> */}
      <button onClick={handleClick(setNeutral)}>neutral</button>
      <button onClick={handleClick(setBad)}>bad</button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
