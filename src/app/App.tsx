import { LessonDataProvider } from '../features/lessons/context/LessonDataContext'
import { AppRouter } from './AppRouter'
import '../styles/application.css'
import '../styles/buttons.css'
import '../components/layout/layout.css'
import '../pages/pages.css'
import '../features/introduction/introduction.css'
import '../features/lessons/lessons.css'
import '../features/contact/contact.css'
import '../features/policies/policies.css'

export default function App() {
  return (
    <LessonDataProvider>
      <AppRouter />
    </LessonDataProvider>
  )
}
