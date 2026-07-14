// App entry / router (replaces React App.jsx + main.jsx)
import { getProfile, updateProfile, completeProfile } from './profile.js'
import { renderQuestionnaire } from './pages/questionnaire.js'
import { renderDashboard } from './pages/dashboard.js'
import { renderDocumentPage } from './pages/document.js'

const root = document.getElementById('root')

function showQuestionnaire() {
  renderQuestionnaire(root, {
    profile: getProfile(),
    updateProfile,
    completeProfile,
    onComplete: showDashboard,
  })
}

function showDashboard() {
  const profile = getProfile()
  if (!profile.completed) return showQuestionnaire()
  renderDashboard(root, {
    profile,
    onSelectDoc: (docId) => showDocument(docId),
    onEditProfile: showQuestionnaire,
  })
}

function showDocument(docId) {
  const profile = getProfile()
  renderDocumentPage(root, {
    docId,
    profile,
    onBack: showDashboard,
  })
}

function start() {
  // Debug helper for automated screenshot testing only: ?seed=1 seeds a completed demo profile.
  if (new URLSearchParams(location.search).get('seed') === '1' && !getProfile().completed) {
    completeProfile()
  }
  const profile = getProfile()
  if (!profile.completed) {
    showQuestionnaire()
    return
  }
  const docParam = new URLSearchParams(location.search).get('doc')
  if (docParam) {
    showDocument(docParam)
  } else {
    showDashboard()
  }
}

start()
