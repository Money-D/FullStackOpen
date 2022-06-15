const countBy = require('lodash/countBy');
const groupBy = require('lodash/groupBy');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, curr) => sum += curr.likes

  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length == 0) {
    return null
  }

  let favBlog = blogs[0]
  blogs.forEach(e => {
    if (e.likes > favBlog.likes) {
      favBlog = e
    }
  })

  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length == 0) {
    return null
  }

  let countArray = countBy(blogs, (blog) => blog.author)

  let maxCount = 0;
  let maxAuthor = null;
  
  Object.entries(countArray).forEach(entry => {
    const [author, count] = entry;
    if (count > maxCount) {
      maxAuthor = author
      maxCount = count
    }
  })
  
  return {
    author: maxAuthor,
    blogs: maxCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length == 0) {
    return null
  }

  let maxLikes = 0;
  let maxAuthor = null;

  let authorGroups = groupBy(blogs, (blog) => blog.author)

  Object.entries(authorGroups).forEach(entry => {
    const [author, blogs] = entry;

    const likes = blogs.reduce((sum, curr) => sum += curr.likes, 0)

    if (likes > maxLikes) {
      maxLikes = likes;
      maxAuthor = author
    }
  })  
  
  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}