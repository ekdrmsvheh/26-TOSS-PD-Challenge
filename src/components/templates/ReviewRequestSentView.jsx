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
 *
 * Props:
 * @param {number} attendeeCount - 검토 요청을 받은 참석자 수 [Optional, 기본값: 5]
 * @param {number} candidateCount - 함께 전달한 추천 후보 개수 [Optional, 기본값: 3]
 * @param {function} onViewResponses - "응답 현황 보기" 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <ReviewRequestSentView attendeeCount={5} onViewResponses={() => setStep(4)} />
 */
export function ReviewRequestSentView({ attendeeCount = 5, candidateCount = 3, onViewResponses, sx }) {
  return (
    <CardPageLayout sx={{ ...sx, alignItems: 'center' }}>
      <Stack alignItems="center" spacing="20px" sx={{ maxWidth: 440, mx: 'auto', textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'success.main',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckIcon sx={{ fontSize: 34 }} />
        </Box>
        <Typography variant="h4">참석자 {attendeeCount}명에게 검토 요청을 보냈어요</Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6 }}>
          추천 후보 {candidateCount}개와 미팅 정보를 함께 전달했어요.
          <br />
          참석자들이 각자 가능 여부를 확인하면 응답 현황에서 볼 수 있어요.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onViewResponses}
          sx={{ mt: '4px' }}
        >
          응답 현황 보기
        </Button>
      </Stack>
    </CardPageLayout>
  );
}
