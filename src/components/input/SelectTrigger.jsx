import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/**
 * SelectTrigger 컴포넌트
 *
 * 실제 값 선택은 팝업(캘린더, 커스텀 메뉴 등)에서 이루어지고,
 * 화면에는 현재 값만 보여주는 버튼형 트리거. 네이티브 MUI Select로
 * 표현하기 어려운 커스텀 드롭다운(날짜 범위, 프리셋+직접입력 등)의
 * 진입점으로 사용한다.
 *
 * 동작 방식:
 * 1. value가 있으면 검정 텍스트로, 없으면 placeholder를 muted 톤으로 표시
 * 2. 클릭 시 onClick 콜백만 실행 — 실제 팝업 렌더링은 부모가 담당
 * 3. isRequired가 true면 라벨 옆에 error 색상 asterisk 표시
 * 4. size="small"이면 높이 32px 고정 + 패딩/폰트가 한 단계 작아진다 (라운딩은 8px로 고정, 조건 요약 카드처럼 좁은 폼에 사용)
 *
 * Props:
 * @param {string} label - 필드 라벨 [Optional]
 * @param {string} value - 현재 선택된 값 텍스트 [Optional]
 * @param {string} placeholder - 값이 없을 때 표시할 안내 텍스트 [Optional, 기본값: '선택하세요']
 * @param {node} icon - 좌측 아이콘 [Optional]
 * @param {boolean} isRequired - 필수 여부 (라벨 옆 * 표시) [Optional, 기본값: false]
 * @param {boolean} isDisabled - 비활성화 여부 [Optional, 기본값: false]
 * @param {boolean} hideChevron - 우측 드롭다운 화살표 숨김 여부 [Optional, 기본값: false]
 * @param {'medium'|'small'} size - 크기 변형 [Optional, 기본값: 'medium']
 * @param {function} onClick - 버튼 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <SelectTrigger
 *   label="소요 시간"
 *   value="1시간"
 *   isRequired
 *   onClick={() => setDurationMenuOpen(true)}
 * />
 */
export const SelectTrigger = forwardRef(function SelectTrigger({
  label,
  value,
  placeholder = '선택하세요',
  icon,
  isRequired = false,
  isDisabled = false,
  hideChevron = false,
  size = 'medium',
  onClick,
  sx,
  ...props
}, ref) {
  const isSmall = size === 'small';
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {label && (
        <Typography
          component="label"
          sx={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: 'text.secondary',
            mb: '7px',
          }}
        >
          {label}
          {isRequired && (
            <Box component="span" sx={{ color: 'error.main' }}>
              {' '}*
            </Box>
          )}
        </Typography>
      )}
      <Box
        ref={ref}
        component="button"
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        sx={{
          width: '100%',
          height: isSmall ? '32px' : 'auto',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: isSmall ? '4px' : '10px',
          fontFamily: 'inherit',
          fontSize: isSmall ? 14 : 14,
          fontWeight: isSmall ? 500 : 600,
          padding: isSmall ? '6px 12px' : '13px 15px',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px', // Toss 인풋 반경 — 크기와 무관하게 통일
          textAlign: 'left',
          color: value ? 'text.primary' : 'text.disabled',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
          '&:hover': isDisabled ? {} : { borderColor: 'text.secondary' },
        }}
        {...props}
      >
        {icon}
        <Box
          component="span"
          sx={{
            flex: '1 1 0%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value || placeholder}
        </Box>
        {!hideChevron && (
          <KeyboardArrowDownIcon sx={{ fontSize: isSmall ? 14 : 16, color: 'text.secondary', flexShrink: 0 }} />
        )}
      </Box>
    </Box>
  );
});
