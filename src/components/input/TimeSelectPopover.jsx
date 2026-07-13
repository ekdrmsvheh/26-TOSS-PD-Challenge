import { useState } from 'react';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/**
 * TimeSelectPopover 컴포넌트
 *
 * 문자열 값 하나를 고르는 검색 가능한 스크롤 리스트 팝업. 시작 시간/종료 시간처럼
 * 시간 목록뿐 아니라 미팅 길이(30분/1시간 등) 같은 짧은 라벨 목록에도 범용으로 쓴다.
 * 각 필드가 독립적으로 값 하나만 가지는 트리거에 anchor되어 쓴다.
 *
 * 동작 방식:
 * 1. 검색창에 입력하면 options를 부분 문자열로 필터링한다
 * 2. 리스트 항목을 클릭하면 onSelect가 즉시 호출되고 팝업이 바로 닫힌다
 *    (다중 선택이 아니라 값 하나를 고르는 것이라 별도 "완료" 버튼이 없다)
 * 3. 현재 value와 일치하는 항목은 배경 강조 + 굵게 표시된다
 *
 * Props:
 * @param {boolean} open - 팝업 표시 여부 [Required]
 * @param {Element} anchorEl - 팝업이 붙을 기준 엘리먼트 [Required]
 * @param {function} onClose - 팝업 닫기 핸들러 [Required]
 * @param {string[]} options - 선택 가능한 값 목록 [Required]
 * @param {string} value - 현재 선택된 값 [Optional]
 * @param {function} onSelect - 항목 클릭 핸들러 (item) => void [Required]
 * @param {string} placeholder - 검색 입력 placeholder [Optional, 기본값: '시간 입력']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <TimeSelectPopover
 *   open={open}
 *   anchorEl={anchorEl}
 *   onClose={handleClose}
 *   options={TIME_OPTIONS}
 *   value={searchStart}
 *   onSelect={(time) => { setSearchStart(time); handleClose(); }}
 * />
 */
export function TimeSelectPopover({ open, anchorEl, onClose, options = [], value, onSelect, placeholder = '시간 입력', sx }) {
  const [query, setQuery] = useState('');
  const [wasOpen, setWasOpen] = useState(open);

  // 렌더 중 상태 조정: 팝업이 새로 열릴 때만 검색어를 비운다.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery('');
  }

  const filtered = options.filter((time) => time.includes(query));

  const handleSelect = (time) => {
    onSelect?.(time);
    onClose?.();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{ paper: { sx: { borderRadius: '16px', mt: '4px', width: '220px', maxHeight: '360px' } } }}
    >
      <Box sx={{ ...sx }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing="8px"
          sx={{ p: '12px 14px' }}
        >
          <AccessTimeIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <InputBase
            autoFocus
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ fontSize: 13, flex: 1 }}
          />
        </Stack>
        <Divider />

        <Stack sx={{ maxHeight: '280px', overflowY: 'auto', p: '8px' }}>
          {filtered.map((time) => {
            const isSelected = time === value;
            return (
              <Box
                key={time}
                component="button"
                type="button"
                onClick={() => handleSelect(time)}
                sx={{
                  border: 0,
                  bgcolor: isSelected ? 'action.selected' : 'transparent',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: isSelected ? 700 : 400,
                  color: 'text.primary',
                  textAlign: 'left',
                  px: '12px',
                  py: '9px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: isSelected ? 'action.selected' : 'action.hover' },
                }}
              >
                {time}
              </Box>
            );
          })}
          {filtered.length === 0 && (
            <Typography sx={{ fontSize: 13, color: 'text.disabled', textAlign: 'center', py: '20px' }}>
              검색 결과가 없어요
            </Typography>
          )}
        </Stack>
      </Box>
    </Popover>
  );
}
