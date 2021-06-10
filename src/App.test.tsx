import React from 'react'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Router, HashRouter } from 'react-router-dom'

import App from './App'

test('renders homepage', () => {
  render(
    <HashRouter>
      <App showDevTools={false} />
    </HashRouter>
  )
  const linkElement = screen.getByText(/Getting Started/i, {
    selector: '#getting-started'
  })
  expect(linkElement).toBeInTheDocument()
})

test('landing on a bad page', () => {
  const history = createMemoryHistory()
  history.push('/some/bad/route')
  render(
    <Router history={history}>
      <App showDevTools={false} />
    </Router>
  )

  expect(screen.getByText(/404 - Page Not Found!/i)).toBeInTheDocument()
})

test('landing on explore page', () => {
  const history = createMemoryHistory()
  history.push('/nodes')
  render(
    <Router history={history}>
      <App showDevTools={false} />
    </Router>
  )

  expect(screen.getByText(/AiiDA Node Explorer/i)).toBeInTheDocument()
})

test('landing on provenance page', () => {
  const history = createMemoryHistory()
  history.push('/graph')
  render(
    <Router history={history}>
      <App showDevTools={false} />
    </Router>
  )

  expect(screen.getByText(/Provenance Graph Visualisation/i)).toBeInTheDocument()
})

test('landing on structure page', () => {
  const history = createMemoryHistory()
  history.push('/structures')
  render(
    <Router history={history}>
      <App showDevTools={false} />
    </Router>
  )

  expect(screen.getByText(/Structure Visualisation/i)).toBeInTheDocument()
})

test('landing on groups page', () => {
  const history = createMemoryHistory()
  history.push('/groups')
  render(
    <Router history={history}>
      <App showDevTools={false} />
    </Router>
  )

  expect(screen.getByText(/Node Bookmarks/i)).toBeInTheDocument()
})
