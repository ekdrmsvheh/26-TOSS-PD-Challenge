import { useState, Fragment } from 'react';
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

// 카드 안 행 사이 구분선 — Figma "Line/Normal/Neutral"(#70737C 16%). 컴포넌트 보더(divider)보다 옅다
const ROW_DIVIDER = 'rgba(112, 115, 124, 0.16)';

/**
 * AttendeeSelectDialog 컴포넌트
 *
 * "참석 인원을 선택해 주세요" 모달. 주최자 카드(고정, 삭제 불가)와
 * 참석자 목록(필수/선택 토글 + 삭제)을 보여준다. 참석자는 검색 드롭다운(Autocomplete)에서
 * 동료를 찾아 클릭하면 추가된다.
 *
 * 동작 방식:
 * 1. 열릴 때 participants를 내부 draft 상태로 복사한다 (완료 전까지는 외부 상태에 반영 안 됨)
 * 2. 검색창을 클릭하면 directory 후보 드롭다운이 열린다 (openOnFocus). 이름/역할로 필터링된다
 * 3. 드롭다운 상단에는 선택 인원 수와 "모두 지우기"가 있고, 각 후보는 사진 썸네일 + 이름 + 역할을
 *    한 줄로 보여준다. 클릭하면 draft에 필수(required) 기본값으로 추가되고 체크 표시가 붙는다.
 *    이미 추가된 후보를 다시 클릭하면 draft에서 제거된다 (다중 선택 토글, 드롭다운은 닫히지 않음)
 * 4. 참석자 행의 필수/선택 토글, 삭제(X)는 draft에 즉시 반영된다. 행은 보더 없이 divider로 구분된다
 * 5. "선택 완료"를 눌러야 onConfirm(draft)이 호출되고 닫힌다. 닫기(원형 X)는 draft를 버리고 취소한다
 * 6. draft가 비면 "함께할 동료를 선택해 주세요" 빈 상태를 보여준다
 * 7. 모달 높이는 선택 인원 수와 무관하게 800px로 고정되고, 참석자 목록만 내부 스크롤된다
 *
 * Props:
 * @param {boolean} open - 모달 표시 여부 [Required]
 * @param {function} onClose - 취소/닫기 핸들러 [Required]
 * @param {{name: string, role: string, avatarSrc: string, avatarColor: string}} host - 주최자 정보 [Required]
 * @param {Array<{id: string, name: string, role: string, avatarSrc: string}>} directory - 검색 드롭다운에서 고를 수 있는 동료 후보 목록 [Optional, 기본값: []]
 * @param {Array<{id: string, name: string, role: string, roleLevel: 'required'|'optional', avatarSrc: string, avatarColor: string}>} participants - 현재 참석자 목록 [Required]
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
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            width: '600px',
            maxWidth: '600px',
            height: '800px',
            maxHeight: '90vh',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0px 24px 36px rgba(36, 42, 48, 0.2)', // Flex/Shadow/LG Soft
          },
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', ...sx }}>
        {/* 헤더: 원형 닫기 버튼만 (타이틀은 본문 상단으로 내려감) */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: '32px', px: '32px', pb: '8px', flexShrink: 0 }}>
          <IconButton
            onClick={onClose}
            aria-label="닫기"
            sx={{ bgcolor: 'grey.100', width: 32, height: 32, '&:hover': { bgcolor: 'grey.200' } }}
          >
            <CloseIcon sx={{ fontSize: 18, color: 'grey.500' }} />
          </IconButton>
        </Box>

        {/* 본문 */}
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '20px', px: '40px' }}>
          <Typography sx={{ fontSize: 28, fontWeight: 700, lineHeight: 1.36, letterSpacing: '-0.66px', color: 'text.primary', flexShrink: 0 }}>
            참석 인원을 선택해 주세요
          </Typography>

          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 주최자 카드 */}
            <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.07)', borderRadius: '12px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.03)', pt: '16px', pb: '12px', px: '20px', flexShrink: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'grey.700' }}>주최자</Typography>
              <AttendeeRow variant="plain" name={host.name} role={host.role} avatarSrc={host.avatarSrc} avatarColor={host.avatarColor} sx={{ py: '8px' }} />
            </Box>

            {/* 참석자 카드 */}
            <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.07)', borderRadius: '12px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.03)', pt: '20px', pb: '8px', px: '20px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '10px', flexShrink: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'grey.700' }}>
              참석자
              {draft.length > 0 && (
                <Box component="span" sx={{ color: 'primary.main', ml: '4px' }}>{draft.length}</Box>
              )}
            </Typography>
            {draft.length > 0 && (
              <Button size="small" onClick={handleClearAll} sx={{ color: 'grey.500', fontSize: 13, textDecoration: 'underline' }}>
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
                  <Avatar src={option.avatarSrc} sx={{ width: 26, height: 26, fontSize: 11, fontWeight: 600 }}>
                    {option.name.slice(-2)}
                  </Avatar>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap' }}>{option.name}</Typography>
                  {option.role && (
                    <Typography sx={{ fontSize: 12, color: 'grey.400', whiteSpace: 'nowrap' }}>{option.role}</Typography>
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
                    startAdornment: <SearchIcon sx={{ fontSize: 20, color: 'text.disabled', ml: '2px', mr: '2px' }} />,
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
                    <Button size="small" onClick={handleClearAll} sx={{ color: 'grey.500', fontSize: 13, textDecoration: 'underline' }}>
                      모두 지우기
                    </Button>
                  </Stack>
                  <Divider />
                  {paperProps.children}
                </Paper>
              ),
            }}
            sx={{ mb: '8px', flexShrink: 0, '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: 15 } }}
          />

          {draft.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" spacing="10px" sx={{ flex: 1 }}>
              <GroupOutlinedIcon sx={{ fontSize: 28, color: 'grey.400' }} />
              <Typography sx={{ fontSize: 13, color: 'grey.500' }}>함께할 동료를 선택해 주세요</Typography>
            </Stack>
          ) : (
            <Stack sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              {draft.map((person, index) => (
                <Fragment key={person.id}>
                  {index > 0 && <Divider sx={{ borderColor: ROW_DIVIDER }} />}
                  <AttendeeRow
                    variant="plain"
                    name={person.name}
                    role={person.role}
                    avatarSrc={person.avatarSrc}
                    avatarColor={person.avatarColor}
                    roleLevel={person.roleLevel}
                    onRoleLevelChange={(level) => handleRoleLevelChange(person.id, level)}
                    onRemove={() => handleRemove(person.id)}
                  />
                </Fragment>
              ))}
            </Stack>
          )}
            </Box>
          </Box>
        </Box>

        {/* 푸터: 리스트가 흰색 페이드 아래로 스크롤되고 그 위에 CTA */}
        <Box sx={{ flexShrink: 0, px: '40px', pt: '16px', pb: '40px', background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 40%)' }}>
          <Button fullWidth variant="contained" size="large" onClick={handleConfirm}>
            선택 완료
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
