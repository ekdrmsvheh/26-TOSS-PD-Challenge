import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import CloseIcon from '@mui/icons-material/Close';
import { StatusDot } from '../../common/ui/StatusDot';

const ROLE_LEVEL_COLOR = {
  required: 'error.main',
  recommended: 'text.primary',
  optional: 'secondary.main',
};

const ROLE_LEVEL_LABEL = {
  required: '필수',
  recommended: '권장',
  optional: '선택',
};

/**
 * AttendeeRow 컴포넌트
 *
 * 미팅 참석자 한 명을 표시하는 행. 아바타, 이름, 역할(직함),
 * 필수/권장/선택 레벨, 주최자 뱃지, 삭제 버튼으로 구성된다.
 *
 * 동작 방식:
 * 1. isHost가 true면 "주최자" 뱃지를 표시하고 삭제 버튼을 숨긴다 (주최자는 삭제 불가)
 * 2. roleLevel이 있으면 이름 옆에 필수/권장/선택 점 표시
 * 3. onRoleLevelChange가 있으면 점 대신 필수/선택 토글(ToggleButtonGroup)을 표시한다 (recommended는 토글 대상에서 제외)
 * 4. onRemove가 있고 isHost가 false일 때만 삭제 버튼 노출
 * 5. variant='plain'이면 개별 보더/라운드를 없앤다 — 카드 안에 divider로 구분해 나열할 때 사용
 *
 * Props:
 * @param {string} name - 참석자 이름 [Required]
 * @param {string} role - 직함/역할 텍스트 (예: '프로덕트 디자이너') [Optional]
 * @param {string} avatarSrc - 아바타 이미지 URL [Optional]
 * @param {string} avatarColor - 아바타 배경색(theme 팔레트 경로 또는 hex) [Optional]
 * @param {boolean} isHost - 주최자 여부 [Optional, 기본값: false]
 * @param {string} roleLevel - 참석 레벨 ('required' | 'recommended' | 'optional') [Optional]
 * @param {function} onRoleLevelChange - 필수/선택 토글 변경 핸들러 (level) => void [Optional, 있으면 점 대신 토글 렌더]
 * @param {function} onRemove - 삭제 버튼 핸들러 [Optional]
 * @param {string} variant - 'bordered'(개별 보더 박스) | 'plain'(보더 없이 나열) [Optional, 기본값: 'bordered']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <AttendeeRow
 *   name="이지혜"
 *   role="프로덕트 디자이너"
 *   isHost
 * />
 */
export function AttendeeRow({
  name,
  role,
  avatarSrc,
  avatarColor,
  isHost = false,
  roleLevel,
  onRoleLevelChange,
  onRemove,
  variant = 'bordered',
  sx,
}) {
  const isPlain = variant === 'plain';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: isPlain ? '12px 0' : '12px 14px',
        ...(isPlain
          ? {}
          : { border: '1px solid', borderColor: 'divider', borderRadius: '12px' /* --radius-md */ }),
        ...sx,
      }}
    >
      <Avatar
        src={avatarSrc}
        sx={{ width: 44, height: 44, flexShrink: 0, ...(avatarColor && { bgcolor: avatarColor }) }}
      >
        {name?.[0]}
      </Avatar>

      <Box sx={{ flex: '1 1 0%', minWidth: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap' }}>
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {roleLevel && !onRoleLevelChange && (
            <StatusDot label={ROLE_LEVEL_LABEL[roleLevel]} color={ROLE_LEVEL_COLOR[roleLevel]} />
          )}
          {role && (
            <Typography
              sx={{
                fontSize: 13,
                color: 'grey.500',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {role}
            </Typography>
          )}
        </Box>
      </Box>

      {isHost && (
        <Box
          component="span"
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: 'text.primary',
            bgcolor: 'background.stone',
            padding: '8px 14px',
            borderRadius: '9px',
            flexShrink: 0,
          }}
        >
          주최자
        </Box>
      )}

      {roleLevel && onRoleLevelChange && (
        <ToggleButtonGroup
          size="small"
          exclusive
          value={roleLevel}
          onChange={(_, value) => value && onRoleLevelChange(value)}
          sx={{
            flexShrink: 0,
            bgcolor: 'grey.100',
            borderRadius: '8px', // --radius/8
            gap: '2px',
            p: '3px',
            '& .MuiToggleButtonGroup-grouped': {
              border: 0,
              borderRadius: '6px !important', // --radius/6
              px: '12px',
              py: '3px',
              fontSize: 13,
              fontWeight: 600,
              color: 'grey.500',
              textTransform: 'none',
              '&.Mui-selected': {
                bgcolor: 'background.paper',
                color: 'primary.main', // Blue is interaction — 선택된 값만 브랜드 블루
                boxShadow: '0px 4px 4px rgba(36, 42, 48, 0.04)', // Flex/Shadow
                '&:hover': { bgcolor: 'background.paper' },
              },
            },
          }}
        >
          <ToggleButton value="required">필수</ToggleButton>
          <ToggleButton value="optional">선택</ToggleButton>
        </ToggleButtonGroup>
      )}

      {!isHost && onRemove && (
        <IconButton size="small" onClick={onRemove} aria-label={`${name} 삭제`} sx={{ color: 'grey.500' }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      )}
    </Box>
  );
}
