# 🔥 게시 후 미리보기와 다르게 나오는 문제 해결 가이드

**작성일**: 2024년 2월 15일  
**목적**: 배포 환경과 미리보기 환경의 차이로 인한 문제 진단 및 해결

---

## 🚨 증상 확인

다음 중 하나라도 해당되면 이 가이드를 따라주세요:

- ✅ 로컬/미리보기에서는 정상인데 게시 후에는 데이터가 안 보임
- ✅ 스타일(CSS)이 깨져서 레이아웃이 망가짐
- ✅ 버튼을 클릭해도 아무 반응이 없음
- ✅ "API 응답 오류: 404 Not Found" 메시지가 나타남
- ✅ 빈 페이지만 보이거나 로딩이 무한히 계속됨

---

## ⚡ 빠른 해결 (3단계)

### 1단계: 자동 진단 도구 실행

**파일**: `deployment-troubleshoot.html`

```
1. 배포된 사이트에서 deployment-troubleshoot.html 페이지를 엽니다
2. "진단 시작" 버튼을 클릭합니다
3. 자동으로 5가지 항목을 검사합니다:
   - CSS 파일 로드 상태
   - JavaScript 파일 로드 상태
   - RESTful Table API 연결
   - 브라우저 로컬 스토리지
   - Font Awesome CDN
```

**접근 방법**:
- 배포된 URL + `/deployment-troubleshoot.html`
- 예: `https://your-site.genspark.app/deployment-troubleshoot.html`

---

### 2단계: 개발자 도구로 수동 확인

배포된 사이트에서:

1. **F12** 키를 눌러 개발자 도구 열기
2. **Console 탭** 확인:
   - 빨간색 에러 메시지가 있는지 확인
   - 주요 에러 유형:
     ```
     ❌ 404 Not Found - tables/users
     ❌ Failed to fetch
     ❌ CORS error
     ❌ Cannot read property 'data' of undefined
     ❌ Uncaught TypeError
     ```

3. **Network 탭** 확인:
   - 페이지 새로고침 (F5)
   - 빨간색으로 표시된 실패한 요청 확인
   - 확인해야 할 파일:
     - `css/style.css` (스타일시트)
     - `js/common.js` (JavaScript)
     - `tables/users` (API 엔드포인트)
     - `tables/prescriptions` (API 엔드포인트)

---

### 3단계: 문제별 해결 방법 적용

진단 결과에 따라 아래 섹션을 참조하세요.

---

## 🔴 문제 유형별 해결 방법

### A. API 404 오류 (가장 흔한 문제)

**증상**:
```
❌ API 응답 오류: 404 Not Found
❌ Failed to load resource: the server responded with a status of 404
```

**원인**:
- Genspark 외부 플랫폼(Vercel, Netlify, GitHub Pages 등)에 배포
- RESTful Table API가 해당 환경에서 지원되지 않음

**해결 방법**:

#### ✅ 방법 1: Genspark에서 다시 배포 (권장)
```
1. Genspark 플랫폼으로 돌아가기
2. "Publish" 탭으로 이동
3. "Publish" 또는 "Deploy" 버튼 클릭
4. 배포 완료 후 제공되는 URL 사용
```

#### ⚠️ 방법 2: 로컬 모드 활성화 (임시 테스트용)
```
1. fix-404.html 페이지로 이동
2. "로컬 모드 활성화" 버튼 클릭
3. LocalStorage 기반으로 작동 (기능 제한적)
```

**중요**: 이 프로젝트는 **Genspark의 RESTful Table API**를 사용하도록 설계되었습니다. 완전한 기능을 위해서는 반드시 **Genspark에서 배포**해야 합니다!

---

### B. CSS 스타일 깨짐

**증상**:
- 버튼, 카드, 레이아웃이 이상하게 보임
- 색상이 적용되지 않음
- 텍스트가 겹쳐 보임

**원인**:
- `css/style.css` 파일 경로 오류
- CSS 파일 로드 실패

**진단**:
```
개발자 도구 → Network 탭
css/style.css 요청 확인
Status: 404 (Not Found) → 파일 경로 문제
```

**해결 방법**:
1. 모든 HTML 파일에서 CSS 경로가 `href="css/style.css"`인지 확인
2. 상대 경로가 올바른지 확인
3. 브라우저 캐시 삭제 (Ctrl + Shift + Delete)
4. 페이지 강제 새로고침 (Ctrl + Shift + R)

---

### C. JavaScript 기능 작동 안 함

**증상**:
- 버튼 클릭 시 아무 반응 없음
- 데이터가 로드되지 않음
- 모달/팝업이 열리지 않음

**원인**:
- `js/common.js` 파일 로드 실패
- JavaScript 실행 오류

**진단**:
```
개발자 도구 → Console 탭
빨간색 에러 메시지 확인:
- Uncaught ReferenceError
- Uncaught TypeError
- Syntax error
```

**해결 방법**:
1. Network 탭에서 `js/common.js` 로드 확인
2. Console 탭의 에러 메시지 확인
3. 브라우저 캐시 삭제 후 재시도
4. 다른 브라우저에서 테스트 (Chrome, Firefox, Safari)

---

### D. 데이터가 비어있음 (API는 작동하지만 목록이 빔)

**증상**:
- API 요청은 성공하지만 (200 OK)
- 처방전, 병원, 약국 목록이 비어있음
- "데이터가 없습니다" 메시지 표시

**원인**:
- 배포 환경에 샘플 데이터가 없음
- 데이터베이스가 비어있음

**해결 방법**:
```
1. test.html 페이지로 이동
2. "샘플 데이터 추가" 버튼 클릭
3. 성공 메시지 확인
4. 포털 페이지로 돌아가서 F5 (새로고침)
```

---

### E. 브라우저 캐시 문제

**증상**:
- 수정한 내용이 반영되지 않음
- 예전 버전이 계속 보임
- 새로 배포했는데도 변화 없음

**해결 방법**:

#### 방법 1: 강제 새로고침
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

#### 방법 2: 캐시 완전 삭제
```
1. Ctrl + Shift + Delete (캐시 삭제 창 열기)
2. "캐시된 이미지 및 파일" 체크
3. "시간 범위: 전체 기간" 선택
4. "데이터 삭제" 클릭
5. 브라우저 재시작
```

#### 방법 3: 시크릿 모드 테스트
```
Windows/Linux: Ctrl + Shift + N
Mac: Cmd + Shift + N
```

---

## 📊 진단 체크리스트

배포된 사이트에서 다음 항목들을 체크하세요:

### 파일 로드 확인
- [ ] `css/style.css` 로드됨 (200 OK)
- [ ] `js/common.js` 로드됨 (200 OK)
- [ ] Font Awesome CDN 로드됨 (200 OK)

### API 연결 확인
- [ ] `tables/users` 요청 성공 (200 OK)
- [ ] `tables/prescriptions` 요청 성공 (200 OK)
- [ ] `tables/hospitals` 요청 성공 (200 OK)
- [ ] `tables/pharmacies` 요청 성공 (200 OK)
- [ ] `tables/deliveries` 요청 성공 (200 OK)

### 기능 작동 확인
- [ ] 로그인 버튼 작동
- [ ] 데이터 목록 표시
- [ ] 검색 기능 작동
- [ ] 페이지네이션 작동
- [ ] 모달 팝업 열림

### 스타일 확인
- [ ] 헤더 스타일 정상
- [ ] 버튼 색상 정상
- [ ] 카드 레이아웃 정상
- [ ] 반응형 디자인 작동 (모바일)

---

## 🛠️ 유용한 도구 모음

### 진단 도구
| 파일 | 목적 | 사용 시점 |
|------|------|-----------|
| `deployment-troubleshoot.html` | 🔥 배포 문제 자동 진단 | 게시 후 미리보기와 다를 때 |
| `diagnose.html` | 데이터 로드 문제 진단 | 목록이 비어있을 때 |
| `fix-404.html` | API 404 오류 해결 | API 연결 실패 시 |

### 수정 도구
| 파일 | 목적 | 사용 시점 |
|------|------|-----------|
| `auto-fix.html` | 배송 상태 자동 수정 | 상태 불일치 문제 |
| `sync.html` | 배송 정보 동기화 | 처방전-배송 상태 불일치 |
| `fix-delivery.html` | 단일 배송 수정 | 특정 배송만 수정 필요 |

### 데이터 도구
| 파일 | 목적 | 사용 시점 |
|------|------|-----------|
| `test.html` | 샘플 데이터 추가 | 데이터가 없을 때 |
| `add-data.html` | 개별 데이터 추가 | 병원/약국/환자 등록 |
| `bulk-upload.html` | CSV 일괄 등록 | 대량 데이터 등록 |
| `verify.html` | 완료 건수 검증 | 약국 완료 검증 필요 |

---

## 🎯 단계별 해결 프로세스

### 단계 1: 자동 진단 실행
```
deployment-troubleshoot.html 열기
↓
"진단 시작" 버튼 클릭
↓
결과 확인 (성공/경고/오류)
```

### 단계 2: 문제 파악
```
개발자 도구 (F12) 열기
↓
Console 탭: 에러 메시지 확인
↓
Network 탭: 실패한 요청 확인
```

### 단계 3: 해결 방법 적용
```
API 404 오류 → Genspark에서 재배포
↓
CSS 깨짐 → 경로 확인 & 캐시 삭제
↓
데이터 없음 → test.html에서 샘플 추가
↓
기능 안 됨 → Console 에러 확인 & 수정
```

### 단계 4: 재확인
```
브라우저 캐시 삭제 (Ctrl + Shift + Delete)
↓
강제 새로고침 (Ctrl + Shift + R)
↓
진단 도구 재실행
↓
정상 작동 확인 ✅
```

---

## 💡 예방 팁

### 배포 전
1. ✅ 로컬/미리보기에서 충분히 테스트
2. ✅ 모든 기능이 정상 작동하는지 확인
3. ✅ 파일 경로가 상대 경로인지 확인
4. ✅ RESTful Table API 연결 확인

### 배포 시
1. ✅ **반드시 Genspark Publish 탭 사용**
2. ✅ 외부 호스팅 서비스 사용 금지 (Vercel, Netlify 등)
3. ✅ 배포 완료 후 제공된 URL 확인
4. ✅ 배포 로그에서 에러 확인

### 배포 후
1. ✅ deployment-troubleshoot.html로 자동 진단
2. ✅ test.html에서 샘플 데이터 추가
3. ✅ 모든 포털 페이지 테스트
4. ✅ 다양한 브라우저에서 테스트 (Chrome, Firefox, Safari)

---

## 🆘 긴급 지원

위 방법으로도 해결되지 않으면:

### 1. 정보 수집
- [ ] 스크린샷 찍기 (Console 탭의 에러 메시지)
- [ ] 스크린샷 찍기 (Network 탭의 실패한 요청)
- [ ] 배포된 사이트의 URL 복사
- [ ] 브라우저 종류 및 버전 확인

### 2. 진단 보고서 생성
```
deployment-troubleshoot.html에서
"진단 시작" 클릭 후
결과 화면 전체 스크린샷
```

### 3. 문제 설명 작성
```
- 증상: 무엇이 어떻게 잘못되었나요?
- 재현 방법: 어떤 단계를 거쳤나요?
- 예상 동작: 어떻게 작동해야 하나요?
- 실제 동작: 실제로는 어떻게 작동하나요?
```

---

## 📚 관련 문서

- **README.md**: 프로젝트 전체 문서
- **deploy-guide.html**: 배포 가이드 상세
- **DATA-GUIDE.md**: 데이터 추가 가이드
- **start.html**: 모든 도구 링크 모음

---

## ✅ 해결 확인

모든 문제가 해결되었는지 확인하세요:

- [ ] 페이지가 정상적으로 로드됨
- [ ] CSS 스타일이 올바르게 적용됨
- [ ] 버튼과 기능이 정상 작동함
- [ ] 데이터가 올바르게 표시됨
- [ ] API 요청이 모두 성공 (200 OK)
- [ ] 개발자 도구에 에러 없음

**모두 체크되었다면**: 🎉 배포 성공! 정상 작동합니다.

---

**작성자**: Genspark AI  
**업데이트**: 2024년 2월 15일  
**프로젝트**: 조치원 스마트 약배송 서비스
