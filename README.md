## Daily-sentence

### 개요

영어학습을위한 매일 영어 한문장과 관련 유튜브 쇼츠 영상을 제공하고 이메일 구독을 통한 1주일간의 정보를 제공하는 뉴스레터 기능을 제공하는 프로젝트 입니다.

배포 URL : [https://www.daily-sentence.co.kr/](https://www.daily-sentence.co.kr/)

- [📂 Front Repository](https://github.com/yanggwangseong/daily-sentence-fe)
- [📂 Lambda Repository](https://github.com/yanggwangseong/daily-sentence-lambda-ses)

### 프로젝트 목표

시장 반응을 빠르게 확인하기 위해 최소 기능 제품(MVP)을 빠르게 개발·출시하고, 여러곳에 개별적인 홍보링크를 통해서 유입된 퍼널(Funnel) 등이 어떤 경로에서 유입 되었는지, 이탈율은 어떻게 되는지를 추적하고 이를 개선 해나가고 CTA(Call to Action)을 통해 구독률을 늘리기 위한 프로젝트 입니다.

### 프로젝트 결과

홍보 채널에 따른 인원들 이미지

유입된 퍼널 행동 트래킹 이미지

유입율 증가와 구독율 증가 마지막 결과

유입된 퍼널 행동 트래킹 개선 이미지

## Code Quality

- [코드 품질 및 테스트 자동화](https://github.com/yanggwangseong/daily-sentence-be/wiki/%EC%BD%94%EB%93%9C-%ED%92%88%EC%A7%88-%EB%B0%8F-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%9E%90%EB%8F%99%ED%99%94)

## AWS Infra

### InfraStructure

<p align="left">
  <div align="left"><img src="https://i.postimg.cc/j59NzyGx/AWS-Architecture-drawio.png" width="80%"/></div>
</p>

---

### CI/CD

<p align="left">
  <div align="left"><img src="https://i.postimg.cc/TYCzY2Sc/aws-ci-cd-drawio.png" width="80%"/></div>
</p>

---

### EventBridge Lambda SES

<p align="left">
  <div align="left"><img src="https://i.postimg.cc/jjmpy8Q3/aws-event-bridge-lambda-ses-drawio.png" width="60%"/></div>
</p>

## Architecture

```md
src/
├── common/ # 공통 유틸리티 및 전역 설정
│ ├── constants/ # 상수 정의
│ ├── sentry/ # Sentry 설정
│ ├── filters/ # 예외 필터 (에러 핸들링)
│ ├── logger/ # 로깅 모듈
│ ├── interceptors/ # 인터셉터 정의
│ ├── swagger/ # Swagger 문서 설정
│ ├── typeorm/ # TypeORM 설정 및 커스텀 모듈
│ └── response/ # 응답 형식 관련 유틸리티
│
├── sentences/ # 문장 관련 도메인
│ ├── use-cases/ # 핵심 비즈니스 로직
│ ├── repositories/ # 데이터 접근 로직
│ ├── entities/ # DB 엔티티 정의
│ ├── sentences.module.ts # 모듈 정의
│ ├── sentences.service.interface.ts # 서비스 인터페이스
│ └── sentences.service.ts # 서비스 구현체
│
├── subscribers/ # 구독자 관련 도메인
│ ├── use-cases/
│ ├── repositories/
│ ├── entities/
│ ├── pipes/ # 파이프 유효성 처리
│ ├── subscribers.module.ts
│ ├── subscribers.service.interface.ts
│ └── subscribers.service.ts
│
├── app.module.ts # 루트 모듈
├── application.ts # 애플리케이션 초기 설정 (bootstrap)
├── health.controller.ts # 헬스 체크 엔드포인트
└── main.ts # 앱 실행 진입점
```

## Articles

- [📝 AWS CloudFront Geo-location](https://yokan.netlify.app/aws/aws%20cloudfront%20geo-location)
- [📝 AWS SES EventBridge Lambda를 이용한 이메일 전송](https://yokan.netlify.app/aws/ses-eventbridge-lambda%EB%A5%BC%20%EC%9D%B4%EC%9A%A9%ED%95%9C%20%EB%A9%94%EC%9D%BC%EB%A7%81)

## Git Branch Strategy & Commit Convention

**Git-Flow**

<p align="left">
  <div align="left"><img src="https://techblog.woowahan.com/wp-content/uploads/img/2017-10-30/git-flow_overall_graph.png" width="80%"/></div>
</p>

**Commit Convention**
Tag | Content
-- | --
feat | 기능 추가
fix | 버그 수정
refactor | 리팩토링 (함수 분리/이름수정 등 실행 결과의 변경 없이 코드 구조를 재조정)
style | 스타일 (코드 컨벤션 수정: 비즈니스 로직에 변경 없음)
add | feat 이외의 부수적인 코드 추가, 라이브러리 추가, 새로운 파일 생성 시
docs | 문서 (README 등 문서 추가/수정/삭제)
test | 테스트 (테스트 코드 추가/수정/삭제: 비즈니스 로직에 변경 없음)
chore | 기타 사소한 변경사항 (빌드 스크립트 수정 등)
