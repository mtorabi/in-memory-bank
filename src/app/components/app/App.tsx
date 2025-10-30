import React from 'react';
import { useQuery } from '@tanstack/react-query';
import BankAccountsList from '../account/list/list-component';

// Example API fetch function
const fetchExample = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function App() {
  // Using React Query to fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: ['example-post'],
    queryFn: fetchExample,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Welcome to In-Memory Bank</h1>
      </header>
      <main className="container mx-auto p-6">
        <BankAccountsList />
      </main>
    </div>
  );
}

export default App;