import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import { defaultTheme as theme } from './styles/themes';
import { IntroView } from './components/templates/IntroView';
import { AvailableScheduleView } from './components/templates/AvailableScheduleView';
import { MeetingInfoView } from './components/templates/MeetingInfoView';
import { AttendeeReviewView } from './components/templates/AttendeeReviewView';
import { ReviewRequestSentView } from './components/templates/ReviewRequestSentView';
import { ResponseStatusView } from './components/templates/ResponseStatusView';
import { MeetingConfirmedView } from './components/templates/MeetingConfirmedView';
import { TestFlowShell } from './components/templates/TestFlowShell';
import { usePersistentState } from './hooks';

// 디자인 완성 전까지 배포 주소는 빈 페이지만 보여준다.
// 로컬 개발 서버(pnpm dev)에서는 항상 실제 화면이 보인다.
// 공개할 준비가 되면 FORCE_PUBLIC을 true로 바꾼다.
const FORCE_PUBLIC = false;
const IS_PUBLIC = FORCE_PUBLIC || import.meta.env.DEV;

function AvailableSchedulePage({ onGoHome }) {
  const [scenario, setScenario] = usePersistentState('meetfit:scenario', 'A');
  const [hasConditions, setHasConditions] = usePersistentState('meetfit:hasConditions', false);
  const [role, setRole] = usePersistentState('meetfit:role', 'host');
  const [step, setStep] = usePersistentState('meetfit:step', 1);
  const [confirmedCandidate, setConfirmedCandidate] = usePersistentState('meetfit:confirmedCandidate', null);

  const handleSelectItem = ({ role: nextRole, step: nextStep }) => {
    setRole(nextRole);
    if (nextStep != null) setStep(nextStep);
  };

  const handleConfirm = (candidate) => {
    setConfirmedCandidate(candidate);
    setStep(5);
  };

  const handleReset = () => {
    setRole('host');
    setStep(1);
    setConfirmedCandidate(null);
  };

  return (
    <TestFlowShell
      role={role}
      currentStep={step}
      onSelectItem={handleSelectItem}
      scenario={scenario}
      onScenarioChange={setScenario}
      onGoHome={onGoHome}
      onReset={handleReset}
    >
      {role === 'participant' ? (
        <AttendeeReviewView />
      ) : step === 1 ? (
        <AvailableScheduleView
          hasConditions={hasConditions}
          onShowSchedule={() => setHasConditions(true)}
          onNext={() => setStep(2)}
        />
      ) : step === 2 ? (
        <MeetingInfoView onSubmit={() => setStep(3)} />
      ) : step === 3 ? (
        <ReviewRequestSentView onViewResponses={() => setStep(4)} />
      ) : step === 4 ? (
        <ResponseStatusView onConfirm={handleConfirm} />
      ) : (
        <MeetingConfirmedView
          {...(confirmedCandidate ? { confirmedCandidate } : {})}
        />
      )}
    </TestFlowShell>
  );
}

function MeetFitApp() {
  const [page, setPage] = usePersistentState('meetfit:page', 'intro');

  if (page === 'intro') {
    return <IntroView onStart={() => setPage('flow')} />;
  }

  return <AvailableSchedulePage onGoHome={() => setPage('intro')} />;
}

function App() {
  if (!IS_PUBLIC) {
    return <Box sx={{ minHeight: '100vh', bgcolor: '#FFFFFF' }} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route index element={<MeetFitApp />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
