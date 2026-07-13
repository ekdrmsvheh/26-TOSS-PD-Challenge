import { useMemo, useState } from 'react';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const DEFAULT_PRESETS = [
  { label: '오늘', getRange: () => { const d = startOfDay(new Date()); return { start: d, end: d }; } },
  { label: '내일', getRange: () => { const d = addDays(startOfDay(new Date()), 1); return { start: d, end: d }; } },
  {
    label: '이번 주',
    getRange: () => {
      const today = startOfDay(new Date());
      return { start: today, end: addDays(today, 6 - today.getDay()) };
    },
  },
  {
    label: '다음 주',
    getRange: () => {
      const today = startOfDay(new Date());
      const nextMonday = addDays(today, 8 - today.getDay());
      return { start: nextMonday, end: addDays(nextMonday, 6) };
    },
  },
];

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(a, b) {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildMonthGrid(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const gridStart = addDays(firstDay, -startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const date = addDays(gridStart, i);
    return { date, isCurrentMonth: date.getMonth() === month };
  });
}

/**
 * DateRangePicker 컴포넌트
 *
 * 일정 범위/응답 마감을 선택하는 캘린더 팝업. SelectTrigger 등의 트리거
 * 버튼에 anchor되어 뜨는 Popover 형태이며, 좌측에 프리셋 목록을 배치하고
 * 우측에 월 캘린더를 배치한다.
 *
 * 동작 방식:
 * 1. 날짜를 두 번 클릭하면 범위(start~end)로 선택된다 (첫 클릭 이후 클릭한 날짜가
 *    첫 클릭보다 이르면 자동으로 시작/종료가 바뀐다)
 * 2. 종료일을 선택하지 않고 "완료"를 누르면 시작일과 동일한 하루짜리 범위로 확정된다
 * 3. 프리셋 클릭 시 즉시 해당 범위로 값이 채워진다 (완료를 눌러야 확정)
 * 4. getRange가 {start: null, end: null}을 반환하는 프리셋("직접 입력" 등)은 선택 상태만 비우고
 *    캘린더가 보고 있는 달은 바꾸지 않는다 — 완료 버튼은 start가 채워지기 전까지 비활성 상태다
 *
 * Props:
 * @param {boolean} open - 팝업 표시 여부 [Required]
 * @param {Element} anchorEl - 팝업이 붙을 기준 엘리먼트 [Required]
 * @param {function} onClose - 팝업 닫기 핸들러 [Required]
 * @param {{start: Date, end: Date}} value - 현재 선택된 범위 [Optional]
 * @param {function} onConfirm - "완료" 클릭 핸들러 ({start, end}) => void [Required]
 * @param {Array<{label: string, getRange: function}>} presets - 프리셋 목록 [Optional, 기본값: 오늘/내일/이번 주/다음 주]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <DateRangePicker
 *   open={isOpen}
 *   anchorEl={anchorEl}
 *   onClose={() => setIsOpen(false)}
 *   value={range}
 *   onConfirm={(range) => setRange(range)}
 * />
 */
export function DateRangePicker({
  open,
  anchorEl,
  onClose,
  value,
  onConfirm,
  presets = DEFAULT_PRESETS,
  sx,
}) {
  const [viewDate, setViewDate] = useState(() => value?.start ?? new Date());
  const [draft, setDraft] = useState(value ?? { start: null, end: null });
  const [wasOpen, setWasOpen] = useState(open);

  // 렌더 중 상태 조정: 팝업이 새로 열릴 때만 draft를 현재 value로 재동기화한다.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      const nextDraft = value ?? { start: null, end: null };
      setDraft(nextDraft);
      setViewDate(nextDraft.start ?? new Date());
    }
  }

  const grid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  const handleDayClick = (date) => {
    setDraft((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: date, end: null };
      }
      if (date < prev.start) {
        return { start: date, end: prev.start };
      }
      return { start: prev.start, end: date };
    });
  };

  const handlePresetClick = (preset) => {
    const range = preset.getRange();
    setDraft(range);
    // "직접 입력"처럼 start가 없는 프리셋은 선택 상태만 비우고, 캘린더가 보고 있는 달은 그대로 둔다.
    if (range.start) setViewDate(range.start);
  };

  const handleConfirm = () => {
    const finalRange = draft.start ? { start: draft.start, end: draft.end ?? draft.start } : draft;
    onConfirm?.(finalRange);
    onClose?.();
  };

  const isInRange = (date) => {
    if (!draft.start || !draft.end) return false;
    return date > draft.start && date < draft.end;
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{ paper: { sx: { borderRadius: '16px', mt: '4px' } } }}
    >
      <Stack direction="row" sx={{ ...sx }}>
        {/* 프리셋 */}
        <Stack spacing="4px" sx={{ p: '16px', borderRight: '1px solid', borderColor: 'divider', minWidth: '96px' }}>
          {presets.map((preset) => (
            <Button
              key={preset.label}
              size="small"
              onClick={() => handlePresetClick(preset)}
              sx={{ justifyContent: 'flex-start', color: 'text.secondary', fontWeight: 500 }}
            >
              {preset.label}
            </Button>
          ))}
        </Stack>

        {/* 캘린더 */}
        <Box sx={{ p: '16px', width: '288px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: '12px' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
              {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
            </Typography>
            <Stack direction="row">
              <IconButton
                size="small"
                onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                sx={{ bgcolor: 'transparent', '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ChevronLeftIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                sx={{ bgcolor: 'transparent', '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ChevronRightIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {WEEKDAYS.map((day) => (
              <Typography
                key={day}
                sx={{ fontSize: 11, color: 'text.disabled', textAlign: 'center', py: '4px' }}
              >
                {day}
              </Typography>
            ))}

            {grid.map(({ date, isCurrentMonth }) => {
              const isStart = isSameDay(date, draft.start);
              const isEnd = isSameDay(date, draft.end);
              const isEndpoint = isStart || isEnd;

              return (
                <Box
                  key={date.toISOString()}
                  component="button"
                  type="button"
                  onClick={() => handleDayClick(date)}
                  sx={{
                    border: 'none',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: isEndpoint ? 700 : 400,
                    aspectRatio: '1',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    color: isEndpoint
                      ? 'primary.contrastText'
                      : isCurrentMonth
                        ? 'text.primary'
                        : 'text.disabled',
                    bgcolor: isEndpoint ? 'primary.main' : isInRange(date) ? 'action.hover' : 'transparent',
                    '&:hover': { bgcolor: isEndpoint ? 'primary.main' : 'action.hover' },
                  }}
                >
                  {date.getDate()}
                </Box>
              );
            })}
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            disabled={!draft.start}
            sx={{ mt: '16px' }}
          >
            완료
          </Button>
        </Box>
      </Stack>
    </Popover>
  );
}
