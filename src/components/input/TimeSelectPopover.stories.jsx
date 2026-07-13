import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { TimeSelectPopover } from './TimeSelectPopover';

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const totalMinutes = i * 30;
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const period = hour24 < 12 ? '오전' : '오후';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${period} ${hour12}:${minute === 0 ? '00' : minute}`;
});

export default {
  title: 'Component/7. Input & Control/TimeSelectPopover',
  component: TimeSelectPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## TimeSelectPopover

문자열 값 하나를 고르는 검색 가능한 스크롤 리스트 팝업. 항목을 클릭하면 즉시 선택되고 팝업이 닫힌다
(다중 선택이 아니라 단일 값 선택이라 별도 "완료" 버튼이 없다). 시간 목록뿐 아니라 미팅 길이 같은
짧은 라벨 목록에도 범용으로 쓴다.
        `,
      },
    },
  },
};

export const Default = {
  render: () => {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState('오전 9:00');

    return (
      <>
        <Button ref={anchorRef} variant="outlined" onClick={() => setOpen(true)}>
          시작 시간: {time}
        </Button>
        <TimeSelectPopover
          open={open}
          anchorEl={anchorRef.current}
          onClose={() => setOpen(false)}
          options={TIME_OPTIONS}
          value={time}
          onSelect={setTime}
        />
      </>
    );
  },
};

const DURATION_OPTIONS = ['30분', '1시간', '1시간 30분', '2시간', '3시간', '4시간'];

export const DurationList = {
  name: '미팅 길이(범용 사용 예시)',
  render: () => {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [duration, setDuration] = useState('1시간');

    return (
      <>
        <Button ref={anchorRef} variant="outlined" onClick={() => setOpen(true)}>
          미팅 길이: {duration}
        </Button>
        <TimeSelectPopover
          open={open}
          anchorEl={anchorRef.current}
          onClose={() => setOpen(false)}
          options={DURATION_OPTIONS}
          value={duration}
          onSelect={setDuration}
          placeholder="길이 입력"
        />
      </>
    );
  },
};
