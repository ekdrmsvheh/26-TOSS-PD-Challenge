import Stack from '@mui/material/Stack';
import { RecommendedSlotCard } from './RecommendedSlotCard';

export default {
  title: 'Component/3. Card/RecommendedSlotCard',
  component: RecommendedSlotCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## RecommendedSlotCard

RecommendedTimeCard 안에서 시간 후보 하나를 보여주는 카드. tier에 따라 3단계로 표시된다:
primary(대표, 배경 채움+굵은 accent 보더+풀컬러 체크) / secondary(옅은 accent 보더) /
plain(완전 무채색, 참고용 옵션).
        `,
      },
    },
  },
  argTypes: {
    dateTime: { control: 'text', description: '날짜·시간 텍스트' },
    caption: { control: 'text', description: '하단 설명 텍스트' },
    tier: { control: 'select', options: ['primary', 'secondary', 'plain'], description: '카드 위계' },
    accent: { control: 'select', options: ['blue', 'orange'], description: 'primary/secondary 강조 색상' },
  },
};

export const Default = {
  args: {
    dateTime: '7/13(월) 오전 10:00',
    caption: '전원 참석, 가장 빠른 시간',
    tier: 'primary',
    accent: 'blue',
  },
  render: (args) => <RecommendedSlotCard {...args} sx={{ width: 288 }} />,
};

export const Variants = {
  render: () => (
    <Stack direction="row" spacing="8px" flexWrap="wrap" useFlexGap>
      <RecommendedSlotCard dateTime="7/13(월) 오전 10:00" caption="전원 참석, 가장 빠른 시간" tier="primary" accent="blue" sx={{ width: 288 }} />
      <RecommendedSlotCard dateTime="7/14(화) 오후 12:00" caption="전원 참석" tier="secondary" accent="blue" sx={{ width: 288 }} />
      <RecommendedSlotCard dateTime="7/16(목) 오전 11:00" caption="전원 참석, 네번째로 빠른 시간" tier="plain" sx={{ width: 288 }} />
      <RecommendedSlotCard dateTime="7/14(화) 오전 11:00" caption="지은님 조정 시 전원 참석, 가장 빠른 시간" tier="primary" accent="orange" sx={{ width: 288 }} />
      <RecommendedSlotCard dateTime="7/16(목) 오후 2:00" caption="정희, 상륜님 조정 시 전원 참여" tier="secondary" accent="orange" sx={{ width: 288 }} />
      <RecommendedSlotCard dateTime="7/16(목) 오전 11:00" caption="정희님 일정 조정 시 전원 참여" tier="plain" sx={{ width: 288 }} />
    </Stack>
  ),
};
