import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';
import { CardContainer } from '../card/CardContainer';
import { SelectTrigger } from '../input/SelectTrigger';
import { AttendeeRow } from '../input/AttendeeRow';
import { DateRangePicker } from '../input/DateRangePicker';
import { AttendeePicker } from '../input/AttendeePicker';
import { StatusDot } from '../../common/ui/StatusDot';

function formatRangeLabel(range) {
  if (!range?.start) return undefined;
  const start = `${range.start.getMonth() + 1}/${range.start.getDate()}`;
  if (!range.end || range.end.getTime() === range.start.getTime()) return start;
  const end = `${range.end.getMonth() + 1}/${range.end.getDate()}`;
  return `${start} ~ ${end}`;
}

/**
 * MeetingScheduleForm 템플릿
 *
 * 밋핏의 미팅 스케줄 요청 폼. 좌측 입력 폼(hybrid: 유동 너비)과
 * 우측 sticky 요약 패널(고정 300px)로 구성된 2단 레이아웃.
 * 좁은 화면에서는 요약 패널이 폼 아래로 재배치(Reorder)된다.
 *
 * 동작 방식:
 * 1. 텍스트 필드(제목/목적)는 controlled value + onChange로 관리
 * 2. 일정범위/응답마감은 SelectTrigger 클릭 시 DateRangePicker 팝업이 뜨고, 완료를 누르면
 *    각 onXxxChange 콜백으로 {start, end} Date 값이 올라온다
 * 3. 참석자 추가는 SelectTrigger 클릭 시 AttendeePicker 팝업이 뜨고, 완료를 누르면
 *    선택된 id 배열이 onAttendeeAdd로 올라온다 (directory와 attendees를 매칭해 실제 목록에
 *    반영하는 건 호출부 책임)
 * 4. 소요시간/방식/리마인드는 아직 SelectTrigger 클릭 시 onXxxClick 콜백만 실행 (Phase 3)
 * 5. 참석자 목록의 필수·권장·선택 인원수는 attendees에서 자동 집계
 * 6. 필수 필드(제목/목적/일정범위) 미입력 시 자동으로 CTA 비활성화
 *
 * Props:
 * @param {string} title - 미팅 제목 [Optional, 기본값: '']
 * @param {function} onTitleChange - 제목 변경 핸들러 (value) => void [Required]
 * @param {string} purpose - 미팅 목적 [Optional, 기본값: '']
 * @param {function} onPurposeChange - 목적 변경 핸들러 (value) => void [Required]
 * @param {{start: Date, end: Date}} dateRange - 일정 범위 [Optional]
 * @param {function} onDateRangeChange - 일정 범위 확정 핸들러 ({start, end}) => void [Optional]
 * @param {string} duration - 소요 시간 표시 텍스트 [Optional, 기본값: '1시간']
 * @param {function} onDurationClick - 소요 시간 트리거 클릭 핸들러 [Optional]
 * @param {string} meetingMethod - 미팅 방식 표시 텍스트 [Optional]
 * @param {function} onMeetingMethodClick - 미팅 방식 트리거 클릭 핸들러 [Optional]
 * @param {{start: Date, end: Date}} deadlineRange - 응답 마감 (start만 사용) [Optional]
 * @param {function} onDeadlineChange - 응답 마감 확정 핸들러 ({start, end}) => void [Optional]
 * @param {string} reminder - 응답 리마인드 표시 텍스트 [Optional, 기본값: '사용 안 함']
 * @param {function} onReminderClick - 응답 리마인드 트리거 클릭 핸들러 [Optional]
 * @param {function} onAttachClick - 첨부 자료 버튼 클릭 핸들러 [Optional]
 * @param {Array<{id: string, name: string, role: string, isHost: boolean, roleLevel: string}>} attendees - 참석자 목록 [Optional, 기본값: []]
 * @param {function} onAttendeeRemove - 참석자 삭제 핸들러 (id) => void [Optional]
 * @param {Array<{id: string, name: string, role: string, avatarSrc: string}>} directory - 참석자 추가 후보 목록 [Optional, 기본값: []]
 * @param {function} onAttendeeAdd - 참석자 추가 완료 핸들러 (selectedIds) => void [Optional]
 * @param {function} onSubmit - "가능한 시간 찾기" CTA 클릭 핸들러 [Required]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <MeetingScheduleForm
 *   title={title}
 *   onTitleChange={setTitle}
 *   purpose={purpose}
 *   onPurposeChange={setPurpose}
 *   dateRange={dateRange}
 *   onDateRangeChange={setDateRange}
 *   directory={colleagues}
 *   attendees={attendees}
 *   onAttendeeAdd={handleAttendeeAdd}
 *   onSubmit={handleFindTimes}
 * />
 */
export function MeetingScheduleForm({
  title = '',
  onTitleChange,
  purpose = '',
  onPurposeChange,
  dateRange,
  onDateRangeChange,
  duration = '1시간',
  onDurationClick,
  meetingMethod,
  onMeetingMethodClick,
  deadlineRange,
  onDeadlineChange,
  reminder = '사용 안 함',
  onReminderClick,
  onAttachClick,
  attendees = [],
  onAttendeeRemove,
  directory = [],
  onAttendeeAdd,
  onSubmit,
  sx,
}) {
  const [openPopup, setOpenPopup] = useState(null); // 'dateRange' | 'deadline' | 'attendee' | null
  const [anchorEl, setAnchorEl] = useState(null);

  const openPopupAt = (name, event) => {
    setAnchorEl(event.currentTarget);
    setOpenPopup(name);
  };
  const closePopup = () => setOpenPopup(null);

  const requiredCount = attendees.filter((a) => a.roleLevel === 'required').length;
  const recommendedCount = attendees.filter((a) => a.roleLevel === 'recommended').length;
  const optionalCount = attendees.filter((a) => a.roleLevel === 'optional').length;

  const dateRangeLabel = formatRangeLabel(dateRange);
  const deadlineLabel = deadlineRange?.start
    ? `${deadlineRange.start.getMonth() + 1}/${deadlineRange.start.getDate()} 마감`
    : '미설정';

  const isSubmitDisabled = !title || !purpose || !dateRangeLabel;

  const summaryRows = [
    { label: '소요 시간', value: duration },
    { label: '일정 범위', value: dateRangeLabel || '미선택' },
    { label: '응답 마감', value: deadlineLabel },
    { label: '리마인드', value: reminder },
    { label: '참석 인원', value: `필수 ${requiredCount} · 권장 ${recommendedCount} · 선택 ${optionalCount}` },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        gap: '24px',
        ...sx,
      }}
    >
      {/* 메인 폼 (유동 너비) */}
      <CardContainer
        padding="md"
        sx={{ borderRadius: '20px', flex: '1 1 0%', minWidth: 0, width: '100%' }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700, mb: '18px' }}>
          미팅 정보
        </Typography>

        <Stack spacing="16px">
          <TextField
            label="미팅 제목"
            required
            fullWidth
            value={title}
            onChange={(e) => onTitleChange?.(e.target.value)}
            placeholder="예) 3분기 신규 기능 킥오프"
          />

          <TextField
            label="미팅 목적"
            required
            fullWidth
            multiline
            minRows={2}
            value={purpose}
            onChange={(e) => onPurposeChange?.(e.target.value)}
            placeholder="이 미팅에서 무엇을 결정·논의하나요?"
          />

          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 0%', minWidth: '150px' }}>
              <SelectTrigger
                label="미팅 일정 범위"
                value={dateRangeLabel}
                placeholder="기간을 선택하세요"
                isRequired
                onClick={(e) => openPopupAt('dateRange', e)}
              />
            </Box>
            <Box sx={{ flex: '1 1 0%', minWidth: '150px' }}>
              <SelectTrigger
                label="소요 시간"
                value={duration}
                isRequired
                onClick={onDurationClick}
              />
            </Box>
            <Box sx={{ flex: '1 1 0%', minWidth: '150px' }}>
              <SelectTrigger
                label="미팅 방식"
                value={meetingMethod}
                placeholder="방식을 선택하세요"
                isRequired
                onClick={onMeetingMethodClick}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 0%', minWidth: '150px' }}>
              <SelectTrigger
                label="응답 마감"
                value={deadlineRange?.start ? deadlineLabel : undefined}
                placeholder={deadlineLabel}
                onClick={(e) => openPopupAt('deadline', e)}
              />
            </Box>
            <Box sx={{ flex: '1 1 0%', minWidth: '150px' }}>
              <SelectTrigger label="응답 리마인드" value={reminder} onClick={onReminderClick} />
            </Box>
          </Stack>

          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', mb: '7px' }}>
              첨부 자료
            </Typography>
            <IconButton
              onClick={onAttachClick}
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}
              aria-label="첨부 자료 추가"
            >
              <AttachFileIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* 참석자 */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: '14px' }}>
              <Typography sx={{ fontSize: 18, fontWeight: 700 }}>참석자</Typography>
              <Stack direction="row" spacing="12px">
                <StatusDot label="필수" count={requiredCount} color="error.main" />
                <StatusDot label="권장" count={recommendedCount} color="text.primary" />
                <StatusDot label="선택" count={optionalCount} color="secondary.main" />
              </Stack>
            </Stack>

            <Stack spacing="10px">
              {attendees.map((attendee) => (
                <AttendeeRow
                  key={attendee.id}
                  name={attendee.name}
                  role={attendee.role}
                  isHost={attendee.isHost}
                  roleLevel={attendee.roleLevel}
                  onRemove={attendee.isHost ? undefined : () => onAttendeeRemove?.(attendee.id)}
                />
              ))}
            </Stack>

            <Button
              startIcon={<AddIcon />}
              onClick={(e) => openPopupAt('attendee', e)}
              sx={{ mt: '10px', color: 'text.secondary' }}
            >
              참석자 추가
            </Button>
          </Box>
        </Stack>
      </CardContainer>

      {/* 요약 사이드 패널 (고정 300px, sticky) */}
      <CardContainer
        padding="md"
        sx={{
          borderRadius: '20px',
          flex: { xs: '1 1 0%', md: '0 0 300px' },
          width: { xs: '100%', md: '300px' },
          minWidth: 0,
          position: { xs: 'static', md: 'sticky' },
          top: { md: '24px' },
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700, mb: '18px' }}>요약</Typography>

        <Stack spacing="12px" sx={{ fontSize: 13 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: title ? 'text.primary' : 'text.disabled' }}>
            {title || '제목 미입력'}
          </Typography>
          <Typography sx={{ fontSize: 13, color: purpose ? 'text.secondary' : 'text.disabled' }}>
            {purpose || '미팅 목적 미입력'}
          </Typography>

          {summaryRows.map((row) => (
            <Stack key={row.label} direction="row" justifyContent="space-between" sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', flexShrink: 0 }}>
                {row.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'text.primary',
                  textAlign: 'right',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  minWidth: 0,
                }}
              >
                {row.value}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          disabled={isSubmitDisabled}
          onClick={onSubmit}
          sx={{ mt: '22px', py: '15px', fontSize: 15 }}
        >
          가능한 시간 찾기 →
        </Button>
      </CardContainer>

      <DateRangePicker
        open={openPopup === 'dateRange'}
        anchorEl={anchorEl}
        onClose={closePopup}
        value={dateRange}
        onConfirm={onDateRangeChange}
      />
      <DateRangePicker
        open={openPopup === 'deadline'}
        anchorEl={anchorEl}
        onClose={closePopup}
        value={deadlineRange}
        onConfirm={onDeadlineChange}
      />
      <AttendeePicker
        open={openPopup === 'attendee'}
        anchorEl={anchorEl}
        onClose={closePopup}
        directory={directory}
        selectedIds={attendees.filter((a) => !a.isHost).map((a) => a.id)}
        onConfirm={onAttendeeAdd}
      />
    </Box>
  );
}
