import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import { CardPageLayout } from '../layout/CardPageLayout';

/**
 * ReviewRequestSentView 템플릿
 *
 * "일정 검토 요청 발송" 화면 — 미팅 정보 작성에서 "일정 검토 요청 보내기"를 누른 직후
 * 보여주는 발송 완료 확인 화면. 회의 초안 상태가 `request_ready`에서 `collecting_responses`로
 * 넘어갔음을 알리고, 다음 단계인 응답 현황으로 넘어가는 진입점만 제공한다
 * (docs/product/정책/제품 데이터 정책.md 5.1절).
 * Figma 실측값(node-id 344:50380 계열 — 완료 화면 공통 포맷) 기준으로 아이콘/타이포/여백을
 * MeetingConfirmedView와 동일한 포맷으로 맞췄다.
 *
 * Props:
 * @param {number} candidateCount - 함께 전달한 추천 후보 개수 [Optional, 기본값: 3]
 * @param {function} onViewResponses - "응답 현황 보기" 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <ReviewRequestSentView onViewResponses={() => setStep(4)} />
 */
export function ReviewRequestSentView({ candidateCount = 3, onViewResponses, sx }) {
  return (
    <CardPageLayout sx={sx}>
      <Box sx={{ maxWidth: 560, mx: 'auto', mt: '80px' }}>
        <Stack alignItems="center" spacing="40px">
          <Stack alignItems="center" spacing="20px">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckIcon sx={{ fontSize: 24 }} />
            </Box>
            <Stack alignItems="center" spacing="12px" sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: 28, fontWeight: 700, lineHeight: 1.358, letterSpacing: '-0.66px', color: 'text.primary' }}>
                검토 요청을 보냈어요
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 400, lineHeight: 1.429, letterSpacing: '0.203px', color: 'grey.700' }}>
                추천 후보 {candidateCount}개와 미팅 정보를 함께 전달했어요.
                <br />
                참석자들이 각자 가능 여부를 확인하면 응답 현황에서 볼 수 있어요.
              </Typography>
            </Stack>
          </Stack>
          {onViewResponses && (
            <Box sx={{ width: '360px', maxWidth: '100%' }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={onViewResponses}
              >
                응답 현황 보기
              </Button>
            </Box>
          )}
        </Stack>
      </Box>
    </CardPageLayout>
  );
}
