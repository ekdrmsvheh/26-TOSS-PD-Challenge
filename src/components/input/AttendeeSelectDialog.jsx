import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { AttendeeRow } from './AttendeeRow';

/**
 * AttendeeSelectDialog 컴포넌트
 *
 * "참여 인원을 선택해 주세요" 모달. 주최자 카드(고정, 삭제 불가)와
 * 참여자 목록(필수/선택 토글 + 삭제)을 보여준다. 참여자는 검색 드롭다운(Autocomplete)에서
 * 동료를 찾아 클릭하면 추가된다.
 *
 * 동작 방식:
 * 1. 열릴 때 participants를 내부 draft 상태로 복사한다 (완료 전까지는 외부 상태에 반영 안 됨)
 * 2. 검색창을 클릭하면 directory 후보 드롭다운이 열린다 (openOnFocus). 이름/역할로 필터링된다
 * 3. 드롭다운 상단에는 선택 인원 수와 "모두 지우기"가 있고, 각 후보는 사진 썸네일 + 이름 + 역할을
 *    한 줄로 보여준다. 클릭하면 draft에 필수(required) 기본값으로 추가되고 체크 표시가 붙는다.
 *    이미 추가된 후보를 다시 클릭하면 draft에서 제거된다 (다중 선택 토글, 드롭다운은 닫히지 않음)
 * 4. 참여자 행의 필수/선택 토글, 삭제(X)는 draft에 즉시 반영된다
 * 5. "선택 완료"를 눌러야 onConfirm(draft)이 호출되고 닫힌다. 닫기(X)는 draft를 버리고 취소한다
 * 6. draft가 비면 "함께할 동료를 선택해 주세요" 빈 상태를 보여준다
 * 7. 모달 높이는 선택 인원 수와 무관하게 800px로 고정되고, 참여자 목록만 내부 스크롤된다
 *
 * Props:
 * @param {boolean} open - 모달 표시 여부 [Required]
 * @param {function} onClose - 취소/닫기 핸들러 [Required]
 * @param {{name: string, role: string, avatarSrc: string, avatarColor: string}} host - 주최자 정보 [Required]
 * @param {Array<{id: string, name: string, role: string, avatarSrc: string}>} directory - 검색 드롭다운에서 고를 수 있는 동료 후보 목록 [Optional, 기본값: []]
 * @param {Array<{id: string, name: string, role: string, roleLevel: 'required'|'optional', avatarSrc: string, avatarColor: string}>} participants - 현재 참여자 목록 [Required]
 * @param {function} onConfirm - "선택 완료" 클릭 핸들러 (participants) => void [Required]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <AttendeeSelectDialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   host={{ name: '이지혜', role: '제품팀 · 프로덕트 디자이너', avatarSrc: '...' }}
 *   directory={directory}
 *   participants={participants}
 *   onConfirm={setParticipants}
 * />
 */
export function AttendeeSelectDialog({ open, onClose, host, directory = [], participants = [], onConfirm, sx }) {
  const [draft, setDraft] = useState(participants);
  const [wasOpen, setWasOpen] = useState(open);

  // 렌더 중 상태 조정: 모달이 새로 열릴 때만 draft를 participants로 재동기화한다.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setDraft(participants);
    }
  }

  const selectedOptions = directory.filter((person) => draft.some((p) => p.id === person.id));

  const handleSearchChange = (event, newValue) => {
    setDraft((prev) =>
      newValue.map((option) => prev.find((p) => p.id === option.id) || { ...option, roleLevel: 'required' })
    );
  };

  const handleRoleLevelChange = (id, roleLevel) => {
    setDraft((prev) => prev.map((person) => (person.id === id ? { ...person, roleLevel } : person)));
  };

  const handleRemove = (id) => {
    setDraft((prev) => prev.filter((person) => person.id !== id));
  };

  const handleClearAll = () => setDraft([]);

  const handleConfirm = () => {
    onConfirm?.(draft);
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: '20px', height: '800px' } } }}
    >
      <Box sx={{ p: '28px', height: '100%', display: 'flex', flexDirection: 'column', ...sx }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: '20px', flexShrink: 0 }}>
          <Typography variant="h5">참여 인원을 선택해 주세요</Typography>
          <IconButton size="small" onClick={onClose} aria-label="닫기">
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>

        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px', p: '14px', mb: '16px', flexShrink: 0 }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: '10px' }}>주최자</Typography>
          <AttendeeRow name={host.name} role={host.role} avatarSrc={host.avatarSrc} avatarColor={host.avatarColor} sx={{ border: 0, p: 0 }} />
        </Box>

        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px', p: '14px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '10px', flexShrink: 0 }}>
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>참여자</Typography>
            {draft.length > 0 && (
              <Button size="small" onClick={handleClearAll} sx={{ color: 'text.secondary', fontSize: 12, textDecoration: 'underline' }}>
                모두 지우기
              </Button>
            )}
          </Stack>

          <Autocomplete
            multiple
            disableCloseOnSelect
            openOnFocus
            options={directory}
            value={selectedOptions}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            filterOptions={(options, state) =>
              options.filter(
                (option) => option.name.includes(state.inputValue) || option.role?.includes(state.inputValue)
              )
            }
            onChange={handleSearchChange}
            renderTags={() => null}
            renderOption={(optionProps, option, { selected }) => {
              const { key, ...rest } = optionProps;
              return (
                <Stack
                  key={key}
                  {...rest}
                  component="li"
                  direction="row"
                  alignItems="center"
                  spacing="10px"
                  sx={{ px: '16px', py: '12px' }}
                >
                  <Avatar src={option.avatarSrc} sx={{ width: 36, height: 36, fontSize: 13, fontWeight: 600 }}>
                    {option.name.slice(-2)}
                  </Avatar>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{option.name}</Typography>
                  {option.role && (
                    <Typography sx={{ fontSize: 13, color: 'text.secondary', whiteSpace: 'nowrap' }}>{option.role}</Typography>
                  )}
                  <Box sx={{ flex: 1 }} />
                  {selected && <CheckIcon sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />}
                </Stack>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="이름, 팀, 역할로 검색"
                size="small"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: <SearchIcon sx={{ fontSize: 16, color: 'text.disabled', ml: '4px' }} />,
                  },
                }}
              />
            )}
            slots={{
              paper: (paperProps) => (
                <Paper
                  {...paperProps}
                  elevation={0}
                  sx={{
                    ...paperProps.sx,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0px 12px 24px rgba(15, 23, 42, 0.12), 0px 4px 8px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: '16px', py: '14px' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>총 {selectedOptions.length}명 선택 됨</Typography>
                    <Button size="small" onClick={handleClearAll} sx={{ color: 'text.secondary', fontSize: 12, textDecoration: 'underline' }}>
                      모두 지우기
                    </Button>
                  </Stack>
                  <Divider />
                  {paperProps.children}
                </Paper>
              ),
            }}
            sx={{ mb: '12px', flexShrink: 0, '& .MuiOutlinedInput-root': { fontSize: 13 } }}
          />

          {draft.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" spacing="10px" sx={{ flex: 1 }}>
              <GroupOutlinedIcon sx={{ fontSize: 28, color: 'text.disabled' }} />
              <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>함께할 동료를 선택해 주세요</Typography>
            </Stack>
          ) : (
            <Stack spacing="8px" sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              {draft.map((person) => (
                <AttendeeRow
                  key={person.id}
                  name={person.name}
                  role={person.role}
                  avatarSrc={person.avatarSrc}
                  avatarColor={person.avatarColor}
                  roleLevel={person.roleLevel}
                  onRoleLevelChange={(level) => handleRoleLevelChange(person.id, level)}
                  onRemove={() => handleRemove(person.id)}
                />
              ))}
            </Stack>
          )}
        </Box>

        <Button fullWidth variant="contained" size="large" onClick={handleConfirm} sx={{ mt: '20px', flexShrink: 0 }}>
          선택 완료
        </Button>
      </Box>
    </Dialog>
  );
}
