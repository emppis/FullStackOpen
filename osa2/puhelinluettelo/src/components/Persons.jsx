const Person = ({ name, number }) => (
  <li>{name} {number}</li>
)

const Persons = ({ persons }) => (
  <ul>
    {persons.map((person) => (
      <Person key={person.name} name={person.name} number={person.number} />
    ))}
  </ul>  
)

export default Persons