import { MeetingConfirmedView } from './MeetingConfirmedView';

export default {
  title: 'Template/MeetingConfirmedView',
  component: MeetingConfirmedView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    meeting: { control: 'object', description: '미팅 정보 { title, purpose }' },
    confirmedCandidate: { control: 'object', description: '확정된 후보 { id, date, time }' },
    durationMinutes: { control: 'number', description: '미팅 길이(분), 시간 범위 표시에 사용' },
    attendees: { control: 'object', description: '참석자 목록 { name, team, avatarIndex }' },
    responses: { control: 'object', description: '참석자별·후보별 응답 상태' },
    onComplete: { action: 'complete', description: '"완료" 클릭 핸들러' },
  },
};

export const Default = {
  args: {},
};
