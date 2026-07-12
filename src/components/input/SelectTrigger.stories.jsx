import { useState } from 'react';
import Box from '@mui/material/Box';
import { SelectTrigger } from './SelectTrigger';

export default {
  title: 'Component/7. Input & Control/SelectTrigger',
  component: SelectTrigger,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: '필드 라벨' },
    value: { control: 'text', description: '현재 선택된 값 텍스트' },
    placeholder: { control: 'text', description: '값이 없을 때 표시할 안내 텍스트' },
    isRequired: { control: 'boolean', description: '필수 여부 (라벨 옆 * 표시)' },
    isDisabled: { control: 'boolean', description: '비활성화 여부' },
    onClick: { action: 'clicked', description: '버튼 클릭 핸들러' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## SelectTrigger

실제 값 선택은 팝업(캘린더, 커스텀 메뉴 등)에서 이루어지고, 화면에는 현재 값만 보여주는 버튼형 트리거.
네이티브 MUI Select로 표현하기 어려운 커스텀 드롭다운의 진입점으로 사용한다.
        `,
      },
    },
  },
};

export const Default = {
  render: (args) => (
    <Box sx={{ maxWidth: 320 }}>
      <SelectTrigger {...args} />
    </Box>
  ),
  args: {
    label: '소요 시간',
    value: '1시간',
    isRequired: true,
  },
};

export const Empty = {
  render: (args) => (
    <Box sx={{ maxWidth: 320 }}>
      <SelectTrigger {...args} />
    </Box>
  ),
  args: {
    label: '미팅 일정 범위',
    placeholder: '기간을 선택하세요',
    isRequired: true,
  },
};

export const Group = {
  render: () => {
    const [duration, setDuration] = useState('1시간');
    return (
      <Box sx={{ display: 'flex', gap: 2, maxWidth: 600 }}>
        <SelectTrigger
          label="소요 시간"
          value={duration}
          isRequired
          onClick={() => setDuration(duration === '1시간' ? '30분' : '1시간')}
        />
        <SelectTrigger label="미팅 방식" placeholder="방식을 선택하세요" isRequired />
        <SelectTrigger label="응답 마감" placeholder="미설정" />
      </Box>
    );
  },
};
