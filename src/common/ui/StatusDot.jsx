import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * StatusDot 컴포넌트
 *
 * 색상 점 + 라벨(+ 숫자)로 상태를 나타내는 소형 인디케이터.
 * 참석자 필수/권장/선택 인원 요약처럼, 카테고리별 카운트를
 * 한 줄에 나열할 때 사용한다.
 *
 * Props:
 * @param {string} label - 상태 라벨 (예: '필수') [Required]
 * @param {number} count - 표시할 숫자 [Optional]
 * @param {string} color - 점 색상 (theme 팔레트 경로, 예: 'error.main') [Optional, 기본값: 'text.primary']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <StatusDot label="필수" count={1} color="error.main" />
 */
export function StatusDot({ label, count, color = 'text.primary', sx }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '4px',
        fontSize: '12.5px',
        ...sx,
      }}
    >
      <Box
        component="b"
        sx={{ color, fontStyle: 'normal', lineHeight: 1 }}
      >
        ●
      </Box>
      <Typography component="span" sx={{ fontSize: 'inherit', color: 'text.primary' }}>
        {label}
        {count !== undefined && ` ${count}`}
      </Typography>
    </Box>
  );
}
