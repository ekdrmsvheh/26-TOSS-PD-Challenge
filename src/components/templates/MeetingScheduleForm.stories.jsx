import { useState } from 'react';
import Box from '@mui/material/Box';
import { MeetingScheduleForm } from './MeetingScheduleForm';

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

function useAttendeeManager(initial) {
  const [attendees, setAttendees] = useState(initial);

  const remove = (id) => setAttendees((prev) => prev.filter((a) => a.id !== id));

  const addSelected = (selectedIds) => {
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

  return { attendees, remove, addSelected };
}

export default {
  title: 'Template/MeetingScheduleForm',
  component: MeetingScheduleForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## MeetingScheduleForm

밋핏의 미팅 스케줄 요청 폼. 유동 너비 입력 폼 + 고정 300px sticky 요약 패널의 2단 레이아웃.
좁은 화면에서는 요약 패널이 폼 아래로 재배치된다. 일정범위/응답마감은 DateRangePicker,
참석자 추가는 AttendeePicker 팝업으로 동작한다.

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title / onTitleChange | string / function | '' | 미팅 제목 |
| purpose / onPurposeChange | string / function | '' | 미팅 목적 |
| dateRange / onDateRangeChange | {start,end} / function | - | 일정 범위 (DateRangePicker) |
| duration / onDurationClick | string / function | '1시간' | 소요 시간 |
| meetingMethod / onMeetingMethodClick | string / function | - | 미팅 방식 |
| deadlineRange / onDeadlineChange | {start,end} / function | - | 응답 마감 (DateRangePicker) |
| reminder / onReminderClick | string / function | '사용 안 함' | 응답 리마인드 |
| attendees / onAttendeeRemove | array / function | [] | 참석자 목록 |
| directory / onAttendeeAdd | array / function | [] | 참석자 추가 후보 / 완료 핸들러 |
| onSubmit | function | - | CTA 클릭 핸들러 |
        `,
      },
    },
  },
};

export const Default = {
  render: () => {
    const [title, setTitle] = useState('');
    const [purpose, setPurpose] = useState('');
    const [dateRange, setDateRange] = useState(null);
    const { attendees, remove, addSelected } = useAttendeeManager(initialAttendees);

    return (
      <Box sx={{ maxWidth: 900 }}>
        <MeetingScheduleForm
          title={title}
          onTitleChange={setTitle}
          purpose={purpose}
          onPurposeChange={setPurpose}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          attendees={attendees}
          onAttendeeRemove={remove}
          directory={directory}
          onAttendeeAdd={addSelected}
          onSubmit={() => {}}
        />
      </Box>
    );
  },
};

export const Filled = {
  render: () => {
    const [title, setTitle] = useState('3분기 신규 기능 킥오프');
    const [purpose, setPurpose] = useState('신규 기능 범위와 일정을 확정합니다.');
    const [dateRange, setDateRange] = useState({
      start: new Date(2026, 6, 14),
      end: new Date(2026, 6, 18),
    });
    const { attendees, remove, addSelected } = useAttendeeManager(initialAttendees);

    return (
      <Box sx={{ maxWidth: 900 }}>
        <MeetingScheduleForm
          title={title}
          onTitleChange={setTitle}
          purpose={purpose}
          onPurposeChange={setPurpose}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          meetingMethod="온라인 (Zoom)"
          attendees={attendees}
          onAttendeeRemove={remove}
          directory={directory}
          onAttendeeAdd={addSelected}
          onSubmit={() => {}}
        />
      </Box>
    );
  },
};

export const Narrow = {
  render: () => {
    const [title, setTitle] = useState('');
    const [purpose, setPurpose] = useState('');
    const { attendees, remove, addSelected } = useAttendeeManager(initialAttendees);

    return (
      <Box sx={{ maxWidth: 380 }}>
        <MeetingScheduleForm
          title={title}
          onTitleChange={setTitle}
          purpose={purpose}
          onPurposeChange={setPurpose}
          attendees={attendees}
          onAttendeeRemove={remove}
          directory={directory}
          onAttendeeAdd={addSelected}
          onSubmit={() => {}}
        />
      </Box>
    );
  },
};
