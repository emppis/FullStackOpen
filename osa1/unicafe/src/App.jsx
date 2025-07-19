import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)


const History = (props) => {
    const total = props.good + props.neutral + props.bad
    if (total === 0){
      return <div>
        No feedback given</div>
    }
    const average = (props.good - props.bad) / total
    const positive = (props.good / total) * 100
  return (
      <Statistics 
      good={props.good}
      neutral={props.neutral}
      bad={props.bad}
      all={total}
      average={average.toFixed(2)}
      positive={positive.toFixed(1)}/>
  )
}


const Statistics = (props) => {

  return (
    <table>
      <tbody>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={props.all} />
      <StatisticLine text="average" value={props.average} />
      <StatisticLine text="positive" value={`${props.positive} %`} />
      </tbody>
    </table>
  )
}
const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <History good={good} neutral={neutral} bad={bad} />
      
    </div>
  )
}


export default App