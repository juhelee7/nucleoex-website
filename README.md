# NucleoEX Website — (주)뉴클레오엑스

성균관대학교 바이오-나노 소재 연구실(BNML) 기반 딥테크 소재 기업 **(주)뉴클레오엑스**의 공식 홈페이지입니다.
빌드 도구 없이 동작하는 정적 사이트로, GitHub Pages에서 바로 서비스됩니다.

- 라이브(예정/운영): https://juhelee7.github.io/nucleoex-website/
- 저장소: https://github.com/juhelee7/nucleoex-website

## 구성

```
index.html                 메인 페이지 (회사소개 · 핵심 기술 · 차별성 · 연혁/인증 · CEO 인사 · 문의)
404.html                   없는 주소 안내 페이지
robots.txt / sitemap.xml   검색엔진 설정
assets/css/main.css        전체 디자인 (색상·타이포·레이아웃·반응형)
assets/js/i18n.js          한국어 / 영어 문구 사전
assets/js/main.js          언어 전환 · 스크롤 애니메이션 · 모바일 메뉴 · 주소 복사
assets/fonts/              Pretendard 가변 폰트 (자체 호스팅)
assets/img/                로고, 히어로 배경, 기술 이미지, 파비콘, 공유 이미지
```

## 문구 수정 방법

1. **한국어**는 `index.html`의 각 요소에 그대로 들어 있습니다. 바로 고치면 됩니다.
2. **영어**는 `assets/js/i18n.js`의 `en:` 블록에서 같은 키(예: `"hero.title"`)의 문구를 고칩니다.
   `data-i18n="hero.title"`처럼 HTML에 표시된 키를 찾아 수정하면 됩니다.
3. 두 언어의 키 목록은 동일하게 유지해야 합니다. 키를 추가하면 `ko`, `en` 양쪽에 모두 넣어 주세요.

## 이미지 교체

| 파일 | 쓰이는 곳 | 권장 크기 |
|---|---|---|
| `assets/img/logo-white.png` | 헤더·푸터 (어두운 배경용 흰색 로고) | 가로 2000px, 투명 PNG |
| `assets/img/logo-color.png` | 문서·SNS 공유용 컬러 로고 | 가로 2000px |
| `assets/img/hero-mesh.jpg` | (현재 미사용 — 첫 화면은 단색 배경) | 1920×1074 |
| `assets/img/tech-flame-1.jpg` | 친환경 난연소재 카드 | 1200px 폭 |
| `assets/img/tech-foam.jpg` | ATP 플랫폼 이미지 | 1200px 폭 |
| `assets/img/og-image.jpg` | 카카오톡·SNS 링크 미리보기 | 1200×630 |
| `assets/img/favicon-*.png` | 브라우저 탭 아이콘 | 64 / 32 / 180px |

## CSS/JS를 고친 뒤 (캐시 주의)

`index.html`의 `main.css?v=2026112122`, `i18n.js?v=...`, `main.js?v=...` 끝의 숫자를 한 단계 올려 주세요.
GitHub Pages와 방문자 브라우저가 예전 파일을 계속 쓰는 것을 막습니다.

## 배포

`main` 브랜치에 커밋·푸시하면 GitHub Pages(브랜치: `main`, 폴더: `/`)가 자동으로 다시 배포합니다.

```bash
git add -A && git commit -m "내용 수정" && git push origin main
```

## 커스텀 도메인(www.nucleoex.com)으로 옮길 때

1. DNS 관리(도메인 등록업체)에서 아래 레코드를 추가합니다.
   - `A` `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` `www` → `juhelee7.github.io`
2. 저장소 Settings → Pages → Custom domain에 `www.nucleoex.com` 입력 후 Save, `Enforce HTTPS` 체크.
3. 도메인이 살아나면 `index.html`의 `canonical`·`og:url`·`og:image`, `sitemap.xml`, `robots.txt`의
   `https://juhelee7.github.io/nucleoex-website/` 주소를 `https://www.nucleoex.com/`으로 바꿉니다.
4. `404.html`의 `/nucleoex-website/assets/...` 경로도 `/assets/...`로 바꿉니다(저장소 하위 경로용으로 작성되어 있음).

## 공개 범위 원칙

이 사이트는 **공개용**입니다. 다음 정보는 절대 올리지 않습니다.

- 투자 실사 금액, 투자사명, 미공개 계약 조건
- 특정 고객사명 및 진행 중인 영업 건
- 사업자등록번호·계좌 등 내부 식별 정보

기술 설명은 공개 가능한 수준(소재 원리, 적용 분야, 인증 현황)으로만 유지합니다.
