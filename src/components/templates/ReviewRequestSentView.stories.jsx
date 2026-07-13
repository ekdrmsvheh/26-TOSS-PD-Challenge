import { ReviewRequestSentView } from './ReviewRequestSentView';

export default {
  title: 'Template/ReviewRequestSentView',
  component: ReviewRequestSentView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    attendeeCount: { control: { type: 'number', min: 1 }, description: '검토 요청을 받은 참석자 수' },
    candidateCount: { control: { type: 'number', min: 1 }, description: '함께 전달한 추천 후보 개수' },
    onViewResponses: { action: 'view-responses', description: '"응답 현황 보기" 클릭 핸들러' },
  },
};

export const Default = {
  args: {
    attendeeCount: 5,
    candidateCount: 3,
  },
};
