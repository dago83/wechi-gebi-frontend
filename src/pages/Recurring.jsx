
import React, { useState, useEffect } from 'react';
import api from '../api';
import { format } from 'date-fns';

function Recurring() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    frequency: 'monthly',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: '',
  });

  const fetchRules = async () => {
    try {
      const res = await api.get('/recurring');
      setRules(res.data);
    } catch (err) {
      console.error('Failed to fetch recurring rules:', err);
      alert('Failed to load recurring expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/recurring', {
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category.trim(),
        description: formData.description.trim() || null,
        frequency: formData.frequency,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
      });
      fetchRules();
      resetForm();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Unknown error';
      alert(`Failed to save recurring rule: ${errMsg}`);
    }
  };

  const handleEdit = (rule) => {
    setEditingId(rule.id);
    setFormData({
      type: rule.type,
      amount: rule.amount,
      category: rule.category,
      description: rule.description || '',
      frequency: rule.frequency,
      start_date: format(new Date(rule.start_date), 'yyyy-MM-dd'),
      end_date: rule.end_date ? format(new Date(rule.end_date), 'yyyy-MM-dd') : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recurring rule?')) return;
    try {
      await api.delete(`/recurring/${id}`);
      fetchRules();
    } catch (err) {
     err.alert('Delete failed.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      frequency: 'monthly',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: '',
    });
  };

  const getFrequencyLabel = (freq) => {
    const labels = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
    };
    return labels[freq] || freq;
  };

  const getTypeBadge = (type) => (
    <span className={`badge ${type === 'income' ? 'bg-success' : 'bg-danger'}`}>
      {type === 'income' ? 'Income' : 'Expense'}
    </span>
  );

  if (loading) return <div className="container mt-4">Loading recurring rules...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Recurring Expenses & Income (ETB)</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          ➕ Add Recurring Rule
        </button>
      </div>

      
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            {editingId ? 'Edit Recurring Rule' : 'Create New Recurring Rule'}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label>Type</label>
                  <select
                    className="form-control"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label>Amount (ETB)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="0.01"
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label>Category</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Rent, Salary"
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label>Frequency</label>
                  <select
                    className="form-control"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>End Date (Optional)</label>
                  <input
                    type="date"
                    className="form-control"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    min={formData.start_date}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="e.g., Monthly rent"
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingId ? 'Update Rule' : 'Save Rule'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    
      {rules.length === 0 ? (
        <div className="text-center py-5">
          <h4>No recurring rules set</h4>
          <p className="text-muted">
            Create a recurring rule to automatically generate transactions for rent, salary, subscriptions, etc.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount (ETB)</th>
                <th>Frequency</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td>{getTypeBadge(rule.type)}</td>
                  <td>{rule.category}</td>
                  <td>{rule.description || '-'}</td>
                  <td>
                    {rule.type === 'income' ? '+' : '-'}
                    {parseFloat(rule.amount).toFixed(2)}
                  </td>
                  <td>{getFrequencyLabel(rule.frequency)}</td>
                  <td>{format(new Date(rule.start_date), 'MMM d, yyyy')}</td>
                  <td>
                    {rule.end_date ? format(new Date(rule.end_date), 'MMM d, yyyy') : '—'}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(rule)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(rule.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

     
      <div className="alert alert-info mt-5">
        <h5>💡 Generate Recurring Transactions</h5>
        <p>
          Click below to manually trigger generation of today’s recurring transactions.
          
        </p>
        <button
          className="btn btn-success"
          onClick={async () => {
            if (window.confirm('Generate recurring transactions for today?')) {
              try {
                const res = await api.post('/recurring/generate');
                alert(res.data.message);
                
              } catch (err) {
                err.alert('Failed to generate transactions.');
              }
            }
          }}
        >
          🔄 Generate Today's Recurring Transactions
        </button>
      </div>
    </div>
  );
}

export default Recurring;