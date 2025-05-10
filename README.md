# ts-nodejs-starter

## 테스트 및 prettier, ESLint 자동화

## InfraStructure

- CloudFront, S3, Route53
- ECR, ECS, EC2, CodeDeploy, ACM, Route53, ALB
- EventBridge, Lambda, SES

## CI/CD

- pritter, eslint, husky
- 테스트 자동화
  코드 품질 향상을 위해서 어쩌고 저쩌고
- SonarCloud를 통한 정적 분석 [sonarcloud](https://jojoldu.tistory.com/662)
    - 코드 정적 분석을 통해서 Severity level(심각도 수준) Medium 3, Low 16을 0로 개선
    - Code Smell 19개 0개로 개선
- github actions를 통한 Jest coverage report [jest report](https://github.com/marketplace/actions/jest-coverage-report)

## 모니터링, 로깅

- Grafana + Prometheus + Loki
- Promtail + CloudWatch -> Loki
- winston + Console transport stdout 출력 → CloudWatch/Loki 연동
