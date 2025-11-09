
import React, { useState, useEffect } from 'react';
import api from '../api';
import { format } from 'date-fns';


const safeDate = (dateStr) => {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
};

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    monthly_limit: '',
    month: format(new Date(), 'yyyy-MM'),
  });

  
  const fetchBudgets = async () => {
    try {
      const res = await api.get('/dashboard');
      
      const validBudgets = (res.data.budgets || []).filter(b => b.month);
      setBudgets(validBudgets);
    } catch (err) {
      console.error('Failed to load budgets:', err);
      alert('Unable to load budget data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', {
        category: formData.category.trim(),
        monthly_limit: parseFloat(formData.monthly_limit),
        month: `${formData.month}-01`, 
      });
      fetchBudgets(); 
      setShowForm(false);
      setFormData({
        category: '',
        monthly_limit: '',
        month: format(new Date(), 'yyyy-MM'),
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save budget';
      alert(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      err.alert('Failed to delete budget.');
    }
  };

  const getAlertColor = (alert) => {
    if (alert === 'warning') return 'text-danger';
    if (alert === 'caution') return 'text-warning';
    return 'text-success';
  };

  if (loading) return <div className="container mt-4">Loading budgets...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Budgets (ETB)</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          ➕ Set Monthly Budget
        </button>
      </div>

    
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">Set New Budget</div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Category</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Food, Rent"
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Monthly Limit (ETB)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="monthly_limit"
                    value={formData.monthly_limit}
                    onChange={handleInputChange}
                    required
                    min="0.01"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Month</label>
                  <input
                    type="month"
                    className="form-control"
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">Save Budget</button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     
      {budgets.length === 0 ? (
        <div className="text-center py-5">
          <h4>No budgets set</h4>
          <p className="text-muted">
            Create a budget to track your spending and avoid overspending.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {budgets.map((budget) => (
            <div key={budget.id || budget.category + budget.month} className="col-md-6 col-lg-4">
              <div className={`card h-100 shadow-sm ${budget.alert === 'warning' ? 'border-danger border-2' : budget.alert === 'caution' ? 'border-warning border-2' : 'border-primary'}`}>
                <div className="card-body d-flex flex-column">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="mb-1">{budget.category}</h5>
                      {budget.alert === 'warning' && (
                        <span className="badge bg-danger">❌ Exceeded</span>
                      )}
                      {budget.alert === 'caution' && (
                        <span className="badge bg-warning text-dark">⚠️ Alert</span>
                      )}
                      {!budget.alert && (
                        <span className="badge bg-success"> On Track</span>
                      )}
                    </div>
                    <p className="text-muted small">
                      {format(safeDate(budget.month), 'MMMM yyyy')} 
                    </p>
                  </div>

                  <div className="mt-auto">
                    <p className="mb-1">
                      <strong>Limit:</strong> {parseFloat(budget.monthly_limit).toFixed(2)} ETB
                    </p>
                    <p className="mb-1">
                      <strong>Spent:</strong> {parseFloat(budget.spent || 0).toFixed(2)} ETB
                    </p>
                    <div className="progress mb-2" style={{ height: '10px' }}>
                      <div
                        className={`progress-bar ${budget.alert === 'warning' ? 'bg-danger' : budget.alert === 'caution' ? 'bg-warning' : 'bg-primary'}`}
                        role="progressbar"
                        style={{ width: `${budget.percent_used || 0}%` }}
                        aria-valuenow={budget.percent_used || 0}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <p className={`mb-3 ${getAlertColor(budget.alert)}`}>
                      {budget.percent_used ? `${budget.percent_used}% used` : 'No activity'}
                    </p>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-danger flex-fill"
                        onClick={() => handleDelete(budget.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Budgets;