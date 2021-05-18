import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/AiiDA Dashboard/i, {selector: "#app-header"});
  expect(linkElement).toBeInTheDocument();
});
