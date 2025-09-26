import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UsersTable({ token }) {
  const [users, setUsers] = useState([]);

  // fetch users list
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);


  // update user after assign/unassign
  const refreshUser = (userId, assignedProject) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, assignedProject } : u
      )
    );
  };

  return (
    <table className="table-auto border-collapse border border-gray-300 w-full">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 px-4 py-2">Username</th>
          <th className="border border-gray-300 px-4 py-2">Email</th>
          <th className="border border-gray-300 px-4 py-2">Assigned Project</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id}>
            <td className="border border-gray-300 px-4 py-2">{u.username}</td>
            <td className="border border-gray-300 px-4 py-2">{u.email}</td>
            <td className="border border-gray-300 px-4 py-2">
              {u.assignedProject ? u.assignedProject.name : "Not Assigned"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}