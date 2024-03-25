import {
    useParams
} from 'react-router-dom'
const User = ({ users }) => {
    const id = useParams().id
    if (!users) {
        return <h1>loading....</h1>
    }
    const user = users.find(n => n.id === id)

    if (user) {
        return (
            <div>
                <h2>{user.name}</h2>
                <div>
                    <h3>Added blogs</h3>
                </div>

                <ul>
                    {user.blogs.map(blog => (
                        <li key={blog.id}>
                            {blog.title}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    else {
        return (<div>No user, sorry</div>)
    }
}
export default User