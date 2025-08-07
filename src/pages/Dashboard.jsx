import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [newGroupName, setnewGroupName] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      const res = await axios.post(
        '/groups/create',
        { groupName: newGroupName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setGroups([...groups, res.data.group]);
      setnewGroupName('');
    } catch (err) {
      console.error('Group creation failed:', err);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get('/groups/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGroups(res.data);
      } catch (err) {
        console.error('Failed to fetch groups:', err);
      }
    };

    if (token) fetchGroups();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-300 to-blue-200 py-8 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto glassmorphic p-6 rounded-lg shadow-md bg-white/30 backdrop-blur-md border border-white/40">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-indigo-800">SmartSplit Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <p className="mb-6 text-gray-700">Welcome, <span className="font-semibold">{user?.name || 'user'}!</span></p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">Your Groups</h2>
          {groups.length > 0 ? (
            <ul className="space-y-2">
              {groups.map((group, index) => (
                <li key={group._id || index}>
                  <Link
                    to={`/groups/${group._id}`}
                    className="block p-3 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium shadow-sm transition"
                  >
                    {group.groupName}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No groups found.</p>
          )}
        </div>

        <div className="pt-4 border-t border-white/30">
          <h2 className="text-xl font-semibold text-indigo-700 mb-3">Create New Group</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setnewGroupName(e.target.value)}
              placeholder="Enter group name"
              className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleCreateGroup}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
