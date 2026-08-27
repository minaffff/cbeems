import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('C-BEEMS', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('keeps the homepage focused on its calls to action and locale introduction', async () => {
    renderAt('/en/')

    const introduction = await screen.findByRole('region', { name: 'Introduction video' })
    expect(introduction).toHaveAttribute('data-media-asset', 'introduction-en')
    expect(screen.getByRole('link', { name: 'Explore learning resources' })).toHaveAttribute(
      'href',
      '/en/resources',
    )
    expect(screen.queryByText('English + Hindi')).not.toBeInTheDocument()
    expect(screen.queryByText('8 guided lessons')).not.toBeInTheDocument()
    expect(screen.queryByText('Explore more')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Lesson \d:/ })).not.toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'Need urgent support?' })).toHaveLength(1)
  })

  it('selects the Hindi introduction asset on the Hindi homepage', async () => {
    renderAt('/hi/')

    expect(await screen.findByRole('region', { name: 'परिचय वीडियो' })).toHaveAttribute(
      'data-media-asset',
      'introduction-hi',
    )
  })

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
    expect(screen.getAllByRole('button', { name: 'Switch to English' })[0]).toHaveTextContent(
      'EN|हिन्दी',
    )
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
    expect(screen.getAllByRole('link', { name: '123-456-7890' })[0]).toHaveAttribute(
      'href',
      'tel:1234567890',
    )
    expect(screen.getAllByRole('link', { name: 'info@mysite.com' })[0]).toHaveAttribute(
      'href',
      'mailto:info@mysite.com',
    )
    expect(screen.queryByRole('heading', { name: 'Need urgent support?' })).not.toBeInTheDocument()
  })

  it('shows the support band only on the homepage', async () => {
    const lesson = renderAt('/en/resources/mental-health-wellbeing-spectrum')
    await screen.findByRole('heading', { name: 'Mental Health Well-Being Spectrum', level: 1 })
    expect(screen.queryByRole('heading', { name: 'Need urgent support?' })).not.toBeInTheDocument()
    lesson.unmount()

    renderAt('/en/resources/immigrant-specific-mental-health-risk-factors')
    await screen.findByRole('heading', {
      name: 'Immigrant Specific Mental Health Risk Factors',
      level: 1,
    })
    expect(screen.queryByRole('heading', { name: 'Need urgent support?' })).not.toBeInTheDocument()
  })

  it('renders the original-site footer details and essential-only cookie preferences', async () => {
    const user = userEvent.setup()
    renderAt('/en/about')

    expect(screen.getByText(/500 Terry Francine Street/)).toBeVisible()
    expect(screen.getByText(/© 2035 by BEEMS/)).toBeVisible()
    for (const platform of ['Facebook', 'Instagram', 'X', 'TikTok']) {
      expect(screen.getByRole('link', { name: platform }).querySelector('svg')).toBeInTheDocument()
    }
    expect(screen.queryByText('Analytics')).not.toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Essential — always active' })).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Save choices' }))
    expect(localStorage.getItem('cbeems-cookie-choice')).toBe('essential')
    expect(screen.queryByRole('region', { name: 'Your privacy choices' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cookie preferences' }))
    expect(screen.getByRole('region', { name: 'Your privacy choices' })).toBeVisible()
  })

  it('renders the supplied English privacy and accessibility content', async () => {
    const privacy = renderAt('/en/privacy')
    expect(await screen.findByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Privacy Policy - the basics', level: 2 })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Creating a Privacy Policy' })).toHaveAttribute(
      'href',
      'https://support.wix.com/en/article/creating-a-privacy-policy',
    )
    privacy.unmount()

    renderAt('/en/accessibility')
    expect(await screen.findByRole('heading', { name: 'Accessibility Statement', level: 1 })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'What web accessibility is', level: 2 })).toBeVisible()
    expect(screen.getByText('[enter relevant date].')).toBeVisible()
    expect(
      screen.getByRole('link', {
        name: 'Accessibility: Adding an Accessibility Statement to Your Site',
      }),
    ).toHaveAttribute(
      'href',
      'https://support.wix.com/en/article/accessibility-adding-an-accessibility-statement-to-your-site',
    )
  })

  it('renders complete Hindi policy translations on Hindi routes', async () => {
    const privacy = renderAt('/hi/privacy')
    expect(await screen.findByRole('heading', { name: 'गोपनीयता नीति', level: 1 })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'गोपनीयता नीति - मूल बातें', level: 2 })).toBeVisible()
    expect(screen.getByRole('link', { name: 'गोपनीयता नीति बनाना' })).toBeVisible()
    privacy.unmount()

    renderAt('/hi/accessibility')
    expect(await screen.findByRole('heading', { name: 'सुलभता वक्तव्य', level: 1 })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'वेब सुलभता क्या है', level: 2 })).toBeVisible()
    expect(screen.getByText('[संबंधित तारीख दर्ज करें]')).toBeVisible()
    expect(
      screen.getByRole('link', { name: 'सुलभता: अपनी साइट पर सुलभता वक्तव्य जोड़ना' }),
    ).toBeVisible()
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
