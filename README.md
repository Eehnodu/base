# base

## 1. 프로젝트 소개 (Introduction)

- **프로젝트 이름**: base 프로젝트
- **설명**: React + Vite 기반의 프론트엔드와 React 구조를 기반으로 한 백엔드가 포함된 기본 템플릿 프로젝트입니다.

---

## 2. 설치 (Installation)

```bash
# 예시) 저장소 클론
$ git clone https://github.com/Eehnodu/base.git
$ cd base
```

---

## 3. 실행 방법 (Usage)

```bash
# 서버 실행
cd backend
python3 -m venv venv(각자 os 환경에 맞게 설치)
source venv\bin\activate
(pip install 해야할 경우)
pip install -r requirements.txt
./migrate.sh
./insertAdmin.sh
./run.sh 

# 클라이언트 실행
npm install
npm run dev
```

---

## 4. 개발환경 & 기술 스택 (Development Env & Tech Stack)

- **필수 환경**
  - Python 3.10
  - Node.js v20.19.5
  - npm 10.8.2

- **기술 스택**


<table>
  <tr>
    <th>구분</th>
    <th>내용</th>
  </tr>

  <tr>
    <td>Frontend</td>
    <td>
      <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /> <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /> <img src="https://img.shields.io/badge/Tailwind%20css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    </td>
  </tr>

  <tr>
    <td>Backend</td>
    <td>
      <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" /> <img src="https://img.shields.io/badge/Fastapi-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    </td>
  </tr>

  <tr>
    <td>AI</td>
    <td>
      <img src="https://img.shields.io/badge/Openai-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
    </td>
  </tr>

  <tr>
    <td>Infrastructure</td>
    <td>
      <img src="https://img.shields.io/badge/Aws-FF9900?style=for-the-badge&logo=aws&logoColor=black" alt="AWS" /> <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" alt="Ubuntu" /> <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />
    </td>
  </tr>
</table>

---

## 5. 프로젝트 구조 (Project Structure)

```bash
base/
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   │   ├── version_update.py/
│   │   ├── env.py/
│   ├── alembic.ini
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config/
│   │   │   ├── database/
│   │   │   ├── exception/
│   │   │   ├── middleware/
│   │   │   ├── provider/
│   │   │   └── utils/
│   │   └── module/
│   │       ├── admin/
│   │       ├── auth/
│   │       ├── infra/
│   │       ├── user/
│   │       ├── ws/
│   │       └── __init__.py
│   ├── media/
│   ├── migrate.sh
│   ├── insertAdmin.sh
│   ├── requirements.txt
│   └── run.sh
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── assets/
│   │   ├── component/
│   │   ├── containers/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   └── tsconfig.json
```

- backend: 백엔드 서버 소스 코드
- backend/app: FastAPI 애플리케이션 코드
- backend/app/core: 공통 설정 및 인프라 로직
- backend/app/module: 도메인별 기능 모듈
- backend/media: 음성 및 이미지 등 미디어 파일
  
- frontend: 프론트엔드 애플리케이션
- frontend/src: 프론트엔드 소스 코드
- frontend/public: 정적 리소스
- README.md: 프로젝트 소개 및 사용법 문서

---

## 6. 간단한 설명 (Info)

## 🔹 Backend

### 1. 환경 변수 관리

`.env` 파일에서 환경 변수를 수정하거나 새로 추가한 경우  
`core/config/settings.py` 에 해당 값을 매핑해주셔야 합니다.

환경별(local / prod) DB 설정을 분리하여 사용하도록 구성되어 있습니다.

---

### 2. 기본 아키텍처 구조

`app/module` 내부는 **도메인 단위 구조**로 구성되어 있습니다.

예시:

```

module/
├── admin/
├── auth/
├── user/
├── infra/
└── ws/

```

각 도메인 폴더 내부는 다음과 같은 계층 구조를 따릅니다:

```

router → service → repository → db(model)

````

#### 계층 역할

- **router**
  - API 엔드포인트 정의
  - Request/Response 처리
- **service**
  - 비즈니스 로직 처리
- **repository**
  - DB 접근 로직 담당
- **db (model)**
  - SQLAlchemy 모델 정의

비즈니스 로직은 service 계층에 작성하며,  
router에서 직접 DB에 접근하지 않도록 설계되어 있습니다.

---

### 3. Router 등록 방식

`module/__init__.py`에서 각 도메인 라우터를 모아서  
`main.py`에서 일괄 등록하는 구조입니다.

```python
def register_routers(app: FastAPI):
    """모든 도메인 라우터를 FastAPI 인스턴스에 등록"""
    app.include_router(auth_router.router, prefix="/api/auth")
    app.include_router(admin_router.router, prefix="/api/admin")
    app.include_router(user_router.router, prefix="/api/user")
    app.include_router(gpt_router.router, prefix="/api/gpt")
    app.include_router(ws_router.router, prefix="/api/ws")
````

새로운 도메인을 추가한 경우:

1. 해당 도메인에 router 작성
2. `module/__init__.py`에 import 추가
3. `register_routers()`에 include_router 등록

---

### 4. DB 및 마이그레이션

* ORM: **SQLAlchemy**
* Migration: **Alembic**

#### DB 구조 변경 시

```bash
./migrate.sh
```

Django의 `makemigrations`와 유사한 동작을 수행합니다.

#### 최초 프로젝트 실행 시

```bash
./migrate.sh
./insertAdmin.sh
```

* migrate.sh → 테이블 생성
* insertAdmin.sh → 기본 관리자 계정 생성

#### 서버 실행

```bash
./run.sh
```

Django의 `runserver`와 유사한 역할을 수행합니다.

---

### 5. 새로운 모델 추가 시

#### Alembic이 모델을 인식하도록 등록

`alembic/env.py` 상단에 import 추가:

```python
from app.module.user import user as user_models
from app.module.admin import admin as admin_models
from app.module.infra import gpt as gpt_models
```

#### 관계(Relation)가 있는 경우

`module/__init__.py`에 모델 import 추가:

```python
# --- 모델 등록 (SQLAlchemy 관계 인식용) ---
from app.module.user.user import User
from app.module.infra.gpt import Logs, Messages
```

위 과정을 누락하면 관계 매핑이 정상적으로 동작하지 않을 수 있습니다.

---

### 6. Service / Repository 추가 시

새로운 service 또는 repository를 생성한 경우
`core/provider/service.py`에 의존성 주입 설정을 추가해주셔야 합니다.

---

## 🔹 Frontend

### 1. 기본 구조

```
src/
 ├── component/
 ├── containers/
 ├── hooks/
 ├── types/
 ├── utils/
```

---

### 2. 디렉토리 설명

#### 📦 component

* 재사용 가능한 UI 단위 컴포넌트
* props 기반으로 동작
* 비즈니스 로직 최소화

예:

* Button
* Modal
* Input
* Layout 컴포넌트 등

---

#### 📦 containers

* 페이지 단위 컴포넌트
* 실제 API 호출 및 상태 관리 담당
* 여러 component를 조합하여 화면 구성

> 화면 로직은 containers
> UI 단위는 component

---

#### 📦 hooks

* 커스텀 훅 모음
* 공통 로직 재사용
* 예: API 처리, 토큰 관리, 상태 로직 등

---

#### 📦 types

* TypeScript 타입 정의
* API 응답 타입
* 공통 인터페이스 정의

---

#### 📦 utils

* 공통 유틸 함수
* 포맷터, 헬퍼 함수 등

---

### 3. 실행 방법

최초 클론 후:

```bash
npm install
npm run dev
```

---

### 4. 라우팅 추가 방법

새로운 페이지를 추가한 경우:

1. containers에 페이지 컴포넌트 생성
2. `src/App.tsx`에 route 추가

예:

```tsx
<Route path="/example" element={<ExamplePage />} />
```

---

### 5. 환경 변수

Frontend는 `VITE_` prefix가 붙은 변수만 인식합니다.

예:

```
VITE_APP_PUBLIC_BASE_URL=
```

---

## 7. 환경 변수 (Environment Variables)

`.env` 파일 예시:

```
## Backend
# -- 공통
mysql_port=3306

# -- 로컬 개발 환경
local_mysql_user=
local_mysql_password=
local_mysql_host=
local_mysql_db=

# -- 운영 서버 환경
prod_mysql_user=
prod_mysql_password=
prod_mysql_host=
prod_mysql_db=

jwt_secret=
hash_key=

openai_api_key=

## Frontend
VITE_APP_PUBLIC_BASE_URL=
VITE_APP_PUBLIC_AOS_URL=
VITE_APP_PUBLIC_IOS_URL=
```

---
