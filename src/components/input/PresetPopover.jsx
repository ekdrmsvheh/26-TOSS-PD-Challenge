import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

/**
 * PresetPopover 컴포넌트
 *
 * "프리셋 버튼 + 직접 입력 + 완료"로 구성된 조건 편집 팝업의 공통 셸.
 * 미팅 길이·일정 범위·탐색 시간처럼 자주 쓰는 값은 프리셋으로 바로 고르고,
 * 필요하면 children 영역의 커스텀 입력으로 직접 값을 넣는 패턴에 재사용한다.
 *
 * 동작 방식:
 * 1. 프리셋 버튼을 누르면 onSelectPreset이 즉시 호출된다 (바로 반영)
 * 2. children(커스텀 입력)은 값이 바로 반영되지 않고, onSecondaryAction("OO 적용")을
 *    눌러야 반영된다 — 오탈자·중간 입력 상태가 실수로 확정되는 것을 막기 위함
 * 3. "완료"(onConfirm)를 눌러야 팝업이 닫히고 지금까지의 선택이 최종 확정된다
 *
 * Props:
 * @param {boolean} open - 팝업 표시 여부 [Required]
 * @param {Element} anchorEl - 팝업이 붙을 기준 엘리먼트 [Required]
 * @param {function} onClose - 팝업 닫기 핸들러 [Required]
 * @param {string} eyebrow - 상단 소제목 (예: '미팅 길이') [Optional]
 * @param {string} heading - 질문형 제목 (예: '얼마나 진행할까요?') [Optional]
 * @param {string} description - 설명 문구 [Optional]
 * @param {Array<{value: string|number, label: string}>} presets - 프리셋 목록 [Optional]
 * @param {string|number} value - 현재 선택된 프리셋 값 (하이라이트 비교용) [Optional]
 * @param {function} onSelectPreset - 프리셋 클릭 핸들러 (value) => void [Optional]
 * @param {node} children - 커스텀 입력 영역 [Optional]
 * @param {string} secondaryActionLabel - 커스텀 입력 적용 버튼 라벨 (예: '직접 입력 적용') [Optional]
 * @param {function} onSecondaryAction - 커스텀 입력 적용 버튼 핸들러 [Optional, 있으면 버튼 노출]
 * @param {function} onConfirm - "완료" 클릭 핸들러 [Required]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <PresetPopover
 *   open={open}
 *   anchorEl={anchorEl}
 *   onClose={handleClose}
 *   eyebrow="미팅 길이"
 *   heading="얼마나 진행할까요?"
 *   presets={[{ value: 30, label: '30분' }, { value: 60, label: '1시간' }]}
 *   value={duration}
 *   onSelectPreset={setDuration}
 *   onConfirm={handleClose}
 * />
 */
export function PresetPopover({
  open,
  anchorEl,
  onClose,
  eyebrow,
  heading,
  description,
  presets = [],
  value,
  onSelectPreset,
  children,
  secondaryActionLabel,
  onSecondaryAction,
  onConfirm,
  sx,
}) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{ paper: { sx: { borderRadius: '16px', mt: '4px', width: '340px' } } }}
    >
      <Box sx={{ p: '20px', ...sx }}>
        {eyebrow && (
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: '4px' }}>
            {eyebrow}
          </Typography>
        )}
        {heading && (
          <Typography sx={{ fontSize: 17, fontWeight: 700, mb: '6px' }}>{heading}</Typography>
        )}
        {description && (
          <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.5, mb: '16px' }}>
            {description}
          </Typography>
        )}

        {presets.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mb: children ? '16px' : 0 }}>
            {presets.map((preset) => {
              const isSelected = value === preset.value;
              return (
                <Button
                  key={preset.value}
                  size="small"
                  onClick={() => onSelectPreset?.(preset.value)}
                  sx={{
                    borderRadius: '20px',
                    px: '14px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: 13,
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    bgcolor: isSelected ? 'primary.main' : 'transparent',
                    color: isSelected ? 'primary.contrastText' : 'text.primary',
                    '&:hover': { bgcolor: isSelected ? 'primary.dark' : 'action.hover' },
                  }}
                >
                  {preset.label}
                </Button>
              );
            })}
          </Box>
        )}

        {children}

        <Stack direction="row" spacing="8px" sx={{ mt: '18px' }}>
          {onSecondaryAction && (
            <Button
              fullWidth
              variant="outlined"
              onClick={onSecondaryAction}
              sx={{ color: 'text.secondary', borderColor: 'divider' }}
            >
              {secondaryActionLabel}
            </Button>
          )}
          <Button fullWidth variant="contained" onClick={onConfirm}>
            완료
          </Button>
        </Stack>
      </Box>
    </Popover>
  );
}
