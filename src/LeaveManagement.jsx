import { useState } from "react";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [leaveType, setLeaveType] = useState("casual");
  const [days, setDays] = useState(1);
  const [leaveBalance, setLeaveBalance] = useState({ casual: 10, medical: 10 });
  const [leaveHistory, setLeaveHistory] = useState([]);

  const applyLeave = () => {
    if (!name || !phone) {
      alert("Please enter your name and phone number");
      return;
    }

    if (leaveBalance[leaveType] >= days) {
      const leaveStartDate = new Date();
      const leaveEndDate = new Date();
      leaveEndDate.setDate(leaveStartDate.getDate() + days);

      setLeaveBalance({
        ...leaveBalance,
        [leaveType]: leaveBalance[leaveType] - days,
      });

      
      fetch('http://localhost:5000/applyLeave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          leaveType,
          days,
          startDate: leaveStartDate.toLocaleDateString(),
          endDate: leaveEndDate.toLocaleDateString(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'Leave applied successfully!') {
            setLeaveHistory([
              ...leaveHistory,
              {
                name,
                phone,
                type: leaveType,
                days: days,
                startDate: leaveStartDate.toLocaleDateString(),
                endDate: leaveEndDate.toLocaleDateString(),
              },
            ]);
          }
          alert(data.message);
        })
        .catch((error) => {
          console.error('Error applying leave:', error);
          alert('There was an error applying leave.');
        });
    } else {
      alert("Not enough leave balance");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Leave Management System</h2>

      {/* Name Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Name:</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      {/* Phone Number Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Phone Number:</label>
        <input
          type="tel"
          className="w-full p-2 border rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>

      {/* Leave Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Leave Type:</label>
        <select
          className="w-full p-2 border rounded"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
        >
          <option value="casual">Casual Leave</option>
          <option value="medical">Medical Leave</option>
        </select>
      </div>

      {/* Number of Days Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Number of Days:</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={days}
          min="1"
          onChange={(e) => setDays(Number(e.target.value))}
        />
      </div>

      {/* Apply Leave Button */}
      <button
        className="w-full bg-blue-500 text-white p-2 rounded"
        onClick={applyLeave}
      >
        Apply Leave
      </button>

      {/* Leave Balance Display */}
      <h3 className="mt-4 font-semibold">Leave Balance</h3>
      <p>Casual Leave: {leaveBalance.casual} days</p>
      <p>Medical Leave: {leaveBalance.medical} days</p>

      {/* Leave History */}
      <h3 className="mt-4 font-semibold">Leave History</h3>
      <ul>
        {leaveHistory.map((leave, index) => (
          <li key={index} className="border-b py-2">
            <strong>{leave.name} ({leave.phone})</strong> - {leave.type.toUpperCase()} - {leave.days} days from {leave.startDate} to {leave.endDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveManagement;

