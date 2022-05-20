import axios from 'axios'

const baseURL = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const create = (newObject) => {
    const request = axios.post(baseURL, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    console.log(id)
    const objURL = baseURL + `/${id}`
    const request = axios.put(objURL, newObject)
    return request.then(getAll)
}

const remove = (id) => {
    const request = axios.delete(baseURL + `/${id}`)
    return request.then(getAll)
}

export default { getAll, create, remove, update }