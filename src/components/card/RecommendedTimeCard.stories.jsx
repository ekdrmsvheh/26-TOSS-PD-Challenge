import Stack from '@mui/material/Stack';
import { RecommendedTimeCard } from './RecommendedTimeCard';
import { CardContainer } from './CardContainer';

const RECOMMEND_SLOTS = [
  { dateTime: '7/13(월) 오전 10:00', caption: '전원 참석, 가장 빠른 시간' },
  { dateTime: '7/14(화) 오후 12:00', caption: '전원 참석' },
  { dateTime: '7/15(수) 오후 5:00', caption: '전원 참석' },
  { dateTime: '7/16(목) 오전 11:00', caption: '전원 참석' },
  { dateTime: '7/17(금) 오후 2:00', caption: '전원 참석' },
];

const ADJUST_SLOTS = [
  { dateTime: '7/14(화) 오전 11:00', caption: '지은님 조정 시 전원 참석, 가장 빠른 시간' },
  { dateTime: '7/13(월) 오후 2:00', caption: '정희님 조정 시 전원 참여' },
  { dateTime: '7/16(목) 오후 2:00', caption: '정희, 상륜님 조정 시 전원 참여' },
  { dateTime: '7/16(목) 오전 9:00', caption: '정희, 상륜님 조정 시 전원 참여' },
];

export default {
  title: 'Component/3. Card/RecommendedTimeCard',
  component: RecommendedTimeCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## RecommendedTimeCard

"추천 시간" 카드 — 시간 조건에 맞는 후보를 3열 그리드로 보여준다. slots[0]이 대표(1등)
후보로 배경 채움+굵은 accent 보더로 강조되고, 중간 순위는 옅은 accent 보더, 4개 이상일 때
맨 끝 1개는 완전 무채색으로 톤다운된다. "모든 후보 보기" 토글을 켜면 접혀 있던 나머지
후보(4번째 이후)까지 노출된다. scenario에 따라 전원 참석 가능(blue)/조정 필요(orange) 톤과
기본 안내 문구가 바뀐다.
        `,
      },
    },
  },
  argTypes: {
    scenario: { control: 'select', options: ['recommend', 'adjust'], description: '전원 참석 가능/조정 필요 시나리오' },
    slots: { control: 'object', description: '시간 후보 목록 (첫 항목이 대표 슬롯)' },
    description: { control: 'text', description: '안내 문구 (미지정 시 scenario 기본 문구)' },
  },
};

export const Default = {
  args: {
    scenario: 'recommend',
    slots: RECOMMEND_SLOTS,
  },
  render: (args) => (
    <CardContainer variant="elevation" padding="card" radius="card" sx={{ width: 960 }}>
      <RecommendedTimeCard {...args} />
    </CardContainer>
  ),
};

export const Scenarios = {
  render: () => (
    <Stack spacing="20px">
      <CardContainer variant="elevation" padding="card" radius="card" sx={{ width: 960 }}>
        <RecommendedTimeCard scenario="recommend" slots={RECOMMEND_SLOTS} />
      </CardContainer>
      <CardContainer variant="elevation" padding="card" radius="card" sx={{ width: 960 }}>
        <RecommendedTimeCard scenario="adjust" slots={ADJUST_SLOTS} />
      </CardContainer>
    </Stack>
  ),
};
