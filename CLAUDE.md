# Project Rules

## Product Context

- 프로덕트(밋핏) 배경/정책/UX 기준 → `docs/product/PROJECT_CONTEXT.md`부터 읽는다 (나머지 확정본 파일 위치를 안내함)
- 참고용 풀플로우 프로토타입(원본 구현) → `src/externalComponents/참고 프로토타입/`

## Workflow

- 기획 문서 작성 → `/project-planning` Skill이 워크플로우 담당
- 컴포넌트 작업 → `/component-work` Skill이 워크플로우 담당
- 리팩토링 → `refactoring-guide.md` 참조, 기존 스토리 통과 확인
- 룰 수정 시 → `pnpm generate-rules` 실행하여 Storybook 시각화 동기화