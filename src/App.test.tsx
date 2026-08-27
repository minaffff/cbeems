import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('C-BEEMS technical prototype', () => {
  it('renders all eight resources in the confirmed order', async () => {
    renderAt('/en/resources')

    const cards = await screen.findAllByRole('link', { name: /Lesson \d:/ })
    expect(cards).toHaveLength(8)
    expect(cards[0]).toHaveAccessibleName('Lesson 1: Enculturation & Acculturation')
    expect(cards[7]).toHaveAccessibleName(
      'Lesson 8: Immigrant Specific Mental Health Risk Factors',
    )
  })

  it('switches a lesson from English to Hindi without losing the lesson', async () => {
    const user = userEvent.setup()
    renderAt('/en/resources/enculturation-and-acculturation')

    await screen.findByRole('heading', {
      name: 'Enculturation & Acculturation',
      level: 1,
    })
    const languageButtons = screen.getAllByRole('button', { name: 'Switch to Hindi' })
    await user.click(languageButtons[0])

    expect(
      await screen.findByRole('heading', {
        name: 'संस्कृतिकरण और नई संस्कृति को अपनाना',
        level: 1,
      }),
    ).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'hi')
    expect(screen.getAllByText(/Firebase प्रोटोटाइप चरण/)).toHaveLength(1)
  })

  it('hides Previous on Lesson 1 and hides Next on Lesson 8', async () => {
    const firstLesson = renderAt('/en/resources/enculturation-and-acculturation')
    await screen.findByRole('heading', {
      name: 'Enculturation & Acculturation',
      level: 1,
    })
    expect(screen.queryByRole('link', { name: /Previous lesson/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Next lesson/ })).toBeInTheDocument()
    firstLesson.unmount()

    renderAt('/en/resources/immigrant-specific-mental-health-risk-factors')
    await screen.findByRole('heading', {
      name: 'Immigrant Specific Mental Health Risk Factors',
      level: 1,
    })
    expect(screen.getByRole('link', { name: /Previous lesson/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Next lesson/ })).not.toBeInTheDocument()
  })

  it('keeps the unconfigured contact form visibly disabled', async () => {
    renderAt('/en/contact')

    expect(await screen.findByRole('button', { name: 'Send message' })).toBeDisabled()
    expect(screen.getByText('Submission is disabled in this technical prototype.')).toBeVisible()
  })

  it('renders a designed 404 with recovery links', async () => {
    renderAt('/en/not-a-real-page')

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/en/')
    const resourceLink = screen
      .getAllByRole('link', { name: 'Learning resources' })
      .find((link) => link.getAttribute('href') === '/en/resources')
    expect(resourceLink).toBeDefined()
  })
})
