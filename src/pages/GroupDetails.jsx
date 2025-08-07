import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import axios from '../utils/axios';

const GroupDetails = () => {
  const { groupId } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitAmong, setSplitAmong] = useState([]);
  const [paidByName, setPaidByName] = useState('-- Select who paid --');
  const [balances, setBalances] = useState([]);
  const [personalBalances, setPersonalBalances] = useState([]);
  const [simplified, setSimplified] = useState([]);
  const [splitType, setSplitType] = useState('equal');
  const [customSplits, setCustomSplits] = useState({});
  const [emailInput, setEmailInput] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [newGroupName, setNewGroupName] = useState(groupName);
  const [selectedPayer, setSelectedPayer] = useState('');
  const [filterDesc, setFilterDesc] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');


  const fetchAllGroupData = async () => {
    try {
      const expensesRes = await axios.get(`/expenses/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroupName(expensesRes.data.groupName || "Group");
      setExpenses(expensesRes.data.expenses || []);
      setMembers(expensesRes.data.members || []);

      const balancesRes = await axios.get(`/groups/${groupId}/balances`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalances(balancesRes.data.balances || []);

      if (user?.id) {
        const personalRes = await axios.get(`/groups/${groupId}/balances/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPersonalBalances(personalRes.data || []);
      }

      const simplifyRes = await axios.get(`/groups/${groupId}/simplify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSimplified(simplifyRes.data.simplifiedTransactions || []);

    } catch (err) {
      console.error("Error fetching group data:", err);
    }
  };


  useEffect(() => {
    fetchAllGroupData();
  }, [groupId, token, user]);


  const handleAddExpense = async () => {
    if (!paidBy || !splitAmong.length || !description.trim() || !amount.trim()) {
      return alert("Please fill all fields and select who paid & split among");
    }

    if (splitType === 'custom') {
      const totalSplit = splitAmong.reduce(
        (sum, userId) => sum + Number(customSplits[userId] || 0), 0
      );
      if (totalSplit !== Number(amount)) {
        return alert(`Split total ₹${totalSplit} does not match entered amount ₹${amount}`);
      }
    }

    try {
      let payload = {
        groupId,
        description,
        amount: Number(amount),
        paidBy,
        splitType
      };

      if(splitType === 'equal'){
        payload.splitAmong = splitAmong;
      } else {
        payload.splits = splitAmong.map((userId) => ({
          user: userId,
          amount: Number(customSplits[userId]) || 0
        }));
      }
      
      await axios.post('/expenses/create', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDescription('');
      setAmount('');
      setSplitAmong([]);
      setPaidBy('');
      setPaidByName('--Select who paid--');
      setCustomSplits({});

      fetchAllGroupData();
    
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Failed to add expense");
    }
  };

  const handleSearchUser = async () => {
    setSearchError('');
    setSearchResult(null);

    if (!emailInput.trim()) return setSearchError('Please enter an email');

    try {
      const res = await axios.post('/users/search', { email: emailInput }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSearchResult(res.data);
    } catch (err) {
      setSearchError(err.response?.data?.msg || 'Error searching user');
    }
  };

  const handleAddByEmail = async (userIdToAdd) => {
    try {
      await axios.post(`/groups/${groupId}/add-member`, {
        newMemberId: userIdToAdd
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Member added successfully");
      setEmailInput('');
      setSearchResult(null);
      fetchAllGroupData();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding user');
    }
  };

  const handleDeleteGroup = async () => {
    const confirm = window.confirm("Are you sure you want to delete this group?");
    if (!confirm) return;

    try {
      await axios.delete(
        `/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      alert("Group deleted successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting group:", err);
      alert("Failed to delete group");
    }
  };

  const handleUpdateGroup = async (removeMemberId = null) => {
    try {
      const payload = {
        groupName: newGroupName !== groupName ? newGroupName : undefined,
        removeMemberId
      };

      await axios.patch(`/groups/${groupId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Group updated');
      fetchAllGroupData();
    } catch (err) {
      console.error("Error updating group:", err);
      alert("Update failed");
    }
  };

  const handleApplyFilters = async () => {
    try {
      const params = new URLSearchParams();

      if (filterDesc.trim()) params.append("description", filterDesc);
      if (filterFrom) params.append("from", filterFrom);
      if (filterTo) params.append("to", filterTo);

      const res = await axios.get(`/expenses/groups/${groupId}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExpenses(res.data.expenses || []);
      setGroupName(res.data.groupName);
      setMembers(res.data.members);
    } catch (err) {
      console.error("Error applying filters:", err);
      alert("Failed to apply filters");
    }
  };

  const handleClearFilters = async () => {
    setFilterDesc('');
    setFilterFrom('');
    setFilterTo('');
    fetchAllGroupData();
  };

  const handleRecordSettlement = async (paidBy, paidTo, amount) => { 
      const confirmSettle = window.confirm(
        `Are you sure ${members.find(m => m._id === paidBy)?.name} paid ₹${amount} to ${members.find(m => m._id === paidTo)?.name}?`
      );
      if (!confirmSettle) return;

      try {
        await axios.post(
          `/groups/${groupId}/settle`,
          { paidBy: paidBy, paidTo: paidTo, amount: Number(amount) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Settlement recorded successfully!');
        fetchAllGroupData();
      } catch (err) {
        console.error('Error recording settlement:', err);
        alert(err.response?.data?.msg || 'Failed to record settlement.');
      }
  };

  const filteredExpenses = selectedPayer
      ? expenses.filter(exp => exp.paidBy && exp.paidBy._id === selectedPayer)
      : expenses;

  const applyPredefinedRange = (rangeType) => {
    const today = new Date();
    let startDate = '';
    let endDate = new Date();

    if (rangeType === 'last7') {
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
    } else if (rangeType === 'thisMonth') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (rangeType === 'lastMonth') {
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month
    } else {
      setFilterFrom('');
      setFilterTo('');
      return;
    }

    const from = startDate.toISOString().split('T')[0];
    const to = endDate.toISOString().split('T')[0];
    setFilterFrom(from);
    setFilterTo(to);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-300 to-blue-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg p-6 md:p-10">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4 text-center">{groupName} - Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="font-medium">Filter by Payer</label>
            <select
              className="w-full mt-1 p-2 rounded bg-white/60 border"
              value={selectedPayer}
              onChange={(e) => setSelectedPayer(e.target.value)}
            >
              <option value="">All</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>{member.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium">From</label>
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="w-full p-2 rounded border bg-white/60" />
          </div>

          <div>
            <label className="font-medium">To</label>
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className="w-full p-2 rounded border bg-white/60" />
          </div>

          <div className="md:col-span-3">
            <label className="font-medium">Description</label>
            <input type="text" value={filterDesc} onChange={(e) => setFilterDesc(e.target.value)} placeholder="Search by description" className="w-full mt-1 p-2 rounded border bg-white/60" />
          </div>

          <div className="md:col-span-3 flex flex-wrap gap-2">
            <button onClick={handleApplyFilters} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">Apply</button>
            <button onClick={handleClearFilters} className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded">Clear</button>
            <select onChange={(e) => applyPredefinedRange(e.target.value)} className="ml-auto border p-2 rounded">
              <option value="">Quick Range</option>
              <option value="last7">Last 7 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>
        </div>

        <div className="bg-white/40 rounded-lg p-4 shadow-inner mb-6">
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">Expenses</h3>
          {filteredExpenses.length === 0 ? (
            <p className="text-gray-700">No expenses found for this payer.</p>
          ) : (
            <ul className="space-y-2">
              {filteredExpenses.map((exp) => (
                <li key={exp._id} className="p-3 bg-white/70 rounded-md shadow-sm">
                  <span className="font-medium text-indigo-700">{exp.description || "No Title"}</span>:
                  ₹{exp.amount} — Paid by <span className="font-semibold">{exp.paidBy?.name || "Unknown"}</span> on {new Date(exp.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white/40 rounded-lg p-4 shadow-inner mb-6">
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">Add Member</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="p-2 border rounded bg-white/60 w-full md:w-auto flex-1"
            />
            <button onClick={handleSearchUser} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">Search</button>
          </div>
          {searchError && <p className="text-red-600 mt-2">{searchError}</p>}
          {searchResult && (
            <div className="mt-2">
              <p>Found: <strong>{searchResult.name}</strong> ({searchResult.email})</p>
              <button onClick={() => handleAddByEmail(searchResult._id)} className="mt-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded">Add to Group</button>
            </div>
          )}
        </div>

        <div className="bg-white/40 rounded-lg p-4 shadow-inner mb-6">
          <h3 className="text-xl font-semibold text-indigo-600 mb-4">Add Expense</h3>
          <div className="flex flex-col md:flex-row gap-4 mb-3">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="flex-1 p-2 border rounded bg-white/60"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-40 p-2 border rounded bg-white/60"
            />
          </div>

          <label className="font-medium">Paid By:</label>
          <select
            value={paidBy}
            onChange={(e) => {
              const memberId = e.target.value;
              const selected = members.find((member) => member._id === memberId);
              setPaidBy(memberId);
              setPaidByName(selected ? selected.name : '--Select who paid--');
            }}
            className="w-full mt-1 mb-3 p-2 border rounded bg-white/60"
          >
            <option value="">--Select who paid--</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>{member.name}</option>
            ))}
          </select>

          <div className="mb-4">
            <button onClick={() => setSplitType('equal')} className={`mr-2 px-3 py-1 rounded ${splitType === 'equal' ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}>
              Equal Split
            </button>
            <button onClick={() => setSplitType('custom')} className={`px-3 py-1 rounded ${splitType === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-300'}`}>
              Custom Split
            </button>
            <p className="mt-1 text-sm">Current Split Type: <strong>{splitType.toUpperCase()}</strong></p>
          </div>

          <label className="font-medium">Split Among:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {members.map((member) => (
              <div key={member._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={member._id}
                  checked={splitAmong.includes(member._id)}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSplitAmong((prev) =>
                      e.target.checked
                        ? [...prev, selectedId]
                        : prev.filter((id) => id !== selectedId)
                    );
                  }}
                />
                <label>{member.name}</label>

                {splitType === 'custom' && splitAmong.includes(member._id) && (
                  <input
                    type="number"
                    placeholder="₹"
                    className="w-24 p-1 border rounded bg-white/60"
                    value={customSplits[member._id] || ''}
                    onChange={(e) =>
                      setCustomSplits({
                        ...customSplits,
                        [member._id]: e.target.value
                      })
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <button onClick={handleAddExpense} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow">Add Expense</button>
        </div>

        <div className="bg-white/40 rounded-lg p-4 shadow-inner mb-6">
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">Edit Group</h3>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Enter new group name"
              className="p-2 border rounded bg-white/60 w-full sm:flex-1"
            />
            <button onClick={() => handleUpdateGroup()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">Rename Group</button>
          </div>
        </div>

        <div className="bg-white/40 rounded-lg p-4 shadow-inner mb-6">
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">Members</h3>
          <ul className="space-y-2">
            {members.map(member => (
              <li key={member._id} className="flex items-center justify-between bg-white/60 p-2 rounded">
                <span>{member.name}</span>
                {member._id !== user.id && (
                  <button onClick={() => handleUpdateGroup(member._id)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm">Remove</button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/40 rounded-lg p-4 shadow-inner mb-6">
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">Member Balances</h3>
          <ul className="list-disc list-inside space-y-1">
            {balances.map((bal, idx) => (
              <li key={idx}>
                {bal.user} {bal.status} ₹{Math.abs(bal.balance).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/40 rounded-lg p-4 shadow-inner mb-6">
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">Your Balances</h3>
          {personalBalances.filter(entry => entry.amount !== 0).length === 0 ? (
            <p>All settled up! 🎉</p>
          ) : (
            <ul className="space-y-2">
              {personalBalances.map((entry) =>
                entry.amount !== 0 ? (
                  <li key={entry.userId}>
                    {entry.amount > 0 ? (
                      <span>
                        <strong>{entry.name}</strong> owes you ₹{entry.amount.toFixed(2)}
                      </span>
                    ) : (
                      <span>
                        You owe <strong>{entry.name}</strong> ₹{Math.abs(entry.amount).toFixed(2)}
                        <button
                          onClick={() =>
                            handleRecordSettlement(user.id, entry.userId, Math.abs(entry.amount).toFixed(2))
                          }
                          className="ml-3 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                        >
                          Mark as Paid
                        </button>
                      </span>
                    )}
                  </li>
                ) : null
              )}
            </ul>
          )}
        </div>

        <div className="bg-white/40 rounded-lg p-4 shadow-inner mb-6">
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">Suggested Settlements</h3>
          <ul className="list-disc list-inside space-y-1">
            {simplified.length === 0 ? (
              <li>All settled up! 🎉</li>
            ) : (
              simplified.map((t, idx) => (
                <li key={idx}>
                  {t.from} should pay ₹{t.amount} to {t.to}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="flex justify-between mt-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={handleDeleteGroup}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow"
          >
            Delete Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
