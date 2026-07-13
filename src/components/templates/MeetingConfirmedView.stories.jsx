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
    attendees: { control: 'object', description: '참석자 목록' },
    responses: { control: 'object', description: '참석자별·후보별 응답 상태' },
    onShare: { action: 'share', description: '"참석자에게 확정 공유하기" 클릭 핸들러' },
  },
};

export const Default = {
  args: {},
};
