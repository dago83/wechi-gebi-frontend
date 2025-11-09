
import React, { useState, useEffect } from 'react';
import api from '../api';
import { format } from 'date-fns';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        
        await api.put(`/transactions/${editingId}`, formData);
      } else {
       
        await api.post('/transactions', formData);
      }
      fetchTransactions(); 
      resetForm();
    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || '',
      date: format(new Date(transaction.date), 'yyyy-MM-dd'),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
       alert(`Delete failed: ${err.message || 'Unknown error'}`);
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
      date: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  const getAmountColor = (type) => (type === 'income' ? 'text-success' : 'text-danger');

  if (loading) return <div className="container mt-4">Loading transactions...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Transactions (ETB)</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          ➕ Add Transaction
        </button>
      </div>

      
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            {editingId ? 'Edit Transaction' : 'Add New Transaction'}
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
                    placeholder="e.g., Food, Salary"
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label>Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label>Description</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingId ? 'Update' : 'Save'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {transactions.length === 0 ? (
        <p>No transactions yet. Add your first income or expense!</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount (ETB)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{format(new Date(t.date), 'MMM d, yyyy')}</td>
                  <td>
                    <span className={`badge ${t.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                  <td>{t.category}</td>
                  <td>{t.description || '-'}</td>
                  <td className={getAmountColor(t.type)}>
                    {t.type === 'income' ? '+' : '-'}
                    {parseFloat(t.amount).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(t.id)}
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
    </div>
  );
}

export default Transactions;