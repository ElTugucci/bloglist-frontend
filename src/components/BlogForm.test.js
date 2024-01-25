// 5.16: Blog list tests, step4
// Make a test for the new blog form. The test should check,
//that the form calls the event handler it received as props with the right
//(details when a new blog is created.
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm> check that the form calls the event handler and that it recieves props with right details', async () => {

  const addBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={addBlog} />)

  const input = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('add blog')

  await user.type(input[0], 'Blog Title test')
  await user.type(input[1], 'Blog Author test')
  await user.type(input[2], 'Blog URL test')
  await user.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('Blog Title test')
  expect(addBlog.mock.calls[0][0].author).toBe('Blog Author test')
  expect(addBlog.mock.calls[0][0].url).toBe('Blog URL test')
})
