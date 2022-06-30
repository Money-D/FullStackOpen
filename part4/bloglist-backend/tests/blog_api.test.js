const { expect } = require('expect')
const { afterAll, beforeEach } = require('jest-circus')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'testTitle',
    author: 'testAuthor',
    url: 'testURL',
    likes: 2
  },
  {
    title: 'my blog',
    author: 'Money',
    url: 'url',
    likes: 5
  }
]

beforeAll(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct amount of blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('expect unique identifier to be named "id"', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]

  expect(blog.id).toBeDefined()
})

test('a new blog is added correctly', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'testAuthor',
    url: 'testURL',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  let blogsInDb = await Blog.find({})
  blogsInDb = blogsInDb.map(blog => blog.toJSON())
  expect(blogsInDb).toHaveLength(initialBlogs.length + 1)

  const titles = blogsInDb.map(b => b.title)
  expect(titles).toContain('new blog')

  const likes = blogsInDb.map(b => b.likes)
  expect(likes).toContain(3)
})

test('a blog missing the "likes" property is set to 0', async () => {
  const blogMissingLikes = {
    title: 'missing likes',
    author: 'testAuthor',
    url: 'testURL',
  }

  await api
    .post('/api/blogs')
    .send(blogMissingLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  let blogsInDB = await Blog.find({})
  blogsInDB = blogsInDB.map(b => b.toJSON())
  expect(blogsInDB).toHaveLength(initialBlogs.length + 2)

  const titles = blogsInDB.map(b => b.title)
  expect(titles).toContain(
    'missing likes'
  )

  const addedBlog = blogsInDB.filter(blog => {
    return blog.title == 'missing likes'
  })
  expect(addedBlog).toHaveLength(1)
  expect(addedBlog[0].likes).toBeDefined()
  expect(addedBlog[0].likes).toBe(0)
})

test('delete one blog', async () => {
  const blogsBefore = await Blog.find({})
  const toDelete = blogsBefore.map(b => b.toJSON())[0]

  await api
    .delete(`/api/blogs/${toDelete.id}`)
    .expect(204)

  let blogsAfter = await Blog.find({})
  blogsAfter = blogsAfter.map(b => b.toJSON())
  expect(blogsAfter).toHaveLength(3)
})

test('update the likes of a blog', async () => {
  const blogsBefore = await Blog.find({})
  const toUpdate = blogsBefore.map(b => b.toJSON())[0]

  const newBlog = {
    title: 'testTitle',
    author: 'testAuthor',
    url: 'testURL',
    likes: 9
  }

  await api
    .put(`/api/blogs/${toUpdate.id}`)
    .send(newBlog)

  const blogsAfter = await Blog.find({})
  const updatedBlog = blogsAfter
    .map(b => b.toJSON())
    .filter(b => b.title == "testTitle")[0]

  expect(updatedBlog.likes).toBe(9)
})

afterAll(() => {
  mongoose.connection.close()
})