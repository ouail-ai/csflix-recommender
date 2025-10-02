import axios from 'axios';
import './UsersTable.css';

function UsersTable({ users, onSuccessfulUserDeletion }) {
  const deleteUser = (userId) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`)
      .then(() => onSuccessfulUserDeletion());
  };

  return (
    <div>
      <table className="users-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Email</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Adult Oui ou Non</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.adult ? 'Oui' : 'Non'}</td>
              <td>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;
