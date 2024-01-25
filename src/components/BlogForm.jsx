import { useState } from 'react'
const BlogForm = ({ createBlog }) => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    (
      <div>
        <div>
          <h2>Create new</h2>
          <form onSubmit={addBlog}>
            <div >
              Title
              <input type="text"
                className='title'
                value={title}
                name='Title'
                onChange={({ target }) => setTitle(target.value)} />
            </div>
            <div >
              Author
              <input type="text"
                className='author'
                value={author}
                name='Author'
                onChange={({ target }) => setAuthor(target.value)} />
            </div>
            <div >
              URL
              <input type="text"
                value={url}
                name='URL'
                className='url'
                onChange={({ target }) => setUrl(target.value)} />
            </div>
            <div >
              <button type='submit'>add blog</button></div>
          </form>
        </div>
      </div>
    )
  )
}
export default BlogForm