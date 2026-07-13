import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { SectionTitle } from '../storybookDocumentation';
import { CardPageLayout } from './CardPageLayout';
import { CardContainer } from '../card/CardContainer';
import Placeholder from '../../common/ui/Placeholder';

export default {
  title: 'Component/8. Layout/CardPageLayout',
  component: CardPageLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## CardPageLayout

카드(흰 박스, \`CardContainer\`) 기반 화면의 공통 콘텐츠 셸. max-width 1280px, 좌우 40px·상단 80px 패딩을 가지며
title이 있으면 타이틀-카드 간격 20px을 둔다. left가 있으면 좌(1개 카드)+우(카드 스택) 2컬럼
분할 모드(컬럼 간 갭 20px, 우측 스택 갭 12px)로 전환되고, 없으면 children을 단일 컬럼으로 렌더링한다.

### 용도
- 좌측에서 조건을 설정하고 우측에 그 결과를 여러 카드로 보여주는 화면 (미팅 시간 찾기, 미팅 정보 작성)
- 좌우 분할이 맞지 않는 단일 컬럼 화면의 바깥 컨테이너 규격 통일 (참석자 응답 등)
        `,
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: '페이지 타이틀' },
  },
};

/** 기본 사용 (좌1개 + 우스택 분할 모드) */
export const Default = {
  args: {
    title: '미팅 시간 찾기',
  },
  render: (args) => (
    <CardPageLayout
      {...args}
      left={
        <CardContainer padding="lg" sx={{ borderRadius: '12px', width: 340 }}>
          <Placeholder.Text variant="heading" />
          <Box sx={{ mt: 2 }}>
            <Placeholder.Paragraph lines={4} />
          </Box>
        </CardContainer>
      }
      right={[
        <CardContainer key="rec" padding="lg" sx={{ borderRadius: '12px' }}>
          <Placeholder.Text variant="heading" />
          <Box sx={{ mt: 2 }}>
            <Placeholder.Box label="추천 시간" height={100} />
          </Box>
        </CardContainer>,
        <CardContainer key="calendar" padding="lg" sx={{ borderRadius: '12px' }}>
          <Placeholder.Text variant="heading" />
          <Box sx={{ mt: 2 }}>
            <Placeholder.Box label="캘린더" height={260} />
          </Box>
        </CardContainer>,
      ]}
    />
  ),
};

/** 단일 컬럼 모드 (바깥 컨테이너 규격만 적용) */
export const SingleColumn = {
  render: () => (
    <CardPageLayout>
      <Box sx={{ maxWidth: 640, mx: 'auto' }}>
        <CardContainer padding="lg" sx={{ borderRadius: '12px' }}>
          <Placeholder.Text variant="heading" />
          <Box sx={{ mt: 2 }}>
            <Placeholder.Paragraph lines={3} />
          </Box>
        </CardContainer>
      </Box>
    </CardPageLayout>
  ),
};

/** 문서 및 데모 */
export const Documentation = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        CardPageLayout
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        카드 기반 화면의 바깥 컨테이너 규격과 카드 간격을 통일하는 레이아웃 컴포넌트입니다.
      </Typography>

      <SectionTitle title="Props" description="CardPageLayout 컴포넌트의 Props입니다." />
      <TableContainer sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Prop</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Default</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontFamily: 'monospace' }}>title</TableCell>
              <TableCell>node</TableCell>
              <TableCell>-</TableCell>
              <TableCell>페이지 타이틀 (있으면 타이틀-카드 간격 20px 적용)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontFamily: 'monospace' }}>left</TableCell>
              <TableCell>node</TableCell>
              <TableCell>-</TableCell>
              <TableCell>좌측 카드 (1개, 조건 설정용). 있으면 2컬럼 분할 모드로 전환</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontFamily: 'monospace' }}>right</TableCell>
              <TableCell>node | node[]</TableCell>
              <TableCell>-</TableCell>
              <TableCell>우측 카드(들). 배열이면 세로 스택(갭 12px)으로 렌더 (left와 함께 사용)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontFamily: 'monospace' }}>children</TableCell>
              <TableCell>node</TableCell>
              <TableCell>-</TableCell>
              <TableCell>left 없이 단일 컬럼으로 렌더할 콘텐츠</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <SectionTitle title="레이아웃 규격" description="바깥 컨테이너와 카드 간격 수치입니다." />
      <TableContainer sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>항목</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>값</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>콘텐츠 영역 max-width</TableCell>
              <TableCell sx={{ fontFamily: 'monospace' }}>1280px</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>좌우 패딩</TableCell>
              <TableCell sx={{ fontFamily: 'monospace' }}>40px</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>상단 패딩</TableCell>
              <TableCell sx={{ fontFamily: 'monospace' }}>80px</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>타이틀-카드 갭</TableCell>
              <TableCell sx={{ fontFamily: 'monospace' }}>20px</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>좌/우 카드 갭</TableCell>
              <TableCell sx={{ fontFamily: 'monospace' }}>20px</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>우측 세로 스택 갭</TableCell>
              <TableCell sx={{ fontFamily: 'monospace' }}>12px</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <SectionTitle title="Usage Example" description="코드 사용 예시입니다." />
      <Box
        component="pre"
        sx={{
          backgroundColor: 'grey.100',
          p: 3,
          fontSize: 13,
          fontFamily: 'monospace',
          overflow: 'auto',
          lineHeight: 1.6,
        }}
      >
        {`// 좌1개 + 우스택 분할 모드
<CardPageLayout title="미팅 일정">
  ...
</CardPageLayout>

<CardPageLayout
  title="미팅 일정"
  left={<ConditionCard />}
  right={[<RecommendCard />, <CalendarCard />]}
/>

// 단일 컬럼 모드 (바깥 컨테이너 규격만 적용)
<CardPageLayout>
  <SingleColumnContent />
</CardPageLayout>`}
      </Box>
    </Box>
  ),
};
