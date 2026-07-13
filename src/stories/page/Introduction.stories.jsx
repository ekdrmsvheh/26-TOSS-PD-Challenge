import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { DocumentTitle, PageContainer } from '../../components/storybookDocumentation';
import { TestFlowShell } from '../../components/templates/TestFlowShell';
import { AvailableScheduleView } from '../../components/templates/AvailableScheduleView';
import { MeetingInfoView } from '../../components/templates/MeetingInfoView';

/**
 * MeetingSchedulePage — App.jsx의 실제 라우트(index route)를 그대로 재현한다.
 * TestFlowShell로 감싼 뒤 step에 따라 AvailableScheduleView(1단계) 또는
 * MeetingInfoView(2단계)를 렌더링하는 것은 src/App.jsx의 AvailableSchedulePage와 동일하다.
 */
function MeetingSchedulePage({ initialStep = 1 }) {
  const [hasConditions, setHasConditions] = useState(initialStep === 2);
  const [role, setRole] = useState('host');
  const [step, setStep] = useState(initialStep);

  return (
    <TestFlowShell role={role} onRoleChange={setRole} currentStep={step}>
      {step === 1 ? (
        <AvailableScheduleView
          hasConditions={hasConditions}
          onShowSchedule={() => setHasConditions(true)}
          onNext={() => setStep(2)}
        />
      ) : (
        <MeetingInfoView onSubmit={() => {}} />
      )}
    </TestFlowShell>
  );
}

export default {
  title: 'Page/미팅 일정 조율',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## 페이지

밋핏의 실제 화면 진입점(\`src/App.jsx\`)을 그대로 재현한 페이지 레벨 스토리입니다.
Template 카테고리의 개별 컴포넌트(AvailableScheduleView, MeetingInfoView, TestFlowShell)가
실제 서비스에서 어떻게 조합되는지 보여줍니다.
        `,
      },
    },
  },
};

export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="Meeting Schedule Page"
        status="Available"
        note="Composed flow reproducing the real App.jsx entry route"
        brandName="MeetFit"
        systemName="Product Docs"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          미팅 일정 조율 페이지
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          밋핏 사이트 진입 시 바로 보이는 화면. TestFlowShell 안에서 단계에 따라
          AvailableScheduleView(1단계) 또는 MeetingInfoView(2단계)를 보여줍니다.
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          구성 컴포넌트
        </Typography>
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '30%' }}>TestFlowShell</TableCell>
                <TableCell>좌측 사이드바(역할 토글 + 플로우 스테퍼) + 메인 콘텐츠 슬롯</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>AvailableScheduleView (1단계)</TableCell>
                <TableCell>미팅 조건 입력과 가능한 시간 탐색</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>MeetingInfoView (2단계)</TableCell>
                <TableCell>추천 시간 선택과 검토 요청 정보 작성</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="body2" color="text.secondary">
          단계별 실제 동작은 아래 Step1 / Step2 스토리에서 직접 조작해 확인할 수 있습니다.
        </Typography>
      </PageContainer>
    </>
  ),
};

export const Step1_MeetingSchedule = {
  parameters: { layout: 'fullscreen' },
  render: () => <MeetingSchedulePage initialStep={1} />,
};

export const Step2_MeetingInfo = {
  parameters: { layout: 'fullscreen' },
  render: () => <MeetingSchedulePage initialStep={2} />,
};
