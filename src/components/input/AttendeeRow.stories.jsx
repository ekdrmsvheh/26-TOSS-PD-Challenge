import Box from '@mui/material/Box';
import { AttendeeRow } from './AttendeeRow';

export default {
  title: 'Component/7. Input & Control/AttendeeRow',
  component: AttendeeRow,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text', description: '참석자 이름' },
    role: { control: 'text', description: '직함/역할 텍스트' },
    avatarSrc: { control: 'text', description: '아바타 이미지 URL' },
    avatarColor: { control: 'color', description: '아바타 배경색(theme 팔레트 경로 또는 hex)' },
    isHost: { control: 'boolean', description: '주최자 여부' },
    roleLevel: {
      control: 'select',
      options: ['required', 'recommended', 'optional'],
      description: '참석 레벨',
    },
    variant: {
      control: 'radio',
      options: ['bordered', 'plain'],
      description: "'bordered'(개별 보더 박스) | 'plain'(보더 없이 divider로 나열)",
    },
    onRoleLevelChange: { action: 'roleLevelChanged', description: '필수/선택 토글 변경 핸들러 (있으면 점 대신 토글 표시)' },
    onRemove: { action: 'removed', description: '삭제 버튼 핸들러' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## AttendeeRow

미팅 참석자 한 명을 표시하는 행. 아바타, 이름, 역할, 필수/권장/선택 레벨(정적 점 또는 편집 가능한 토글), 주최자 뱃지, 삭제 버튼으로 구성된다.
        `,
      },
    },
  },
};

export const Default = {
  render: (args) => (
    <Box sx={{ maxWidth: 400 }}>
      <AttendeeRow {...args} />
    </Box>
  ),
  args: {
    name: '박서준',
    role: '백엔드 엔지니어',
    roleLevel: 'required',
    onRemove: () => {},
  },
};

export const Host = {
  render: (args) => (
    <Box sx={{ maxWidth: 400 }}>
      <AttendeeRow {...args} />
    </Box>
  ),
  args: {
    name: '이지혜',
    role: '프로덕트 디자이너',
    isHost: true,
  },
};

export const List = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: 400 }}>
      <AttendeeRow name="이지혜" role="프로덕트 디자이너" isHost />
      <AttendeeRow name="박서준" role="백엔드 엔지니어" roleLevel="required" onRemove={() => {}} />
      <AttendeeRow name="김도윤" role="마케터" roleLevel="recommended" onRemove={() => {}} />
      <AttendeeRow name="최유나" role="디자이너" roleLevel="optional" onRemove={() => {}} />
    </Box>
  ),
};

export const RoleToggle = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: 400 }}>
      <AttendeeRow name="정희" role="제품팀 · 리드" roleLevel="required" onRoleLevelChange={() => {}} onRemove={() => {}} />
      <AttendeeRow name="신창철" role="개발팀 · 프론트엔드" roleLevel="optional" onRoleLevelChange={() => {}} onRemove={() => {}} />
    </Box>
  ),
};
