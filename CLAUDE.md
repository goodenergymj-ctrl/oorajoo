# 우라주 챌린지 (oorajoo) — 프로젝트 에이전트 구조

## 프로젝트 스택
- **프론트엔드**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **백엔드/DB**: Supabase (Auth, RLS, Edge Functions)
- **배포**: Vercel
- **AI 기능**: Anthropic Claude API

## 총괄 에이전트 원칙
작업 요청이 들어오면 반드시 아래 순서로 처리한다:
1. 어떤 영역의 작업인지 분류 (기능/DB/UI/AI/배포)
2. 영향 받는 파일 범위를 먼저 파악하고 보고
3. 작업 전 현재 상태를 확인 (기존 코드 읽기)
4. 변경 사항은 단계별로 명확하게 설명
5. 완료 후 반드시 테스트 포인트 제시

## 코딩 원칙
- 파일 수정 시 **전체 파일 교체** 방식 선호 (incremental patch 지양)
- TypeScript strict mode 준수
- Supabase RLS 변경 시 반드시 기존 policy 확인 후 작업
- 환경변수는 절대 하드코딩 금지 (.env.local 참조)
- 컴포넌트는 `app/` 하위 App Router 구조 유지

## 에이전트 호출 가이드
| 작업 유형 | 호출 커맨드 |
|-----------|------------|
| 새 기능 설계 + 개발 | `/project:feature` |
| DB 스키마 / RLS / 쿼리 | `/project:supabase` |
| UI 버그 수정 / 스타일 | `/project:ui` |
| AI 기능 (질문생성 등) | `/project:ai` |
| 배포 / 환경설정 문제 | `/project:deploy` |

## 디렉토리 구조 참고
```
app/
  (auth)/          # 로그인/회원가입
  (main)/          # 메인 피드, 라운지
  admin/           # 어드민 패널
  api/             # API routes
components/
  ui/              # 공통 UI 컴포넌트
  challenge/       # 챌린지 관련 컴포넌트
lib/
  supabase/        # Supabase 클라이언트, 타입
  utils/           # 유틸 함수
```
