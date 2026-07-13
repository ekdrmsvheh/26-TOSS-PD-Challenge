import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { PresetPopover } from './PresetPopover';

export default {
  title: 'Component/7. Input & Control/PresetPopover',
  component: PresetPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## PresetPopover

"프리셋 + 직접 입력 + 완료"로 구성된 조건 편집 팝업의 공통 셸. 미팅 길이·일정 범위·탐색 시간처럼
자주 쓰는 값은 프리셋 버튼으로 바로 고르고, children의 커스텀 입력은 "적용" 버튼을 눌러야 반영된다.
        `,
      },
    },
  },
};

export const Default = {
  render: () => {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [duration, setDuration] = useState(60);
    const [customInput, setCustomInput] = useState('');

    const presets = [
      { value: 30, label: '30분' },
      { value: 45, label: '45분' },
      { value: 60, label: '1시간' },
      { value: 90, label: '1시간 30분' },
    ];

    return (
      <>
        <Button ref={anchorRef} variant="outlined" onClick={() => setOpen(true)}>
          미팅 길이: {presets.find((p) => p.value === duration)?.label ?? `${duration}분`}
        </Button>
        <PresetPopover
          open={open}
          anchorEl={anchorRef.current}
          onClose={() => setOpen(false)}
          eyebrow="미팅 길이"
          heading="얼마나 진행할까요?"
          description="자주 쓰는 길이는 바로 고르고, 필요한 경우 분 단위로 직접 입력할 수 있어요."
          presets={presets}
          value={duration}
          onSelectPreset={setDuration}
          secondaryActionLabel="직접 입력 적용"
          onSecondaryAction={() => {
            const parsed = parseInt(customInput, 10);
            if (!Number.isNaN(parsed)) setDuration(parsed);
          }}
          onConfirm={() => setOpen(false)}
        >
          <TextField
            label="직접 입력"
            type="number"
            size="small"
            fullWidth
            placeholder="예: 75"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
        </PresetPopover>
      </>
    );
  },
};
