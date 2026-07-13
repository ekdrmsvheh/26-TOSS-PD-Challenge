import { IntroView } from './IntroView';

export default {
  title: 'Template/IntroView',
  component: IntroView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onStart: { action: 'start', description: '"시작하기" 버튼 클릭 핸들러' },
  },
};

export const Default = {
  args: {},
};
