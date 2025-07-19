const Course = ({ course }) => {

  const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={totalExercises} />
    </div>
  )

}

const Header = (props) => <h2>{props.course}</h2>

const Content = ({ parts }) => {
  return (
  <div>
    {parts.map(({ id, name, exercises}) => (
      <Part key={id} name={name} exercises={exercises} />
    ))}
  </div>
)
}

const Part = ({ name, exercises }) =>  (
  <p>{name} {exercises}</p>
)


const Total = (props) => <p><b>Total of {props.total} exercises</b></p>

export default Course