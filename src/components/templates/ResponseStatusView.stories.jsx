import { ResponseStatusView } from './ResponseStatusView';

export default {
  title: 'Template/ResponseStatusView',
  component: ResponseStatusView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    meeting: { control: 'object', description: '미팅 정보 { title, deadline }' },
    candidates: { control: 'object', description: '검토 요청한 후보 목록' },
    attendees: { control: 'object', description: '응답 대상 참석자 목록' },
    responses: { control: 'object', description: '참석자별·후보별 응답 상태' },
    onRemind: { action: 'remind', description: '"미응답자에게 리마인드 보내기" 클릭 핸들러' },
    onConfirm: { action: 'confirm', description: '"미팅 확정하기" 클릭 핸들러, 선택한 후보 객체를 전달' },
  },
};

export const Default = {
  args: {},
};
