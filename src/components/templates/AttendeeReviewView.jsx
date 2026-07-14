import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { alpha } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import { CardContainer } from '../card/CardContainer';
import { CardPageLayout } from '../layout/CardPageLayout';
import { primitives } from '../../styles/themes';

/**
 * AttendeeReviewView 템플릿
 *
 * "일정 확인 후 응답" 화면 — 주최자가 보낸 검토 요청을 받은 참석자가 자신의 역할을 확인하고,
 * 후보 3개 각각에 대해 참석 가능 여부(가능해요·가능하지만 피하고 싶어요·참석 어려워요)를 응답하는 화면.
 * Figma 최종 시안(node-id 353-39477, 프레임 353:39477) 실측값 기준으로 구현했다.
 *
 * 동작 방식:
 * 1. 좌측 "미팅 정보" 카드는 미팅 목적, 나의 역할(필수/선택참여 배지 + 사유), 참석 인원을 읽기 전용으로 보여준다
 * 2. 우측 상단 안내 블록은 후보 선정 기준과 응답 기한을 안내한다
 * 3. 후보 3개는 각각 개별 카드로, 3지선다(가능해요/가능하지만 피하고 싶어요/참석 어려워요) 응답과 선택 메모를 받는다
 * 4. 3개 후보 모두 응답해야 "응답 보내기" 버튼이 활성화된다
 * 5. 제출하면 카드 목록 대신 제출 완료 상태(체크 아이콘 + 안내 문구)를 보여준다
 *
 * Props:
 * @param {object} meeting - 미팅 정보 { host, title, purpose, deadline } [Optional, 기본값: 데모 데이터]
 * @param {object} me - 응답하는 참석자 정보 { name, level, reason } [Optional, 기본값: 데모 데이터]
 * @param {Array} candidates - 검토할 후보 목록 [{ id, date, time }] [Optional, 기본값: 데모 데이터]
 * @param {function} onSubmit - 응답 제출 핸들러, { responses, notes } 전달 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <AttendeeReviewView onSubmit={({ responses, notes }) => console.log(responses, notes)} />
 */

// 참여 인원 아바타 색상 규칙 — MeetingInfoView와 동일 (docs/product/정책/제품 데이터 정책.md 5.4절)
const requiredAvatarTones = [primitives.blue[600], primitives.blue[500], primitives.blue[400], primitives.blue[300]];
const optionalAvatarTones = [primitives.grey[500], primitives.grey[400]];

const DEFAULT_MEETING = {
  host: '이지혜',
  title: 'AI 운영 에이전트 방향 결정 미팅',
  purpose: '본 회의는 하반기 AI 운영 에이전트의 개발 우선순위를 확정하고, 각 팀별 리소스 배분 및 핵심 마일스톤을 동기화하는 것을 목표로 합니다.',
  deadline: '7월 10일(금) 오후 1시',
};

const DEFAULT_ME = {
  name: '허지은',
  level: 'required',
  reason: '지은님은 출시 범위와 담당을 확정하고 리스크를 정렬하는 역할이에요.',
};

// 참석 인원 아바타 스택 — 주최자 + 필수 참석자 3인 + 선택 참석자 2인 (MeetingInfoView와 동일 인물)
const ATTENDEES = [
  { name: '이지혜', tone: requiredAvatarTones[0] },
  { name: '임정희', tone: requiredAvatarTones[1] },
  { name: '이상륜', tone: requiredAvatarTones[2] },
  { name: '허지은', tone: requiredAvatarTones[3] },
  { name: '신창철', tone: optionalAvatarTones[0] },
  { name: '김주연', tone: optionalAvatarTones[1] },
];

const DEFAULT_CANDIDATES = [
  { id: 'c1', date: '7/13(월)', time: '오전 10:00' },
  { id: 'c2', date: '7/14(화)', time: '오후 12:00' },
  { id: 'c3', date: '7/15(수)', time: '오후 5:00' },
];

const RESPONSE_OPTIONS = [
  { value: 'available', label: '가능해요' },
  { value: 'reluctant', label: '가능하지만 피하고 싶어요' },
  { value: 'unavailable', label: '참석 어려워요' },
];

// 아바타에는 성을 뺀 이름 2글자만 표시한다 (예: '임정희' → '정희')
const shortName = (fullName) => fullName.slice(-2);

// Figma "일정별 확인 버튼" 실측값 — 선택 시 blue/50 배경 + blue/500 보더·텍스트, 미선택 시 grey/100 배경
const responseOptionSx = (isSelected) => ({
  flex: '1 1 0%',
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: '8px',
  py: '9px',
  borderRadius: '12px',
  border: '1.5px solid',
  borderColor: isSelected ? 'primary.main' : 'transparent',
  bgcolor: isSelected ? primitives.blue[50] : 'grey.100',
  color: isSelected ? 'primary.main' : 'grey.700',
  fontSize: 15,
  fontWeight: 600,
  fontFamily: 'inherit',
  letterSpacing: '0.144px',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': { borderColor: isSelected ? 'primary.main' : 'grey.300' },
});

// Figma "Content Badge" 스펙 — 8% 투명도 틴트 배경 + 동일 색 SemiBold 텍스트
const badgeSx = (isRequired) => {
  const tone = isRequired ? primitives.blue[500] : primitives.grey[700];
  return {
    display: 'inline-flex',
    alignItems: 'center',
    height: '20px',
    px: '6px',
    borderRadius: '6px',
    fontSize: 12,
    fontWeight: 600,
    color: tone,
    bgcolor: alpha(tone, 0.08),
    flexShrink: 0,
  };
};

// Figma "Text Field / Textarea" 실측값 — radius 12px, input dropshadow, 15px Regular 값/플레이스홀더
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
  '& .MuiOutlinedInput-input::placeholder': {
    color: 'grey.400',
    opacity: 1,
  },
};

// 좌측 카드의 라벨-값 한 줄 (라벨 70px 고정 + 값 영역)
function InfoRow({ label, children }) {
  return (
    <Stack direction="row" spacing="8px" alignItems="flex-start" sx={{ width: '100%' }}>
      <Typography sx={{ width: '70px', flexShrink: 0, fontSize: 13, fontWeight: 600, color: 'grey.500', letterSpacing: '0.25px', pt: '1px' }}>
        {label}
      </Typography>
      <Box sx={{ flex: '1 1 0%', minWidth: 0 }}>{children}</Box>
    </Stack>
  );
}

const infoValueSx = { fontSize: 14, fontWeight: 400, lineHeight: 1.43, letterSpacing: '0.2px', color: 'text.primary' };

export function AttendeeReviewView({
  meeting = DEFAULT_MEETING,
  me = DEFAULT_ME,
  candidates = DEFAULT_CANDIDATES,
  onSubmit,
  sx,
}) {
  const [responses, setResponses] = useState({});
  const [notes, setNotes] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = candidates.every((candidate) => responses[candidate.id]);

  const handleSelect = (candidateId, value) => {
    setResponses((prev) => ({ ...prev, [candidateId]: value }));
  };

  const handleNoteChange = (candidateId, value) => {
    setNotes((prev) => ({ ...prev, [candidateId]: value }));
  };

  const handleSubmit = () => {
    onSubmit?.({ responses, notes });
    setSubmitted(true);
  };

  const pageTitle = (
    <>
      <Box component="span" sx={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'grey.500', letterSpacing: '0.12px', mb: '4px' }}>
        {meeting.host}님이 미팅을 요청했어요
      </Box>
      {meeting.title}
    </>
  );

  if (submitted) {
    return (
      <CardPageLayout sx={{ ...sx, alignItems: 'center' }}>
        <Stack alignItems="center" spacing="20px" sx={{ maxWidth: 420, mx: 'auto', textAlign: 'center' }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.main', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography variant="h4">응답을 보냈어요</Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6 }}>
            {meeting.title} 검토 요청에 응답했어요. 주최자가 전체 응답 현황을 확인한 뒤 최종 일정을 확정하면 다시 알려드릴게요.
          </Typography>
        </Stack>
      </CardPageLayout>
    );
  }

  const leftCard = (
    <CardContainer variant="elevation" padding="card" radius="card" sx={{ width: { xs: '100%', md: '340px' }, minWidth: 0 }}>
      <Typography variant="h5" sx={{ mb: '16px' }}>미팅 정보</Typography>
      <Stack spacing="20px">
        <InfoRow label="미팅 목적">
          <Typography sx={infoValueSx}>{meeting.purpose}</Typography>
        </InfoRow>

        <InfoRow label="나의 역할">
          <Stack spacing="10px" alignItems="flex-start">
            <Box component="span" sx={badgeSx(me.level === 'required')}>
              {me.level === 'required' ? '필수참여' : '선택참여'}
            </Box>
            <Typography sx={infoValueSx}>{me.reason}</Typography>
          </Stack>
        </InfoRow>

        <InfoRow label="참석 인원">
          <Stack direction="row" alignItems="center">
            {ATTENDEES.map((person, index) => (
              <Avatar
                key={person.name}
                sx={{
                  width: 32,
                  height: 32,
                  ml: index === 0 ? 0 : '-2px',
                  fontSize: 12,
                  fontWeight: 600,
                  border: '1.5px solid',
                  borderColor: 'background.paper',
                  bgcolor: person.tone,
                }}
              >
                {shortName(person.name)}
              </Avatar>
            ))}
          </Stack>
        </InfoRow>
      </Stack>
    </CardContainer>
  );

  // 우측 상단 안내 블록 (Figma "Section Message") — 옅은 블루 틴트 배경 + 좌상단 하이라이트 + 소프트 블루 보더
  const guideMessage = (
    <Box
      key="guide"
      sx={{
        width: '100%',
        p: '20px',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: alpha('#00B7FF', 0.4),
        background:
          'radial-gradient(130% 150% at 38% 0%, rgba(69,137,247,0.12) 0%, rgba(69,137,247,0) 55%), rgba(232,243,255,0.7)',
      }}
    >
      <Stack spacing="12px">
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: primitives.blue[600], lineHeight: 1.5 }}>
          일정을 확인해 주세요
        </Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 400, lineHeight: 1.47, letterSpacing: '0.144px' }}>
          캘린더 기준으로 모두 참석 가능한 후보를 골랐어요.
          <br />각 시간의 참석 가능 여부를 선택해 주세요.
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'grey.500', lineHeight: 1.43, letterSpacing: '0.2px' }}>
          {meeting.deadline}까지 응답해 주세요.
        </Typography>
      </Stack>
    </Box>
  );

  const slotCards = candidates.map((candidate) => (
    <CardContainer key={candidate.id} variant="outlined" padding="card" sx={{ borderRadius: '18px' }}>
      <Stack spacing="12px">
        <Typography sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4, letterSpacing: '-0.24px' }}>
          {candidate.date} {candidate.time}
        </Typography>
        <Stack spacing="9px">
          <Stack direction="row" spacing="6px">
            {RESPONSE_OPTIONS.map((option) => (
              <Box
                key={option.value}
                component="button"
                type="button"
                onClick={() => handleSelect(candidate.id, option.value)}
                sx={responseOptionSx(responses[candidate.id] === option.value)}
              >
                {option.label}
              </Box>
            ))}
          </Stack>
          <TextField
            fullWidth
            value={notes[candidate.id] ?? ''}
            onChange={(event) => handleNoteChange(candidate.id, event.target.value)}
            placeholder="이유나 조건 작성하기 (선택)"
            sx={fieldSx}
          />
        </Stack>
      </Stack>
    </CardContainer>
  ));

  const submitRow = (
    <Stack key="submit" direction="row" justifyContent="flex-end" alignItems="center" sx={{ py: '8px' }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        응답 보내기
      </Button>
    </Stack>
  );

  return (
    <CardPageLayout
      title={pageTitle}
      sx={sx}
      left={leftCard}
      right={[guideMessage, ...slotCards, submitRow]}
    />
  );
}
