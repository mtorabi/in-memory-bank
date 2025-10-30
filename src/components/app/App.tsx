import React from 'react';
import { useQuery } from '@tanstack/react-query';
import './App.css';

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
    <div className="App">
      <header className="App-header">
        <h1>React Query Example</h1>
        
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && (
          <div>
            <h2>{data.title}</h2>
            <p>{data.body}</p>
          </div>
        )}
        
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://tanstack.com/query"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React Query
        </a>
      </header>
    </div>
  );
}

export default App;