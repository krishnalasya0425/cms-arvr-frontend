import React from "react";

const UsersTab = ({ users, loading, deleteUser }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
             
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Assigned Project</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((usr) => (
              <tr key={usr._id} className="hover:bg-gray-50">
                
                <td className="p-2 border">{usr.email}</td>
                <td className="p-2 border">
                  {usr.assignedProject ? usr.assignedProject.name : "None"}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => deleteUser(usr._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersTab;
