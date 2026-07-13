import { useState } from 'react';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Avatar from '@mui/material/Avatar';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';

/**
 * AttendeePicker 컴포넌트
 *
 * "참석자 추가" 버튼 위로 열리는 동료 선택 팝업. 검색으로 후보를 좁히고,
 * 클릭으로 다중 선택한 뒤 완료를 눌러 확정한다.
 *
 * 동작 방식:
 * 1. 열릴 때 selectedIds를 내부 draft 상태로 복사한다 (완료 전까지는 외부 상태에 반영 안 됨)
 * 2. 행 클릭으로 선택/해제 토글
 * 3. 초기화는 draft만 비우고, 완료를 눌러야 실제로 반영된다
 * 4. 닫기는 draft를 버리고 그대로 닫는다 (변경사항 취소)
 *
 * Props:
 * @param {boolean} open - 팝업 표시 여부 [Required]
 * @param {Element} anchorEl - 팝업이 붙을 기준 엘리먼트 [Required]
 * @param {function} onClose - 팝업 취소/닫기 핸들러 [Required]
 * @param {Array<{id: string, name: string, role: string, avatarSrc: string}>} directory - 선택 가능한 동료 목록 [Required]
 * @param {string[]} selectedIds - 현재 선택된 id 목록 [Optional, 기본값: []]
 * @param {function} onConfirm - "완료" 클릭 핸들러 (selectedIds) => void [Required]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <AttendeePicker
 *   open={isOpen}
 *   anchorEl={anchorEl}
 *   onClose={() => setIsOpen(false)}
 *   directory={colleagues}
 *   selectedIds={selectedIds}
 *   onConfirm={setSelectedIds}
 * />
 */
export function AttendeePicker({
  open,
  anchorEl,
  onClose,
  directory = [],
  selectedIds = [],
  onConfirm,
  sx,
}) {
  const [draftSelected, setDraftSelected] = useState(selectedIds);
  const [query, setQuery] = useState('');
  const [wasOpen, setWasOpen] = useState(open);

  // 렌더 중 상태 조정: 팝업이 새로 열릴 때만 draft를 selectedIds로 재동기화한다.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setDraftSelected(selectedIds);
      setQuery('');
    }
  }

  const filtered = directory.filter((person) => person.name.includes(query) || person.role?.includes(query));

  const toggleSelect = (id) => {
    setDraftSelected((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleConfirm = () => {
    onConfirm?.(draftSelected);
    onClose?.();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{ paper: { sx: { borderRadius: '16px', mb: '4px', width: '320px' } } }}
    >
      <Box sx={{ ...sx }}>
        <Box sx={{ p: '14px 16px', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing="8px"
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px', px: '12px', py: '8px', mb: '10px' }}
          >
            <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            <InputBase
              placeholder="이름 또는 역할로 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ fontSize: 13, flex: 1 }}
            />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              총 {draftSelected.length}명 선택됨
            </Typography>
            <Button size="small" onClick={() => setDraftSelected([])} sx={{ color: 'text.secondary', fontSize: 12 }}>
              초기화
            </Button>
          </Stack>
        </Box>

        <Stack sx={{ maxHeight: '260px', overflowY: 'auto', p: '8px' }}>
          {filtered.map((person) => {
            const isSelected = draftSelected.includes(person.id);
            return (
              <Stack
                key={person.id}
                direction="row"
                alignItems="center"
                spacing="10px"
                onClick={() => toggleSelect(person.id)}
                sx={{
                  p: '8px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  bgcolor: isSelected ? 'action.selected' : 'transparent',
                  '&:hover': { bgcolor: isSelected ? 'action.selected' : 'action.hover' },
                }}
              >
                <Avatar src={person.avatarSrc} sx={{ width: 28, height: 28 }}>
                  {person.name[0]}
                </Avatar>
                <Stack sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{person.name}</Typography>
                  {person.role && (
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{person.role}</Typography>
                  )}
                </Stack>
                {isSelected && <CheckIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
              </Stack>
            );
          })}
          {filtered.length === 0 && (
            <Typography sx={{ fontSize: 13, color: 'text.disabled', textAlign: 'center', py: '20px' }}>
              검색 결과가 없어요
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing="8px" sx={{ p: '12px 16px', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button fullWidth variant="outlined" onClick={onClose}>
            닫기
          </Button>
          <Button fullWidth variant="contained" onClick={handleConfirm}>
            완료
          </Button>
        </Stack>
      </Box>
    </Popover>
  );
}
