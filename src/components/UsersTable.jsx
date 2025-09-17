// components/UsersTable.jsx
export default function UsersTable({ users }) {
  if (!users || users.length === 0)
    return <p className="text-gray-600">No users found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2 border-b">Username</th>
            <th className="text-left px-4 py-2 border-b">Email</th>
            <th className="text-left px-4 py-2 border-b">Role</th>
            <th className="text-left px-4 py-2 border-b">Assigned Project</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{u.username}</td>
              <td className="px-4 py-2 border-b">{u.email}</td>
              <td className="px-4 py-2 border-b capitalize">{u.role}</td>
              <td className="px-4 py-2 border-b">
                {u.assignedProject ? u.assignedProject.name : "Not assigned"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
