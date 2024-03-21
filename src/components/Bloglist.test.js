import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Note />", () => {
  const blog = {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Consider…",
    likes: 5,
    user: { name: "Arto Hellas" },
  };
  test("renders content", async () => {
    render(<Blog blog={blog} />);

    expect(screen.getByText(blog.title)).toBeDefined();
    expect(screen.getByText(blog.author)).toBeDefined();
    expect(screen.queryByText(blog.likes)).toBeNull();
    expect(screen.queryByText(blog.url)).toBeNull();
  });

  test("check that likes and url are shown after button is clicked", async () => {
    render(<Blog blog={blog} />);

    const user = userEvent.setup();
    const button = screen.getByText("show");
    await user.click(button);

    expect(screen.getByText(blog.title)).toBeDefined();
    expect(screen.getByText(blog.author)).toBeDefined();
    expect(screen.getByText(blog.likes)).toBeDefined();
    expect(screen.getByText(blog.url)).toBeDefined();
  });

  test("like button is clicked twice, the event handler received as props is called twice", async () => {
    const mockHandler = jest.fn();

    render(<Blog blog={blog} like={mockHandler} />);

    const user = userEvent.setup();
    const showButton = screen.getByText("show");

    await user.click(showButton);
    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
