import { useState } from 'react';
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
const FORCE_PUBLIC = true;
const IS_PUBLIC = FORCE_PUBLIC || import.meta.env.DEV;

// 4~6번 단계(참석자 응답 / 응답 현황 / 미팅 확정)가 아직 완성 전이라
// 배포본에서는 1~3번까지만 진행할 수 있게 잠근다. 네비 메뉴는 보이되 클릭이 막히고,
// 3번 화면에서 다음 단계로 넘어가는 진입점도 숨긴다.
// 로컬 개발(pnpm dev)에서는 잠기지 않아 전체 플로우를 그대로 확인할 수 있다.
// 완성되면 LOCK_PUBLIC_FLOW를 false로 바꾸면 원복된다.
const LOCK_PUBLIC_FLOW = true;
const IS_FLOW_LOCKED = LOCK_PUBLIC_FLOW && !import.meta.env.DEV;
const MAX_UNLOCKED_NUMBER = 3;

function AvailableSchedulePage({ onGoHome }) {
  const [scenario, setScenario] = usePersistentState('meetfit:scenario', 'A');
  const [hasConditions, setHasConditions] = usePersistentState('meetfit:hasConditions', false);
  const [role, setRole] = usePersistentState('meetfit:role', 'host');
  const [step, setStep] = usePersistentState('meetfit:step', 1);
  const [confirmedCandidate, setConfirmedCandidate] = usePersistentState('meetfit:confirmedCandidate', null);
  // AvailableScheduleView의 key로 써서 "처음부터 다시 해보기" 클릭 시 내부 state(참여 인원/시간
  // 조건 등, persist 안 되는 useState들)까지 완전히 초기화되도록 강제 리마운트시킨다
  const [resetToken, setResetToken] = useState(0);

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
    setHasConditions(false);
    setResetToken((n) => n + 1);
  };

  // 배포 잠금 시엔 이전 localStorage 값이 4단계 이상이거나 참석자여도 강제로 1~3번(주최자)로 되돌린다
  const effectiveRole = IS_FLOW_LOCKED ? 'host' : role;
  const effectiveStep = IS_FLOW_LOCKED ? Math.min(step, MAX_UNLOCKED_NUMBER) : step;

  return (
    <TestFlowShell
      role={effectiveRole}
      currentStep={effectiveStep}
      maxNumber={IS_FLOW_LOCKED ? MAX_UNLOCKED_NUMBER : Infinity}
      onSelectItem={handleSelectItem}
      scenario={scenario}
      onScenarioChange={setScenario}
      onGoHome={onGoHome}
      onReset={handleReset}
    >
      {effectiveRole === 'participant' ? (
        <AttendeeReviewView />
      ) : effectiveStep === 1 ? (
        <AvailableScheduleView
          key={resetToken}
          hasConditions={hasConditions}
          scenario={scenario}
          onShowSchedule={() => setHasConditions(true)}
          onNext={() => setStep(2)}
        />
      ) : effectiveStep === 2 ? (
        <MeetingInfoView onSubmit={() => setStep(3)} />
      ) : effectiveStep === 3 ? (
        // 배포 잠금 시엔 다음 단계(응답 현황) 진입 버튼을 숨긴다
        <ReviewRequestSentView onViewResponses={IS_FLOW_LOCKED ? undefined : () => setStep(4)} />
      ) : effectiveStep === 4 ? (
        <ResponseStatusView onConfirm={handleConfirm} />
      ) : (
        <MeetingConfirmedView
          {...(confirmedCandidate ? { confirmedCandidate } : {})}
        />
      )}
    </TestFlowShell>
  );
}

// "시작하기"로 플로우에 새로 진입할 때 이전 세션에서 남은 진행 상태(추천 시간 결과, 참여 인원,
// 단계 등)를 지운다. usePersistentState는 sessionStorage 기반이라 새로고침 중에는 값을 유지해야
// 하지만, 홈에서 플로우를 다시 "시작"하는 시점에는 항상 빈 상태(1단계, 조건 미입력)로 시작해야 한다.
const clearFlowStorage = () => {
  try {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith('meetfit:') && key !== 'meetfit:page')
      .forEach((key) => sessionStorage.removeItem(key));
  } catch {
    /** 시크릿 모드 등으로 접근 불가하면 무시 (애초에 저장도 안 됐을 것) */
  }
};

function MeetFitApp() {
  const [page, setPage] = usePersistentState('meetfit:page', 'intro');

  if (page === 'intro') {
    return (
      <IntroView
        onStart={() => {
          clearFlowStorage();
          setPage('flow');
        }}
      />
    );
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
