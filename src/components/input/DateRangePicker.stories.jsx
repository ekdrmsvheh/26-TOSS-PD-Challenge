import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { DateRangePicker } from './DateRangePicker';

export default {
  title: 'Component/7. Input & Control/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## DateRangePicker

일정 범위/응답 마감을 선택하는 캘린더 팝업. 좌측 프리셋 + 우측 월 캘린더로 구성되며,
종료일 없이 완료를 누르면 하루짜리 범위로 확정된다.
        `,
      },
    },
  },
};

export const Default = {
  render: () => {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState({ start: null, end: null });

    return (
      <>
        <Button ref={anchorRef} variant="outlined" onClick={() => setOpen(true)}>
          {range.start
            ? `${range.start.getMonth() + 1}/${range.start.getDate()}${range.end && range.end !== range.start ? ` ~ ${range.end.getMonth() + 1}/${range.end.getDate()}` : ''}`
            : '기간을 선택하세요'}
        </Button>
        <DateRangePicker
          open={open}
          anchorEl={anchorRef.current}
          onClose={() => setOpen(false)}
          value={range}
          onConfirm={setRange}
        />
      </>
    );
  },
};
