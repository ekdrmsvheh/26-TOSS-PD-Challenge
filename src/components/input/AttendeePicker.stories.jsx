import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { AttendeePicker } from './AttendeePicker';

const directory = [
  { id: 'a1', name: '박서준', role: '백엔드 엔지니어' },
  { id: 'a2', name: '김도윤', role: '마케터' },
  { id: 'a3', name: '최유나', role: '디자이너' },
  { id: 'a4', name: '정민아', role: 'PM' },
  { id: 'a5', name: '이하늘', role: 'QA 엔지니어' },
];

export default {
  title: 'Component/7. Input & Control/AttendeePicker',
  component: AttendeePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## AttendeePicker

"참석자 추가" 버튼 위로 열리는 동료 선택 팝업. 검색, 다중 선택, 초기화/닫기/완료를 지원한다.
        `,
      },
    },
  },
};

export const Default = {
  render: () => {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState(['a1']);

    return (
      <>
        <Button ref={anchorRef} variant="outlined" onClick={() => setOpen(true)}>
          참석자 추가
        </Button>
        <AttendeePicker
          open={open}
          anchorEl={anchorRef.current}
          onClose={() => setOpen(false)}
          directory={directory}
          selectedIds={selectedIds}
          onConfirm={setSelectedIds}
        />
      </>
    );
  },
};
