import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

// Create a test QueryClient
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

test('renders learn react query link', () => {
  const testQueryClient = createTestQueryClient();
  
  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );
  
  const linkElement = screen.getByText(/learn react query/i);
  expect(linkElement).toBeInTheDocument();
});