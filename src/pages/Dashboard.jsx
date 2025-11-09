
import React, { useEffect, useState } from 'react';
import api from '../api';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setSummary(res.data.summary);
        setBudgets(res.data.budgets);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>

     
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5>Total Income</h5>
              <p className="h4">{summary.total_income} ETB</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h5>Total Expenses</h5>
              <p className="h4">{summary.total_expenses} ETB</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5>Balance</h5>
              <p className="h4">{summary.balance} ETB</p>
            </div>
          </div>
        </div>
      </div>
 
  
      <h3>Budgets</h3>
      {budgets.length === 0 ? (
        <p>No budgets set. Go to <a href="/budgets">Budgets</a> to create one.</p>
      ) : (
        <div className="row">
          {budgets.map((budget) => (
            <div key={budget.id} className="col-md-4 mb-3">
              <div className={`card ${budget.alert === 'warning' ? 'border-danger' : budget.alert === 'caution' ? 'border-warning' : ''}`}>
                <div className="card-body">
                  <h5>{budget.category}</h5>
                  <p>Limit: {budget.monthly_limit} ETB</p>
                  <p>Spent: {budget.spent} ETB ({budget.percent_used}%)</p>
                  {budget.alert === 'warning' && (
                    <div className="alert alert-danger p-2 mb-0">⚠️ Exceeded!</div>
                  )}
                  {budget.alert === 'caution' && (
                    <div className="alert alert-warning p-2 mb-0">⚠️ Near limit</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
       <button className="btn btn-success ms-3" align-center onClick={handleExport}>
          📥 Export to Excel
       </button>
    </div>
  );
}

const handleExport = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/export/transactions', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wechi-gebi-transactions.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } else {
      alert('Export failed: ' + (await response.json()).message);
    }
  } catch (err) {
    console.error('Export error:', err);
    alert('Export failed due to network error');
  }
};

<div className="d-flex justify-content-between align-items-center mb-4">
  <h2>Dashboard</h2>
  
  <button className="btn btn-success" onClick={handleExport}>
    📥 Export to Excel
  </button>
</div>

export default Dashboard;