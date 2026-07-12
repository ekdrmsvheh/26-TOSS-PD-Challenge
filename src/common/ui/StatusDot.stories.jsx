import Box from '@mui/material/Box';
import { StatusDot } from './StatusDot';

export default {
  title: 'Common/StatusDot',
  component: StatusDot,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: '상태 라벨' },
    count: { control: 'number', description: '표시할 숫자' },
    color: { control: 'color', description: '점 색상 (theme 팔레트 경로)' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## StatusDot

색상 점 + 라벨(+ 숫자)로 상태를 나타내는 소형 인디케이터. 참석자 필수/권장/선택 인원 요약 등에 사용한다.
        `,
      },
    },
  },
};

export const Default = {
  args: {
    label: '필수',
    count: 1,
    color: 'error.main',
  },
};

export const Group = {
  render: () => (
    <Box sx={{ display: 'flex', gap: '12px' }}>
      <StatusDot label="필수" count={1} color="error.main" />
      <StatusDot label="권장" count={0} color="text.primary" />
      <StatusDot label="선택" count={0} color="secondary.main" />
    </Box>
  ),
};
