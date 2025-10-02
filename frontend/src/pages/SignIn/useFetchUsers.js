import { useEffect, useState } from 'react';
import axios from 'axios';

// Hook personnalisé pour récupérer les utilisateurs depuis une API
export function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const [usersLoadingError, setUsersLoadingError] = useState(null);

  // Fonction pour récupérer les utilisateurs depuis l'API
  const fetchUsers = () => {
    setUsersLoadingError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users`)
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        setUsersLoadingError('An error occured while fetching users.');
        console.error(error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, usersLoadingError, fetchUsers };
}
