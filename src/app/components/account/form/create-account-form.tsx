import React, { useState } from 'react';
import { useCreateBankAccount } from '../hook';

const CreateAccountForm: React.FC = () => {
  const [newAccount, setNewAccount] = useState({
    accountId: '',
    accountHolder: '',
    balance: 0
  });
  const [showForm, setShowForm] = useState(false);
  const createMutation = useCreateBankAccount();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccount.accountHolder) {
      createMutation.mutate({
        ...newAccount,
        active: true
      }, {
        onSuccess: () => {
          setNewAccount({ accountId: '', accountHolder: '', balance: 0 });
          setShowForm(false);
        }
      });
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
      >
        + Create New Account
      </button>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Account</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="account-holder-input">
              Account Holder:
            </label>
            <input
              id="account-holder-input"
              type="text"
              value={newAccount.accountHolder}
              onChange={(e) => setNewAccount({ ...newAccount, accountHolder: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter account holder name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="balance-input">
              Initial Balance:
            </label>
            <input
              id="balance-input"
              type="number"
              value={newAccount.balance}
              onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
        {createMutation.error && (
          <p className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
            Error: {createMutation.error.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateAccountForm;