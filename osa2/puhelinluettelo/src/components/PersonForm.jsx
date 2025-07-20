const PersonForm = ({ onSubmit, newName, handleNameChange, newNumber, handleNumberChange}) => (
  <form onSubmit={onSubmit}>
        <div>name: <input name="name" value={newName} onChange={handleNameChange} autoComplete="off"/></div>
        <div>number: <input name="number" value={newNumber} onChange={handleNumberChange} autoComplete="off"/></div>
        <div><button type="submit">add</button></div>
      </form>
)

export default PersonForm