import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { alpha } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { CardContainer } from '../card/CardContainer';
import { CardPageLayout } from '../layout/CardPageLayout';
import { primitives } from '../../styles/themes';

/**
 * MeetingInfoView 템플릿
 *
 * "미팅 정보 작성" 화면 — 미팅 시간 찾기 다음 단계로, 확정 전 추천 시간 후보를 참고하며
 * 미팅 주제/목적/참석 요청 이유/응답 기한을 작성해 참석자에게 보낼 검토 요청을 준비한다.
 * Figma 최종 시안(node-id 212-23075, 프레임 333:36948) 실측값 기준으로 구현했다.
 *
 * 동작 방식:
 * 1. 좌측 "미팅 조건" 카드는 미팅 시간 찾기 단계의 참여 인원과 추천 시간 상위 3개를
 *    정적 리스트로 보여준다 (읽기 전용 요약 — 이 단계에서 재선택하지 않는다)
 * 2. 우측 "미팅 목적" 카드의 "AI 자동 생성"을 누르면 미팅 주제를 바탕으로 미팅 목적과
 *    참석자별 참석 요청 이유를 데모 문구로 한 번에 채운다 (실제 생성 없는 프로토타입 데모)
 * 3. 미팅 목적이 비어 있으면 "일정 검토 요청 보내기" 버튼이 비활성 상태로 표시된다
 *
 * Props:
 * @param {function} onSubmit - "일정 검토 요청 보내기" 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <MeetingInfoView onSubmit={() => setStep(3)} />
 */

// 참여 인원 아바타 색상 규칙 — AvailableScheduleView와 동일 (docs/product/정책/제품 데이터 정책.md 5.4절)
const requiredAvatarTones = [primitives.blue[600], primitives.blue[500], primitives.blue[400], primitives.blue[300]];
const optionalAvatarTones = [primitives.grey[500], primitives.grey[400]];

const HOST = { name: '이지혜', tone: requiredAvatarTones[0] };
const REQUIRED_ATTENDEES = [
  { name: '임정희', tone: requiredAvatarTones[1] },
  { name: '이상륜', tone: requiredAvatarTones[2] },
  { name: '허지은', tone: requiredAvatarTones[3] },
];
const OPTIONAL_ATTENDEES = [
  { name: '신창철', tone: optionalAvatarTones[0] },
  { name: '김주연', tone: optionalAvatarTones[1] },
];

// 아바타에는 성을 뺀 이름 2글자만 표시한다 (예: '임정희' → '정희')
const shortName = (fullName) => fullName.slice(-2);

const timeCandidates = [
  { label: '전원 참여, 가장 빠른 시간', date: '7/13(월)', time: '오전 10:00' },
  { label: '전원 참석, 두번째로 빠른 시간', date: '7/14(화)', time: '오후 12:00' },
  { label: '전원 참석, 세번째로 빠른 시간', date: '7/15(수)', time: '오후 5:00' },
];

// "AI 자동 생성" 클릭 시 채워지는 데모 문구
const AI_GENERATED_PURPOSE = '1차 구현 범위를 정하고 다음 개발 단계를 시작하기 위해';
const AI_GENERATED_REASONS = {
  임정희: '이번 스프린트 범위와 우선순위를 확정해야 해서 정희님의 판단이 필요해요',
  이상륜: '결정한 방향이 실제 구현 가능한지 바로 확인해야 해요',
  허지은: 'API 영향이 있는 안건이라 기술 검토 의견이 필요해요',
  신창철: '콘텐츠 정책과 표현 기준에 어긋나는 부분이 있는지 확인 부탁드려요',
  김주연: '결정 이후 측정할 지표와 로그 기준을 함께 정리하려고 해요',
};

// AI 자동 생성 버튼의 그라데이션 톤 — Figma 라디얼 하이라이트(rgba(90,192,255,1)→rgba(0,128,255,0))를
// 선형 그라데이션으로 근사
const AI_GRADIENT = 'linear-gradient(135deg, #5AC0FF 0%, #4974E2 60%)';

// Figma "Text Field" 컴포넌트 실측값 — radius 12px, input dropshadow, 15px Regular 값/플레이스홀더
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0.144px',
    bgcolor: 'background.paper',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.03)',
    '& fieldset': { borderColor: 'divider' },
    '&:hover fieldset': { borderColor: 'text.secondary' },
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 16px',
  },
  '& .MuiOutlinedInput-input::placeholder, & .MuiOutlinedInput-input.Mui-disabled::placeholder': {
    color: 'grey.400',
    opacity: 1,
  },
};

const fieldLabelSx = { fontSize: 14, fontWeight: 600, color: 'grey.500', mb: '8px' };

// Figma "Content Badge" 스펙 — 8% 투명도 틴트 배경 + 동일 색 11px SemiBold 텍스트
const badgeSx = (isRequired) => {
  const tone = isRequired ? primitives.blue[600] : primitives.grey[700];
  return {
    display: 'inline-flex',
    alignItems: 'center',
    height: '20px',
    px: '6px',
    borderRadius: '6px',
    fontSize: 11,
    fontWeight: 700,
    color: tone,
    bgcolor: alpha(tone, 0.08),
    flexShrink: 0,
  };
};

export function MeetingInfoView({ onSubmit, sx }) {
  const [topic, setTopic] = useState('AI 운영 에이전트 방향 결정');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [purpose, setPurpose] = useState('');
  const [reasons, setReasons] = useState({});

  const attendeeReasonRows = [
    ...REQUIRED_ATTENDEES.map((person) => ({ ...person, level: 'required' })),
    ...OPTIONAL_ATTENDEES.map((person) => ({ ...person, level: 'optional' })),
  ];

  const handleGeneratePurpose = () => {
    setPurpose(AI_GENERATED_PURPOSE);
    setReasons(AI_GENERATED_REASONS);
  };

  const handleReasonChange = (name, value) => {
    setReasons((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit = purpose.trim().length > 0;

  const leftCard = (
    <CardContainer variant="elevation" padding="card" radius="card" sx={{ width: { xs: '100%', md: '340px' }, minWidth: 0 }}>
      <Typography variant="h5" sx={{ mb: '20px' }}>미팅 조건</Typography>

      <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'grey.500', mb: '12px' }}>참석 인원</Typography>
      <Stack direction="row" alignItems="center" sx={{ mb: '20px' }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            zIndex: 1,
            fontSize: 12,
            fontWeight: 600,
            border: '2px solid',
            borderColor: 'background.paper',
            bgcolor: HOST.tone,
          }}
        >
          {shortName(HOST.name)}
        </Avatar>
        {REQUIRED_ATTENDEES.map((person) => (
          <Avatar
            key={person.name}
            sx={{
              width: 36,
              height: 36,
              ml: '-4px',
              zIndex: 1,
              fontSize: 12,
              fontWeight: 600,
              border: '2px solid',
              borderColor: 'background.paper',
              bgcolor: person.tone,
            }}
          >
            {shortName(person.name)}
          </Avatar>
        ))}
        {OPTIONAL_ATTENDEES.map((person) => (
          <Avatar
            key={person.name}
            sx={{
              width: 36,
              height: 36,
              ml: '-4px',
              zIndex: 1,
              fontSize: 12,
              fontWeight: 600,
              border: '2px solid',
              borderColor: 'background.paper',
              bgcolor: person.tone,
            }}
          >
            {shortName(person.name)}
          </Avatar>
        ))}
      </Stack>

      <Box sx={{ borderTop: '1px solid', borderColor: primitives.line.neutral, pt: '20px' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'grey.500', mb: '12px' }}>추천 시간</Typography>
        <Stack spacing="8px">
          {timeCandidates.map((candidate) => (
            <CardContainer
              key={candidate.date + candidate.time}
              variant="outlined"
              padding="none"
              sx={{ borderRadius: '12px', px: '18px', py: '14px' }}
            >
              <Typography sx={{ fontSize: 17, fontWeight: 600 }}>
                {candidate.date} {candidate.time}
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'grey.500', mt: '2px' }}>
                {candidate.label}
              </Typography>
            </CardContainer>
          ))}
        </Stack>
      </Box>
    </CardContainer>
  );

  const basicInfoCard = (
    <CardContainer key="basic-info" variant="elevation" padding="card" radius="card">
      <Typography variant="h5" sx={{ mb: '20px' }}>기본 정보</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '12px' }}>
        <Box>
          <Typography sx={fieldLabelSx}>
            미팅 주제
            <Box component="span" sx={{ color: 'error.main' }}> *</Box>
          </Typography>
          <TextField
            fullWidth
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="미팅 주제를 입력해 주세요"
            sx={fieldSx}
          />
        </Box>
        <Box>
          <Typography sx={fieldLabelSx}>관련 자료</Typography>
          <TextField
            fullWidth
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            placeholder="URL을 입력해 주세요"
            sx={fieldSx}
          />
        </Box>
      </Box>
    </CardContainer>
  );

  const purposeCard = (
    <CardContainer key="purpose" variant="elevation" padding="card" radius="card">
      {/* AI 자동 생성 아이콘의 그라데이션 채우기용 정의 — 문서 내 어디서든 fill: url(#ai-gradient-fill)로 참조 가능 */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="ai-gradient-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5AC0FF" />
            <stop offset="60%" stopColor="#4974E2" />
          </linearGradient>
        </defs>
      </svg>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '20px' }}>
        <Typography variant="h5">미팅 목적</Typography>
        <Button
          size="small"
          onClick={handleGeneratePurpose}
          startIcon={<AutoAwesomeIcon sx={{ fontSize: 15, fill: 'url(#ai-gradient-fill)' }} />}
          sx={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.203px',
            background: AI_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          AI 자동 생성
        </Button>
      </Stack>

      <Typography sx={fieldLabelSx}>미팅 목적</Typography>
      <TextField
        fullWidth
        multiline
        minRows={2}
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="회의에서 결정해야 할 내용을 입력해 주세요"
        sx={{ ...fieldSx, mb: '20px' }}
      />

      <Stack direction="row" alignItems="center" spacing="12px" sx={{ mb: '8px' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'grey.700', flexShrink: 0 }}>
          참석 요청 이유
        </Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: primitives.line.neutral }} />
      </Stack>
      <Stack spacing="10px">
        {attendeeReasonRows.map((person) => (
          <Stack key={person.name} direction="row" alignItems="center" spacing="16px">
            <Stack direction="row" alignItems="center" spacing="6px" sx={{ flexShrink: 0, minWidth: '86px' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'grey.500', whiteSpace: 'nowrap' }}>
                {person.name}
              </Typography>
              <Box component="span" sx={badgeSx(person.level === 'required')}>
                {person.level === 'required' ? '필수참석' : '선택참석'}
              </Box>
            </Stack>
            <TextField
              fullWidth
              value={reasons[person.name] ?? ''}
              onChange={(e) => handleReasonChange(person.name, e.target.value)}
              placeholder="미팅 참석 필요성을 이해할 수 있게 적어 주세요"
              sx={fieldSx}
            />
          </Stack>
        ))}
      </Stack>
    </CardContainer>
  );

  const responseRequestCard = (
    <CardContainer key="response-request" variant="elevation" padding="card" radius="card">
      <Typography variant="h5" sx={{ mb: '20px' }}>응답 요청</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '12px' }}>
        <Box>
          <Typography sx={fieldLabelSx}>응답 기한</Typography>
          <TextField
            fullWidth
            value="7월 10일 (금) 오후 1시"
            slotProps={{ htmlInput: { readOnly: true } }}
            sx={fieldSx}
          />
        </Box>
        <Box>
          <Typography sx={fieldLabelSx}>미응답 자동 리마인드</Typography>
          <TextField
            fullWidth
            value="요청 후 1시간 뒤"
            slotProps={{ htmlInput: { readOnly: true } }}
            sx={fieldSx}
          />
        </Box>
      </Box>
    </CardContainer>
  );

  const submitRow = (
    <Stack key="submit" direction="row" justifyContent="space-between" alignItems="center" spacing="16px">
      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
        추천 시간과 미팅 정보를 바탕으로, 실제 가능 여부를 확인 요청할게요.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={!canSubmit}
        onClick={onSubmit}
        sx={{ flexShrink: 0 }}
      >
        일정 검토 요청 보내기
      </Button>
    </Stack>
  );

  return (
    <CardPageLayout
      title="미팅 정보"
      sx={sx}
      left={leftCard}
      right={[basicInfoCard, purposeCard, responseRequestCard, submitRow]}
    />
  );
}
