import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const like = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const blogToChange = (await axios.get(`${baseUrl}/${id}`)).data
  const newObject = { ...blogToChange, likes: blogToChange.likes + 1 }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

const comment = async (id, comment) => {
  const blogToChange = (await axios.get(`${baseUrl}/${id}`)).data
  const newObject = { ...blogToChange, comments: (blogToChange.comments || []).concat(comment) }
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data;
}

export default { getAll, setToken, create, like, remove, comment };
