import { AvailableScheduleView } from './AvailableScheduleView';

export default {
  title: 'Template/AvailableScheduleView',
  component: AvailableScheduleView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    hasConditions: { control: 'boolean', description: '조건 입력 완료 여부' },
    onShowSchedule: { action: 'showSchedule', description: '"가능한 시간 찾기" 클릭 핸들러' },
    onEditAttendees: { action: 'editAttendees', description: '참여 인원 편집 다이얼로그를 여는 시점에 호출' },
    onNext: { action: 'next', description: '"다음" 클릭 핸들러' },
  },
};

export const Default = {
  args: {
    hasConditions: false,
  },
};

export const WithConditions = {
  args: {
    hasConditions: true,
  },
};
