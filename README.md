## Daily-sentence

- 📝 : 블로그 글
- 📂 : Github Repository

## Daily-sentence Front

- [📂 Front Repository](https://github.com/yanggwangseong/daily-sentence-fe)

## SES를 통한 이메일 전송 Lambda 함수

- [📝 AWS SES EventBridge Lambda를 이용한 이메일 전송](https://yokan.netlify.app/aws/ses-eventbridge-lambda%EB%A5%BC%20%EC%9D%B4%EC%9A%A9%ED%95%9C%20%EB%A9%94%EC%9D%BC%EB%A7%81)
- [📂 Lambda Repository](https://github.com/yanggwangseong/daily-sentence-lambda-ses)

## AWS Infra

### InfraStructure

<p align="center">
  <div align="center"><img src="https://i.postimg.cc/j59NzyGx/AWS-Architecture-drawio.png" width="80%"/></div>
</p>

---

### CI/CD

<p align="center">
  <div align="center"><img src="https://i.postimg.cc/TYCzY2Sc/aws-ci-cd-drawio.png" width="80%"/></div>
</p>

---

### EventBridge Lambda SES

<p align="center">
  <div align="center"><img src="https://i.postimg.cc/jjmpy8Q3/aws-event-bridge-lambda-ses-drawio.png" width="60%"/></div>
</p>

## Code Convention with Auto-formatting

- Git Hook기반의 Husky를 활용한 prettier, eslint, Unit Test 자동화
- prepare-commit-msg를 활용한 issue 번호 또는 티켓 번호를 커밋 메세지에 자동 삽입
- github actions를 활용한 PR생성시 Unit Test 및 E2E 테스트 자동화

```js
// prettier
module.exports = {
    printWidth: 80, // 한 줄 최대 길이
    semi: true, // 세미콜론 사용
    tabWidth: 4, // 탭 크기 (4칸)
    trailingComma: "all", // 모든 곳에 trailing comma 추가
    plugins: ["@trivago/prettier-plugin-sort-imports"], // import 정렬 플러그인
    importOrder: ["<THIRD_PARTY_MODULES>", "^@APP/(.*)$", "^[./]"], // import 순서: 외부 라이브러리 → @APP 경로 → 상대 경로
    importOrderSeparation: true, // import 그룹 사이에 빈 줄 추가
    importOrderSortSpecifiers: true, // import 내 항목들 정렬
    importOrderParserPlugins: ["decorators-legacy", "typescript"], // 파서 플러그인 (데코레이터, TypeScript)
};
```

```js
// eslint
export default [
    // TypeScript ESLint 추천 설정 확장
    ...compat.extends("plugin:@typescript-eslint/recommended"),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        // 언어 파서 및 옵션 설정
        languageOptions: {
            parser: tsParser, // TypeScript 파서 사용
            ecmaVersion: 2020, // ECMAScript 버전
            sourceType: "script", // 모듈 타입 (script/module)

            parserOptions: {
                project: ["tsconfig.json"], // TypeScript 프로젝트 설정 파일
            },
        },

        // ESLint 규칙 설정
        rules: {
            "@typescript-eslint/interface-name-prefix": "off", // 인터페이스 이름 접두사 규칙 끄기
            "@typescript-eslint/explicit-function-return-type": "off", // 함수 반환 타입 명시 강제 끄기
            "@typescript-eslint/explicit-module-boundary-types": "off", // 모듈 경계 타입 명시 강제 끄기
            "@typescript-eslint/no-empty-interface": "off", // 빈 인터페이스 허용
            "@typescript-eslint/no-explicit-any": "off", // any 타입 사용 허용
            "@typescript-eslint/no-floating-promises": "error", // 처리되지 않은 Promise를 에러로 처리
            "@typescript-eslint/no-inferrable-types": "off", // 추론 가능한 타입 명시 허용
            "@typescript-eslint/no-namespace": "off", // namespace 사용 허용
            "@typescript-eslint/no-empty-function": "off", // 빈 함수 허용
            "@typescript-eslint/only-throw-error": "error", // Error 객체만 throw 하도록 강제
            "@typescript-eslint/no-unused-vars": "warn", // 사용하지 않는 변수에 대해 경고
        },
    },
];
```

```bash
# prepare-commit-msg
# 인자값 가져오기
COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2
SHA1=$3

# 자동 머지 커밋 메시지 등은 건너뜁니다.
if [ "$COMMIT_SOURCE" == "merge" ]; then
  exit 0
fi

# 현재 브랜치 이름 가져오기
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

# 브랜치 이름이 feature/ 또는 hotfix/ 로 시작하는지 확인
if [[ "$BRANCH_NAME" =~ ^(feature|hotfix)/ ]]; then
  # 브랜치 번호 추출 (예: feature/123-some-feature)
  BRANCH_NUMBER=$(echo "$BRANCH_NAME" | grep -o -E '[0-9]+')

  # 브랜치 번호가 있는지 확인하고, 커밋 메시지에 추가
  if [ -n "$BRANCH_NUMBER" ]; then
    # 커밋 메시지 파일의 마지막에 브랜치 번호 추가
    echo "" >> "$COMMIT_MSG_FILE"
    echo "(#${BRANCH_NUMBER})" >> "$COMMIT_MSG_FILE"
  fi
fi
```

```bash
# pre-commit
npm run test
npm run eslint:fix
npm run prettier:fix
git add .

```

```yml
name: "Unit Test & E2E Test"
on:
    pull_request:
        branches:
            - develop
            - main
jobs:
    unit-test:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout Repository
              uses: actions/checkout@v3

            - name: Set up Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: 22.14.0

            - name: Install Dependencies
              run: npm install

            - name: Run Unit Tests
              run: npm run test:unit

            - name: Close PR if Tests Fail
              if: failure()
              run: |
                  PR_NUMBER=$(jq --raw-output .pull_request.number "$GITHUB_EVENT_PATH")
                  echo "❌ Unit 테스트 실패! PR #$PR_NUMBER을 닫습니다."
                  curl -X PATCH -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
                      -H "Accept: application/vnd.github.v3+json" \
                      https://api.github.com/repos/${{ github.repository }}/pulls/$PR_NUMBER \
                      -d '{"state":"closed"}'

    e2e-test:
        needs: unit-test
        runs-on: ubuntu-latest
        steps:
            - name: Checkout Repository
              uses: actions/checkout@v3

            - name: Set up Timezone to GMT+9
              run: sudo timedatectl set-timezone Asia/Seoul

            - name: Set up Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: 22.14.0

            - name: Install Dependencies
              run: npm install

            - name: Create .test.env
              run: |
                  touch .test.env
                  echo "DB_TYPE=${{ secrets.TEST_DB_TYPE }}" >> .test.env
                  echo "DB_HOST=${{ secrets.TEST_DB_HOST }}" >> .test.env
                  echo "DB_PORT=${{ secrets.TEST_DB_PORT }}" >> .test.env
                  echo "DB_USERNAME=${{ secrets.TEST_DB_USERNAME }}" >> .test.env
                  echo "DB_PASSWORD=${{ secrets.TEST_DB_PASSWORD }}" >> .test.env
                  echo "DB_DATABASE=${{ secrets.TEST_DB_DATABASE }}" >> .test.env
                  echo "DB_SYNCHRONIZE=${{ secrets.TEST_DB_SYNCHRONIZE }}" >> .test.env
                  echo "SERVER_PORT=${{ secrets.TEST_SERVER_PORT }}" >> .test.env

            - name: Run E2E Tests
              run: npm run test:db:e2e

            - name: Close PR if Tests Fail
              if: failure()
              run: |
                  PR_NUMBER=$(jq --raw-output .pull_request.number "$GITHUB_EVENT_PATH")
                  echo "❌ E2E 테스트 실패! PR #$PR_NUMBER을 닫습니다."
                  curl -X PATCH -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
                      -H "Accept: application/vnd.github.v3+json" \
                      https://api.github.com/repos/${{ github.repository }}/pulls/$PR_NUMBER \
                      -d '{"state":"closed"}'
```

## Code Qality

- github actions를 활용한 PR 생성시 code coverage 자동 comment
- github actions와 SonarCloud를 활용한 코드 정적 분석
