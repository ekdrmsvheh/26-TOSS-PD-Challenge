import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TestFlowShell } from './TestFlowShell';

export default {
  title: 'Template/TestFlowShell',
  component: TestFlowShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  render: () => {
    const [role, setRole] = useState('host');
    const [step, setStep] = useState(1);
    const [scenario, setScenario] = useState('A');

    return (
      <TestFlowShell
        role={role}
        currentStep={step}
        onSelectItem={({ role: nextRole, step: nextStep }) => {
          setRole(nextRole);
          if (nextStep != null) setStep(nextStep);
        }}
        scenario={scenario}
        onScenarioChange={setScenario}
        onGoHome={() => alert('홈으로 돌아가기')}
        onReset={() => {
          setRole('host');
          setStep(1);
        }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            메인 콘텐츠 영역
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            실제 사용 시 이 자리에 AvailableScheduleView, MeetingInfoView 같은 템플릿이 들어갑니다.
          </Typography>
        </Box>
      </TestFlowShell>
    );
  },
};

// maxNumber로 4~6번 항목을 잠근 상태 — 메뉴에는 보이되 클릭이 비활성화된다 (미완성 단계 배포 잠금)
export const Locked = {
  render: () => {
    const [role, setRole] = useState('host');
    const [step, setStep] = useState(1);
    const [scenario, setScenario] = useState('A');

    return (
      <TestFlowShell
        role={role}
        currentStep={step}
        maxNumber={3}
        onSelectItem={({ role: nextRole, step: nextStep }) => {
          setRole(nextRole);
          if (nextStep != null) setStep(nextStep);
        }}
        scenario={scenario}
        onScenarioChange={setScenario}
        onGoHome={() => alert('홈으로 돌아가기')}
        onReset={() => {
          setRole('host');
          setStep(1);
        }}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            1~3번까지만 진행 가능
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            4·5·6번 항목은 메뉴에 보이지만 클릭할 수 없습니다.
          </Typography>
        </Box>
      </TestFlowShell>
    );
  },
};
