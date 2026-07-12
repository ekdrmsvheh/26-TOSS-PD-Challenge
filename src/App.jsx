import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { defaultTheme as theme } from './styles/themes';
import { MeetingScheduleForm } from './components/templates/MeetingScheduleForm';
import { AvailableScheduleView } from './components/templates/AvailableScheduleView';

// 디자인 완성 전까지 배포 주소는 빈 페이지만 보여준다.
// 로컬 개발 서버(pnpm dev)에서는 항상 실제 화면이 보인다.
// 공개할 준비가 되면 FORCE_PUBLIC을 true로 바꾼다.
const FORCE_PUBLIC = false;
const IS_PUBLIC = FORCE_PUBLIC || import.meta.env.DEV;

const initialAttendees = [
  { id: 'host', name: '이지혜', role: '프로덕트 디자이너', isHost: true },
  { id: 'a1', name: '박서준', role: '백엔드 엔지니어', roleLevel: 'required' },
  { id: 'a2', name: '김도윤', role: '마케터', roleLevel: 'recommended' },
];

const directory = [
  { id: 'a1', name: '박서준', role: '백엔드 엔지니어' },
  { id: 'a2', name: '김도윤', role: '마케터' },
  { id: 'a3', name: '최유나', role: '디자이너' },
  { id: 'a4', name: '정민아', role: 'PM' },
  { id: 'a5', name: '이하늘', role: 'QA 엔지니어' },
];

function HomePage() {
  return (
    <Box
      sx={{
        p: 4,
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h3" gutterBottom>
        밋핏
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        모두의 일정을 딱 맞게, Meet Fit
      </Typography>
      <Typography component={Link} to="/meeting" sx={{ color: 'primary.main', mt: 2 }}>
        밋핏 시작하기 →
      </Typography>
    </Box>
  );
}

function AvailableSchedulePage() {
  const [hasConditions, setHasConditions] = useState(false);

  return (
    <AvailableScheduleView
      hasConditions={hasConditions}
      onShowSchedule={() => setHasConditions(true)}
      onNext={() => {}}
    />
  );
}

function MeetingSchedulePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [deadlineRange, setDeadlineRange] = useState(null);
  const [attendees, setAttendees] = useState(initialAttendees);

  const handleAttendeeAdd = (selectedIds) => {
    setAttendees((prev) => {
      const kept = prev.filter((a) => a.isHost || selectedIds.includes(a.id));
      const existingIds = kept.map((a) => a.id);
      const added = selectedIds
        .filter((id) => !existingIds.includes(id))
        .map((id) => {
          const person = directory.find((d) => d.id === id);
          return { id, name: person.name, role: person.role, roleLevel: 'recommended' };
        });
      return [...kept, ...added];
    });
  };

  return (
    <Box sx={{ maxWidth: '1040px', mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        밋핏
      </Typography>
      <MeetingScheduleForm
        title={title}
        onTitleChange={setTitle}
        purpose={purpose}
        onPurposeChange={setPurpose}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        deadlineRange={deadlineRange}
        onDeadlineChange={setDeadlineRange}
        attendees={attendees}
        onAttendeeRemove={(id) => setAttendees((prev) => prev.filter((a) => a.id !== id))}
        directory={directory}
        onAttendeeAdd={handleAttendeeAdd}
        onSubmit={() => navigate('/meeting/schedule')}
      />
    </Box>
  );
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
          <Route index element={<HomePage />} />
          <Route path="/meeting" element={<MeetingSchedulePage />} />
          <Route path="/meeting/schedule" element={<AvailableSchedulePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
