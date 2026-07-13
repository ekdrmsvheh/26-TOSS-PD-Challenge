import Stack from '@mui/material/Stack';
import { CalendarAvailabilityCard } from './CalendarAvailabilityCard';
import { CardContainer } from './CardContainer';

const DAYS = [
  { label: '월', date: 13 },
  { label: '화', date: 14 },
  { label: '수', date: 15 },
  { label: '목', date: 16 },
  { label: '금', date: 17 },
];

const HOURS = ['오전 9:00', '오전 10:00', '오전 11:00', '오후 12:00', '오후 1:00', '오후 2:00', '오후 3:00', '오후 4:00', '오후 5:00'];

const RECOMMEND_CELLS = {
  '0-1': 'highlight-primary',
  '1-3': 'highlight',
  '2-8': 'highlight',
  '3-2': 'empty',
};

const RECOMMEND_EVENTS = {
  '0-0': [{ person: '이지혜', title: '주간회의' }],
  '0-3': [{ person: '정희', title: '1:1 미팅' }],
  '1-0': [{ person: '이상륜', title: '배포 준비' }],
  '2-2': [{ person: '김주연', title: '디자인 QA' }],
};

const ADJUST_CELLS = {
  '1-2': 'highlight-primary',
  '0-4': 'highlight',
  '2-5': 'highlight',
  '3-8': 'highlight',
  '4-1': 'highlight',
};

const ADJUST_EVENTS = {
  '1-2': [{ person: '정희', title: '1:1 미팅', isConflict: true }],
  '0-4': [{ person: '이지혜', title: '주간회의', isConflict: true }],
  '3-8': [
    { person: '이지혜', title: '주간회의', isConflict: true },
    { person: '정희', title: '1:1 미팅', isConflict: true },
  ],
  '0-0': [{ person: '이상륜', title: '고객사 모니터링' }],
};

export default {
  title: 'Component/3. Card/CalendarAvailabilityCard',
  component: CalendarAvailabilityCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## CalendarAvailabilityCard

"캘린더" 카드 — 요일×시간 그리드에 참석자들의 가능/불가 상태를 색으로 보여준다(텍스트 라벨 없이
색만으로 표현). scenario에 따라 강조색(전원 참석 가능=blue, 조정 필요=orange)과 범례 구성이
달라지고, "상세 일정 보기" 토글을 켜면 각 셀에 참석자별 일정이 펼쳐지며 조정 원인이 되는
일정에는 속이 빈 점 마커 + 강조색(#C37500)이 붙는다.
        `,
      },
    },
  },
  argTypes: {
    scenario: { control: 'select', options: ['recommend', 'adjust'], description: '전원 참석 가능/조정 필요 시나리오' },
    days: { control: 'object', description: '요일 컬럼 목록' },
    hours: { control: 'object', description: '시간 행 목록' },
    cellStates: { control: 'object', description: '`${dayIndex}-${hourIndex}` → 셀 상태 맵' },
    events: { control: 'object', description: '`${dayIndex}-${hourIndex}` → 상세보기용 일정 맵' },
  },
};

export const Default = {
  args: {
    scenario: 'recommend',
    days: DAYS,
    hours: HOURS,
    cellStates: RECOMMEND_CELLS,
    events: RECOMMEND_EVENTS,
  },
  render: (args) => (
    <CardContainer variant="elevation" padding="card" radius="card" sx={{ width: 960 }}>
      <CalendarAvailabilityCard {...args} />
    </CardContainer>
  ),
};

export const Scenarios = {
  name: '시나리오 비교 (상세보기 토글은 각 카드에서 직접 클릭)',
  render: () => (
    <Stack spacing="20px">
      <CardContainer variant="elevation" padding="card" radius="card" sx={{ width: 960 }}>
        <CalendarAvailabilityCard scenario="recommend" days={DAYS} hours={HOURS} cellStates={RECOMMEND_CELLS} events={RECOMMEND_EVENTS} />
      </CardContainer>
      <CardContainer variant="elevation" padding="card" radius="card" sx={{ width: 960 }}>
        <CalendarAvailabilityCard scenario="adjust" days={DAYS} hours={HOURS} cellStates={ADJUST_CELLS} events={ADJUST_EVENTS} />
      </CardContainer>
    </Stack>
  ),
};
