const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { expect } = require('expect')
const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    let usersAtStart = await User.find({})
    usersAtStart = usersAtStart.map(user => user.toJSON())

    const newUser = {
      username: 'moneyd',
      name: 'Money Dhaliwal',
      password: 'password'
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    let usersAtEnd = await User.find({})
    usersAtEnd = usersAtEnd.map(user => user.toJSON())
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('and duplicate user is added', async () => {
    let usersAtStart = await User.find({})
    usersAtStart = usersAtStart.map(u => u.toJSON())

    const newUser = {
      username: 'root',
      name: 'Money Dhaliwal',
      password: 'password'
    }
    
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('username must be unique')

    let usersAtEnd = await User.find({})
    usersAtEnd = usersAtEnd.map(u => u.toJSON())
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('request invalid username responds with error', async () => {
    let usersAtStart = await User.find({})
    usersAtStart = usersAtStart.map(u => u.toJSON())

    const newUser = {
      username: 'ab',
      name: 'Money Dhaliwal',
      password: 'password'
    }
    
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('username must be included and be atleast 3 characters long')
    
    let usersAtEnd = await User.find({})
    usersAtEnd = usersAtEnd.map(u => u.toJSON())
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('request with no password responds with error', async () => {
    let usersAtStart = await User.find({})
    usersAtStart = usersAtStart.map(u => u.toJSON())

    const newUser = {
      name: 'Money Dhaliwal',
      password: 'password'
    }
    
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.error).toContain('username must be included and be atleast 3 characters long')
    
    let usersAtEnd = await User.find({})
    usersAtEnd = usersAtEnd.map(u => u.toJSON())
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  afterAll(() => {
    mongoose.connection.close()
  })
})