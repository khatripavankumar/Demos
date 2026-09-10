import { useEffect, useRef, useState } from 'react'
import './App.css'
import interviewQuestions from './data/interviewQuestions'

const languageTemplates = {
  JavaScript: `function maxSubarraySum(numbers) {
  let best = numbers[0]
  let current = numbers[0]

  for (const number of numbers.slice(1)) {
    current = Math.max(number, current + number)
    best = Math.max(best, current)
  }

  return best
}`,
  Python: `def max_subarray_sum(numbers):
    best = numbers[0]
    current = numbers[0]

    for number in numbers[1:]:
        current = max(number, current + number)
        best = max(best, current)

    return best`,
  TypeScript: `function maxSubarraySum(numbers: number[]): number {
  let best = numbers[0]
  let current = numbers[0]

  for (const number of numbers.slice(1)) {
    current = Math.max(number, current + number)
    best = Math.max(best, current)
  }

  return best
}`,
  Java: `class Solution {
    public int maxSubarraySum(int[] numbers) {
        int best = numbers[0];
        int current = numbers[0];

        for (int index = 1; index < numbers.length; index++) {
            current = Math.max(numbers[index], current + numbers[index]);
            best = Math.max(best, current);
        }

        return best;
    }
}`,
}

const initialEvents = [
  { time: '10:42:18', text: 'Candidate joined session', tone: 'good' },
  { time: '10:43:02', text: 'Face verified · 1 person detected', tone: 'good' },
  { time: '10:43:14', text: 'Microphone and camera ready', tone: 'good' },
]
const initialElapsed = 642

function App() {
  const [candidateAuthenticated, setCandidateAuthenticated] = useState(false)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [candidateStage, setCandidateStage] = useState('dashboard')
  const [showSettings, setShowSettings] = useState(false)
  const [interviewQuestionIndex] = useState(0)
  const [activeView, setActiveView] = useState('Overview')
  const [started, setStarted] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [language, setLanguage] = useState('JavaScript')
  const [code, setCode] = useState(`function maxSubarraySum(numbers) {
  let best = numbers[0]
  let current = numbers[0]

  for (const number of numbers.slice(1)) {
    current = Math.max(number, current + number)
    best = Math.max(best, current)
  }

  return best
}`)
  const [events, setEvents] = useState(initialEvents)
  const elapsedRef = useRef(initialElapsed)

  useEffect(() => {
    if (!started || completed) return undefined
    const timer = window.setInterval(() => {
      elapsedRef.current += 1
      const elapsedElement = document.querySelector('.candidate-strip .mono')
      if (elapsedElement) {
        const minutes = String(Math.floor(elapsedRef.current / 60)).padStart(2, '0')
        const seconds = String(elapsedRef.current % 60).padStart(2, '0')
        elapsedElement.textContent = `${minutes}:${seconds}`
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [completed, started])

  const minutes = String(Math.floor(initialElapsed / 60)).padStart(2, '0')
  const seconds = String(initialElapsed % 60).padStart(2, '0')

  if (!candidateAuthenticated) {
    return <CandidateLogin onContinue={() => { setCandidateAuthenticated(true); setResumeUploaded(false); setCandidateStage('resume') }} />
  }

  if (!resumeUploaded) {
    return <ResumeUpload onUpload={() => { setResumeUploaded(true); setCandidateStage('interview') }} onLogout={() => { setCandidateAuthenticated(false); setResumeUploaded(false); setShowSettings(false) }} />
  }

  if (candidateStage === 'dashboard') {
    return <CandidateDashboard showSettings={showSettings} setShowSettings={setShowSettings} onStart={() => setCandidateStage('interview')} onLogout={() => { setCandidateAuthenticated(false); setResumeUploaded(false); setShowSettings(false) }} />
  }

  function addEvent(text, tone = 'good') {
    const minutes = String(Math.floor(elapsedRef.current / 60)).padStart(2, '0')
    const seconds = String(elapsedRef.current % 60).padStart(2, '0')
    setEvents((items) => [{ time: `${minutes}:${seconds}`, text, tone }, ...items])
  }

  function startSession() {
    setStarted(true)
    const question = interviewQuestions[interviewQuestionIndex]
    addEvent(`Nova started ${question.category} question ${interviewQuestionIndex + 1}`)
  }

  function nextQuestion() {
    setActiveView('Code challenge')
    addEvent('Coding challenge unlocked')
  }

  function runCode() {
    setIsRunning(true); addEvent('Candidate ran code against sample tests')
    window.setTimeout(() => setIsRunning(false), 900)
  }

  function finishTest() { setCompleted(true); addEvent('Assessment submitted · report generated'); setActiveView('Report') }

  const navigation = [['Overview', '01'], ['Interview', '02'], ['Code challenge', '03'], ['Proctoring', '04'], ['Report', '05']]

  return (
    <div className="app-shell candidate-mode">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">s</span><span>signal<span className="brand-dot">.</span></span></div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace-select"><span className="workspace-avatar">N</span><span>Northstar hiring</span><span className="chevron">⌄</span></div>
        <nav className="nav-list" aria-label="Interview sections">
          {navigation.map(([label, number]) => <button type="button" className={`nav-item ${activeView === label ? 'active' : ''}`} onClick={() => setActiveView(label)} key={label}><span className="nav-number">{number}</span><span>{label}</span>{label === 'Proctoring' && <span className="nav-alert">2</span>}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="system-status"><span className="pulse-dot"></span><span>All systems operational</span></div><button type="button" className="profile"><span className="profile-avatar">AM</span><span><strong>Alex Morgan</strong><small>Recruiter</small></span><span className="more">•••</span></button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><div className="eyebrow">LIVE ASSESSMENT / SOFTWARE ENGINEERING</div><h1>{activeView === 'Report' ? 'Assessment report' : 'Maya Chen’s technical screen'}</h1></div><div className="topbar-actions"><span className={`live-chip ${started && !completed ? 'is-live' : ''}`}><span className="chip-dot"></span>{completed ? 'Session complete' : started ? 'Session live' : 'Ready to begin'}</span><button className="icon-button" type="button" title="Open notifications">♧</button><button className="icon-button" type="button" title="More actions">•••</button></div></header>

        {activeView === 'Report' ? <ReportView /> : <><section className="candidate-strip"><div className="candidate-info"><div className="candidate-avatar">MC</div><div><h2>Maya Chen</h2><p>Senior Frontend Engineer <span>·</span> Candidate #NS-2048</p></div></div><div className="strip-stats"><div><span>STAGE</span><strong>{completed ? 'Complete' : started ? 'In progress' : 'Not started'}</strong></div><div><span>TIME ELAPSED</span><strong className="mono">{minutes}:{seconds}</strong></div><div><span>AGENT</span><strong className="agent-name"><span className="agent-avatar">✦</span> Nova</strong></div></div></section><div className="content-grid"><section className="primary-column">{(activeView === 'Overview' || activeView === 'Interview') && <InterviewCard started={started} startSession={startSession} nextQuestion={nextQuestion} />}{activeView === 'Code challenge' && <CodeCard started={started} language={language} setLanguage={setLanguage} code={code} setCode={setCode} addEvent={addEvent} runCode={runCode} isRunning={isRunning} finishTest={finishTest} />}{activeView === 'Proctoring' && <Proctoring events={events} addEvent={addEvent} />}</section><aside className="right-column"><MonitorPanel setActiveView={setActiveView} /><ActivityPanel events={events} /></aside></div></>}
      </main>
    </div>
  )
}

function ResumeUpload({ onUpload, onLogout }) {
  const [fileName, setFileName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (!fileName) return
    setIsAnalyzing(true)
    window.setTimeout(onUpload, 900)
  }

  return (
    <div className="resume-page">
      <header className="login-header"><div className="resume-header-left"><div className="brand"><span className="brand-mark">s</span><span>signal<span className="brand-dot">.</span></span></div><div className="profile-menu-wrap"><button type="button" className="resume-profile-button" aria-label="Open profile menu" aria-expanded={profileMenuOpen} onClick={() => setProfileMenuOpen((value) => !value)}><span className="resume-profile-avatar">MC</span><span className="profile-caret">⌄</span></button>{profileMenuOpen && <div className="resume-profile-menu" role="menu"><div className="resume-profile-summary"><span className="resume-profile-avatar large">MC</span><span><strong>Maya Chen</strong><small>Candidate #NS-2048</small></span></div><div className="profile-menu-divider"></div><button type="button" role="menuitem" onClick={() => setProfileMenuOpen(false)}>Profile</button><button type="button" role="menuitem" onClick={() => setProfileMenuOpen(false)}>Settings</button><button type="button" role="menuitem" className="profile-menu-logout" onClick={onLogout}>Log out</button></div>}</div></div><span className="secure-label"><span className="secure-dot"></span> Secure candidate portal</span></header>
      <main className="resume-main">
        <div className="resume-step"><span>STEP 2 <i>/</i> 3</span><div><b></b><b className="active"></b><b></b></div></div>
        <div className="eyebrow">PROFILE CONTEXT / RESUME ANALYSIS</div>
        <h1>Bring your experience<br /><em>to the conversation.</em></h1>
        <p className="resume-intro">Nova will use your resume to tailor the interview to your skills, projects, and experience.</p>
        <form className="resume-card" onSubmit={handleSubmit}>
          <label className={`resume-dropzone ${fileName ? 'has-file' : ''}`} htmlFor="resume-file"><span className="upload-icon">↑</span><strong>{fileName || 'Drop your resume here'}</strong><small>{fileName ? 'Ready for analysis' : 'PDF, DOC, or DOCX · Max 10 MB'}</small><input id="resume-file" type="file" accept=".pdf,.doc,.docx" onChange={(event) => setFileName(event.target.files?.[0]?.name || '')} /></label>
          <div className="resume-actions"><span><span className="privacy-icon">⌁</span> Your resume stays private</span><button className="login-button" type="submit" disabled={!fileName || isAnalyzing}>{isAnalyzing ? 'Preparing interview...' : 'Start the interview'} <span>→</span></button></div>
        </form>
        <p className="resume-skip">Your resume helps Nova ask better questions during the interview.</p>
      </main>
      <footer className="login-footer"><span>© 2026 Signal interviews</span><span>Privacy <i>·</i> Candidate support</span></footer>
    </div>
  )
}

function CandidateDashboard({ showSettings, setShowSettings, onStart, onLogout }) {
  return (
    <div className="candidate-dashboard">
      <header className="dashboard-header">
        <div className="brand"><span className="brand-mark">s</span><span>signal<span className="brand-dot">.</span></span></div>
        <div className="dashboard-actions"><button type="button" className="dashboard-link" onClick={() => setShowSettings((value) => !value)}>Settings</button><button type="button" className="dashboard-link logout-link" onClick={onLogout}>Log out</button><div className="dashboard-avatar">MC</div></div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-welcome"><div className="eyebrow">CANDIDATE DASHBOARD / NORTHSTAR</div><h1>Welcome back, Maya.</h1><p>Your interview workspace is ready. Take a moment to check your setup, then start when you are ready.</p></div>
        {showSettings && <section className="settings-panel"><div><strong>Interview preferences</strong><span>Camera, microphone, and browser checks run before the session.</span></div><button type="button" className="settings-close" onClick={() => setShowSettings(false)}>Close</button></section>}
        <section className="dashboard-grid">
          <article className="interview-ready-card"><div className="ready-art"><div className="ready-ring ring-a"></div><div className="ready-ring ring-b"></div><div className="ready-core">✦</div></div><div className="ready-content"><span className="status-pill"><i></i> READY TO BEGIN</span><h2>Software Engineering<br />technical screen</h2><p>Hosted by Nova, your adaptive AI interviewer.</p><div className="ready-meta"><span><b>~45 min</b> estimated</span><span><b>2 rounds</b> interview + coding</span></div><button type="button" className="login-button start-dashboard-button" onClick={onStart}>Start interview <span>→</span></button></div></article>
          <aside className="profile-card"><div className="profile-card-heading"><span>YOUR PROFILE</span><button type="button" onClick={() => setShowSettings(true)}>Edit</button></div><div className="large-dashboard-avatar">MC</div><h2>Maya Chen</h2><p>Senior Frontend Engineer</p><div className="profile-details"><span>Email<strong>maya.chen@example.com</strong></span><span>Candidate ID<strong>NS-2048</strong></span></div></aside>
        </section>
        <div className="dashboard-note"><span>⌁</span><p>Before you start, make sure you are somewhere quiet with a stable internet connection. Your camera and microphone will be checked during setup.</p></div>
      </main>
      <footer className="login-footer"><span>© 2026 Signal interviews</span><span>Privacy <i>·</i> Candidate support</span></footer>
    </div>
  )
}

function CandidateLogin({ onContinue }) {
  const [name, setName] = useState('Maya Chen')
  const [email, setEmail] = useState('maya.chen@example.com')
  const [password, setPassword] = useState('Northstar2026')

  function handleSubmit(event) {
    event.preventDefault()
    onContinue()
  }

  return (
    <div className="candidate-login">
      <header className="login-header">
        <div className="brand"><span className="brand-mark">s</span><span>signal<span className="brand-dot">.</span></span></div>
        <span className="secure-label"><span className="secure-dot"></span> Secure candidate portal</span>
      </header>
      <main className="login-main">
        <section className="login-intro">
          <div className="eyebrow">NORTHSTAR / SOFTWARE ENGINEERING</div>
          <h1>Your next signal<br /><em>starts here.</em></h1>
          <p>Complete a guided interview with Nova, then show us how you think in a live coding round.</p>
        </section>
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-card-top"><span className="step-label">STEP 1 <i>/</i> 3</span></div>
          <h2 id="login-title">Enter your invitation</h2>
          <p className="login-card-copy">Use the details from your interview invite to securely join the session.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="candidate-name">Full name<input id="candidate-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required /></label>
            <label htmlFor="candidate-email">Email address<input id="candidate-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
            <label htmlFor="candidate-password">Password<input id="candidate-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
            <button className="login-button" type="submit">Continue to setup <span>→</span></button>
          </form>
          <div className="login-note"><span>⌁</span><p>Your camera and microphone will be checked before the interview begins.</p></div>
        </section>
      </main>
      <footer className="login-footer"><span>© 2026 Signal interviews</span><span>Privacy <i>·</i> Candidate support</span></footer>
    </div>
  )
}

function InterviewCard({ started, startSession, nextQuestion }) { return <div className="panel agent-panel"><div className="panel-heading"><span>AI INTERVIEWER</span><span className="model-label"><span className="tiny-spark">✦</span> NOVA / VOICE MODE</span></div><div className="agent-body voice-only-body"><div className="waveform voice-waveform" aria-label="Live voice waveform">{Array.from({ length: 46 }, (_, index) => <i key={index} style={{ height: `${12 + ((index * 17) % 35)}%` }}></i>)}</div><div className="agent-visual"><div className="agent-orbit orbit-one"></div><div className="agent-orbit orbit-two"></div><div className="agent-core">✦</div><div className="sound-bars"><i></i><i></i><i></i><i></i><i></i></div></div><div className="agent-copy voice-only-copy"><div className="agent-controls"><button className="primary-button" type="button" onClick={() => { if (!started) startSession(); nextQuestion() }}>Continue to coding round<span>→</span></button></div></div></div></div> }

function CodeCard({ started, language, setLanguage, code, setCode, addEvent, runCode, isRunning, finishTest }) { return <div className="panel code-panel"><div className="panel-heading"><span>CODING ROUND <span className="heading-muted">/ TWO SUM VARIANT</span></span><span className="timer"><span className="timer-dot"></span> 24:18 remaining</span></div><div className="challenge-copy"><div><h2>Maximum subarray sum</h2><p>Return the largest possible sum of a contiguous subarray. Aim for O(n) time complexity.</p></div><div className="difficulty">MEDIUM</div></div><div className="test-suite"><div className="test-suite-heading"><span>TEST CASES</span><span>2 visible <i>·</i> 6 hidden</span></div><div className="test-cases"><div className="test-case"><span className="case-number">01</span><div className="case-values"><span><b>Input</b><code>[-2, 1, -3, 4, -1, 2, 1]</code></span><span><b>Output</b><strong>5</strong></span></div></div><div className="test-case"><span className="case-number">02</span><div className="case-values"><span><b>Input</b><code>[5, 4, -1, 7, 8]</code></span><span><b>Output</b><strong>23</strong></span></div></div><div className="hidden-cases"><span className="lock-icon">⌑</span><span>6 hidden test cases</span><small>Used for final evaluation</small></div></div></div><div className="editor-toolbar"><label htmlFor="language">Language</label><select id="language" value={language} onChange={(event) => { const nextLanguage = event.target.value; setLanguage(nextLanguage); setCode(languageTemplates[nextLanguage]); addEvent(`${nextLanguage} selected for coding round`) }}><option>JavaScript</option><option>Python</option><option>TypeScript</option><option>Java</option></select><span className="editor-spacer"></span><span className="test-status"><span className="status-dot"></span> 2 visible · 6 hidden</span><button type="button" className="run-button" onClick={runCode}>{isRunning ? 'Running...' : 'Run code'} <span>▷</span></button></div><textarea className="code-editor" spellCheck="false" value={code} onChange={(event) => setCode(event.target.value)} aria-label="Coding editor"></textarea><div className={`console ${isRunning ? 'running' : ''}`}><span>CONSOLE</span><p>{isRunning ? 'Running 2 visible + 6 hidden tests...' : '✓ 2 visible tests passed  ·  6 hidden tests queued  ·  Runtime 42ms'}</p></div>{started && <button type="button" className="finish-button" onClick={finishTest}>Submit assessment <span>→</span></button>}</div> }

function MonitorPanel({ setActiveView }) { return <div className="panel monitor-panel"><div className="panel-heading"><span>PROCTORING</span><button className="expand-button" type="button" onClick={() => setActiveView('Proctoring')}>View full report ↗</button></div><div className="camera-frame"><div className="camera-label"><span className="record-dot"></span> LIVE CAMERA</div><div className="face-box"><span>FACE DETECTED</span></div><div className="camera-person"><div className="person-head"></div><div className="person-body"></div></div><div className="camera-footer"><span>1 person</span><span>Good lighting</span><span>◉ 98%</span></div></div><div className="signal-list"><Signal label="Camera monitoring" value="Clear" /><Signal label="Face detection" value="1 person" /><Signal label="Gaze / head pose" value="Focused" /><Signal label="Audio monitoring" value="No anomalies" /><Signal label="Screen activity" value="Stable" /></div></div> }
function ActivityPanel({ events }) { return <div className="panel activity-panel"><div className="panel-heading"><span>ACTIVITY LOG</span><span className="live-text">LIVE</span></div><div className="event-list">{events.slice(0, 4).map((event, index) => <div className="event" key={`${event.time}-${index}`}><span className={`event-marker ${event.tone}`}></span><div><p>{event.text}</p><small>{event.time}</small></div></div>)}</div></div> }
function Signal({ label, value }) { return <div className="signal"><span>{label}</span><strong><i></i>{value}</strong></div> }
function ReportView() { return <section className="report-view"><div className="report-hero"><div><div className="eyebrow">FINAL SIGNAL REPORT / GENERATED JUST NOW</div><h2>Strong signal, low risk.</h2><p>Candidate completed the full interview loop with consistent identity, focus, and problem-solving behavior.</p></div><div className="score-ring"><strong>86</strong><span>/ 100</span></div></div><div className="report-grid"><div className="panel score-panel"><div className="panel-heading"><span>PERFORMANCE SNAPSHOT</span><span className="panel-kicker">RECOMMENDATION</span></div><div className="big-recommendation">Advance to onsite <span>↗</span></div><div className="metric-row"><div><span>Communication</span><strong>92</strong></div><div><span>Technical depth</span><strong>84</strong></div><div><span>Problem solving</span><strong>88</strong></div></div></div><div className="panel risk-panel"><div className="panel-heading"><span>PROCTORING SUMMARY</span><span className="status-good">LOW RISK</span></div><div className="risk-line"><strong>98%</strong><div><span className="bar"><i style={{ width: '98%' }}></i></span><small>Session integrity confidence</small></div></div><ul className="report-list"><li><span className="check">✓</span>One person present throughout</li><li><span className="check">✓</span>No tab switches detected</li><li><span className="check">✓</span>No suspicious audio patterns</li></ul></div></div><div className="panel transcript-panel"><div className="panel-heading"><span>AGENT NOTES</span><span>01:12:48 TOTAL SESSION</span></div><div className="note-row"><span className="note-index">01</span><p><strong>Behavioral</strong> — Owned the migration incident clearly and described how she brought the team back to a shared plan.</p><span className="note-score">4.5 / 5</span></div><div className="note-row"><span className="note-index">02</span><p><strong>Technical</strong> — Strong grasp of resilience patterns. Mentioned backoff and circuit breaking without prompting.</p><span className="note-score">4.2 / 5</span></div></div></section> }
function Proctoring({ events, addEvent }) { return <div className="proctoring-page"><div className="proctoring-heading"><div><div className="eyebrow">CONTINUOUS OBSERVATION</div><h2>Session integrity</h2><p>Nova watches for signals that need a human review. Nothing is auto-rejected.</p></div><button type="button" className="secondary-button" onClick={() => addEvent('Manual review note added', 'warning')}>Add review note</button></div><div className="proctor-grid"><div className="panel camera-large"><div className="camera-frame"><div className="camera-label"><span className="record-dot"></span> LIVE CAMERA / 1080P</div><div className="face-box large"><span>FACE DETECTED</span></div><div className="camera-person large-person"><div className="person-head"></div><div className="person-body"></div></div><div className="camera-footer"><span>1 person detected</span><span>Focused 94% of session</span><span>◉ 98% signal</span></div></div></div><div className="panel risk-overview"><div className="panel-heading"><span>RISK OVERVIEW</span><span className="status-good">LOW RISK</span></div><div className="risk-score"><strong>04</strong><span>risk points</span></div><span className="bar"><i style={{ width: '12%' }}></i></span><p>Below the review threshold of 20 points.</p><div className="risk-tags"><span>0 tab switches</span><span>0 extra voices</span><span>1 gaze alert</span></div></div></div><div className="panel full-event-log"><div className="panel-heading"><span>EVENT TIMELINE</span><span>{events.length} events recorded</span></div>{events.map((event, index) => <div className="event timeline-event" key={`${event.time}-full-${index}`}><span className={`event-marker ${event.tone}`}></span><div><p>{event.text}</p><small>{event.time} · Automated signal</small></div></div>)}</div></div> }

export default App
