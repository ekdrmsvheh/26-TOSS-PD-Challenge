import { ReviewRequestSentView } from './ReviewRequestSentView';

export default {
  title: 'Template/ReviewRequestSentView',
  component: ReviewRequestSentView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    candidateCount: { control: { type: 'number', min: 1 }, description: '함께 전달한 추천 후보 개수' },
    onViewResponses: { action: 'view-responses', description: '"응답 현황 보기" 클릭 핸들러' },
  },
};

export const Default = {
  args: {
    candidateCount: 3,
  },
};
