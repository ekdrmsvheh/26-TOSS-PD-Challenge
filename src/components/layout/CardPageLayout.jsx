import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * CardPageLayout 컴포넌트
 *
 * 카드(흰 박스, `CardContainer`) 기반 화면의 공통 콘텐츠 셸. 밋핏 테스트 플로우 화면(미팅 시간 찾기,
 * 미팅 정보 작성 등)에서 반복되는 바깥 컨테이너 규격과 카드 간격을 하나로 통일한다.
 *
 * 동작 방식:
 * 1. 콘텐츠 영역은 max-width 1280px로 제한되고 좌우 40px·상단 80px 패딩을 갖는다
 * 2. title이 있으면 타이틀과 카드 사이 20px 간격을 둔다
 * 3. left가 있으면 좌(1개 카드)+우(카드 스택) 2컬럼 분할 모드로 전환된다 — 컬럼 간 갭 20px,
 *    우측 스택 내부 카드 간 갭 12px. 우측은 왼쪽에서 설정한 값을 참조해 보여주는 용도다
 * 4. left가 없으면 children을 단일 컬럼으로 렌더링한다 (바깥 컨테이너 규격만 적용하고
 *    싶은 화면 — 예: 참석자 응답처럼 좌우 분할이 맞지 않는 단일 컬럼 화면)
 *
 * Props:
 * @param {node} title - 페이지 타이틀 [Optional]
 * @param {node} left - 좌측 카드 (1개, 조건 설정용) [Optional] — 있으면 2컬럼 분할 모드로 전환
 * @param {node|node[]} right - 우측 카드(들). 배열이면 세로 스택(갭 12px)으로 렌더 [Optional, left와 함께 사용]
 * @param {node} children - left 없이 단일 컬럼으로 렌더할 콘텐츠 [Optional]
 * @param {object} sx - 바깥 컨테이너 추가 스타일 [Optional]
 *
 * Example usage:
 * // 좌1개 + 우스택 분할 모드
 * <CardPageLayout title="미팅 일정" left={<ConditionCard />} right={[<RecommendCard />, <CalendarCard />]} />
 *
 * // 단일 컬럼 모드 (바깥 컨테이너 규격만 적용)
 * <CardPageLayout><SingleColumnContent /></CardPageLayout>
 */
export function CardPageLayout({ title, left, right, children, sx, ...props }) {
  const isSplit = Boolean(left);

  return (
    <Box
      sx={{
        bgcolor: 'background.stone',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        px: '40px',
        py: '80px',
        ...sx,
      }}
      {...props}
    >
      <Box sx={{ width: '100%', maxWidth: '1280px' }}>
        {title && (
          <Typography variant="h2" sx={{ mb: '20px' }}>
            {title}
          </Typography>
        )}

        {isSplit ? (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '20px', alignItems: 'flex-start' }}>
            <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 'auto' } }}>{left}</Box>
            <Box sx={{ flex: '1 1 0%', minWidth: 0, width: '100%' }}>
              {Array.isArray(right) ? <Stack spacing="12px">{right}</Stack> : right}
            </Box>
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
}
