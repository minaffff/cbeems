import { LessonDataProvider } from '../features/lessons/context/LessonDataContext'
import { AppRouter } from './AppRouter'
import '../App.css'

export default function App() {
  return (
    <LessonDataProvider>
      <AppRouter />
    </LessonDataProvider>
  )
}
