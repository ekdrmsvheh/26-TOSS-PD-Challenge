import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { primitives } from '../../styles/themes';

/**
 * IntroView 템플릿
 *
 * 밋핏의 인트로 화면 — 사이트 진입 시 가장 먼저 보여주는 랜딩 화면. 제품을 한 줄로
 * 소개하고 "시작하기"를 누르면 실제 플로우(미팅 시간 찾기)로 진입한다
 * (Figma node 200:32573 기준).
 *
 * Props:
 * @param {function} onStart - "시작하기" 버튼 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <IntroView onStart={() => setPage('flow')} />
 */
export function IntroView({ onStart, sx }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 'clamp(80px, 18vh, 200px)',
        px: '24px',
        ...sx,
      }}
    >
      <Stack alignItems="center" spacing="54px">
        <Stack alignItems="center" spacing="24px">
          <Typography
            component="p"
            sx={{
              fontSize: '1.375rem',
              fontWeight: 700,
              backgroundImage: `linear-gradient(90deg, ${primitives.blue[400]}, ${primitives.blue[600]})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Meet Fit
          </Typography>

          <Stack alignItems="center" spacing="24px">
            <Typography
              component="h1"
              sx={{
                fontSize: 'clamp(2.25rem, 4vw + 1rem, 3.5rem)',
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: '-0.03em',
                color: 'text.primary',
                textAlign: 'center',
                wordBreak: 'keep-all',
                textWrap: 'balance',
              }}
            >
              모두에게 딱 맞는 미팅 시간 찾기
            </Typography>

            <Stack alignItems="center" sx={{ maxWidth: 460 }}>
              <Typography sx={{ fontSize: '1.375rem', fontWeight: 500, color: 'text.secondary', textAlign: 'center', lineHeight: 1.4, wordBreak: 'keep-all' }}>
                빠르게 확정되는 상황과, 조율이 필요한 상황
              </Typography>
              <Typography sx={{ fontSize: '1.375rem', fontWeight: 500, color: 'text.secondary', textAlign: 'center', lineHeight: 1.4, wordBreak: 'keep-all' }}>
                두 가지 흐름으로 미팅 조율 경험을 설계했습니다
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Button
          onClick={onStart}
          sx={{
            bgcolor: 'text.primary',
            color: '#FFFFFF',
            px: '38px',
            py: '18px',
            fontSize: '1.25rem',
            fontWeight: 700,
            borderRadius: '16px',
            '&:hover': { bgcolor: 'grey.800' },
          }}
        >
          시작하기
        </Button>
      </Stack>
    </Box>
  );
}
