import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
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
 * 3. onRemove가 있고 isHost가 false일 때만 삭제 버튼 노출
 *
 * Props:
 * @param {string} name - 참석자 이름 [Required]
 * @param {string} role - 직함/역할 텍스트 (예: '프로덕트 디자이너') [Optional]
 * @param {string} avatarSrc - 아바타 이미지 URL [Optional]
 * @param {boolean} isHost - 주최자 여부 [Optional, 기본값: false]
 * @param {string} roleLevel - 참석 레벨 ('required' | 'recommended' | 'optional') [Optional]
 * @param {function} onRemove - 삭제 버튼 핸들러 [Optional]
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
  isHost = false,
  roleLevel,
  onRemove,
  sx,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px', // --radius-md
        ...sx,
      }}
    >
      <Avatar src={avatarSrc} sx={{ width: 36, height: 36, flexShrink: 0 }}>
        {name?.[0]}
      </Avatar>

      <Box sx={{ flex: '1 1 0%', minWidth: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap' }}>
          {name}
        </Typography>
        {roleLevel && (
          <StatusDot label={ROLE_LEVEL_LABEL[roleLevel]} color={ROLE_LEVEL_COLOR[roleLevel]} />
        )}
        {role && (
          <Typography
            sx={{
              fontSize: 13,
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: '100px',
            }}
          >
            {role}
          </Typography>
        )}
      </Box>

      {isHost ? (
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
      ) : (
        onRemove && (
          <IconButton size="small" onClick={onRemove} aria-label={`${name} 삭제`}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )
      )}
    </Box>
  );
}
