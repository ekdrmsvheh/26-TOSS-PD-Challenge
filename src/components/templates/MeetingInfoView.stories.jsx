import { MeetingInfoView } from './MeetingInfoView';

export default {
  title: 'Template/MeetingInfoView',
  component: MeetingInfoView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onSubmit: { action: 'submit', description: '"일정 검토 요청 보내기" 클릭 핸들러' },
  },
};

export const Default = {
  args: {},
};
