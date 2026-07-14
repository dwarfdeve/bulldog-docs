import { useState } from 'react'
import { ProfileProvider, useProfile } from './context/ProfileContext'
import Questionnaire from './pages/Questionnaire'
import Dashboard from './pages/Dashboard'
import DocumentPage from './pages/DocumentPage'

function AppRouter() {
  const { profile } = useProfile()
  const [page, setPage] = useState('dashboard')  // 'questionnaire' | 'dashboard' | 'doc'
  const [activeDoc, setActiveDoc] = useState(null)

  // Show questionnaire on first visit
  if (!profile.completed) {
    return <Questionnaire onComplete={() => setPage('dashboard')} />
  }

  if (page === 'doc' && activeDoc) {
    return (
      <DocumentPage
        docId={activeDoc}
        onBack={() => { setPage('dashboard'); setActiveDoc(null) }}
      />
    )
  }

  return (
    <Dashboard
      onSelectDoc={(id) => { setActiveDoc(id); setPage('doc') }}
      onEditProfile={() => setPage('questionnaire')}
    />
  )
}

export default function App() {
  return (
    <ProfileProvider>
      <AppRouter />
    </ProfileProvider>
  )
}
