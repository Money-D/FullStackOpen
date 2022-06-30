import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)


  const hook = () => {
    personService.getAll()
      .then(returnedPersons => {
        setPersons(returnedPersons)
      })
  }

  useEffect(hook, [])

  const addContact = (event) => {
    event.preventDefault();
    if (persons.map((person) => person.name.toLowerCase()).includes(newName.toLowerCase())) {
      if (window.confirm(`${newName} is already in you phonebook, replace the old number with a new one?`)) {
        const personToReplace = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
        const newPerson = {
          name: personToReplace.name,
          number: newNumber
        }
        personService.update(personToReplace.id, newPerson)
        .then(returnedPersons => {
          setPersons(returnedPersons)
          setNotification(`Updated ${newName}'s number`)
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        }).catch(err => {
          setNotification(`Information of ${newName} has already been removed from server`)
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService
      .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotification(`Added ${newName}`)
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
        .catch(error => {
          setNotification(error.response.data.error)
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
    }
  }

  const personsToShow = persons.filter((person) => {
    let lowerCaseName = person.name.toLowerCase()
    let lowerCaseFilter = filter.toLowerCase()
    return lowerCaseName.includes(lowerCaseFilter)
  })

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <PersonForm addContact={addContact}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} setPersons={setPersons} />
    </div>
  )
}


const Filter = ({ filter, setFilter }) =>
  <div>
    filter shown with <input value={filter} onChange={e => setFilter(e.target.value)} />
  </div>

const PersonForm = ({ addContact, newName, newNumber, setNewName, setNewNumber }) =>
  <>
    <form onSubmit={addContact}>
      <div>
        name: <input value={newName} onChange={e => setNewName(e.target.value)} />
      </div>
      <div>
        number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </>

const Persons = ({ persons, setPersons }) =>
  <>
    {persons.map(person =>
      <Person
        key={person.id}
        person={person}
        remove={() => {
          if (window.confirm(`Do you want to delete ${person.name}?`)) {
            personService.remove(person.id)
              .then((returnedPersons) => {
                setPersons(returnedPersons)
              })
          }
        }}
      />)}
  </>


const Person = ({ person, remove }) =>
  <div>
    {person.name} {person.number}
    <button onClick={remove}>delete</button>
  </div>

const Notification = ({message}) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color: 'red',
    fontSize: 15,
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}


export default App