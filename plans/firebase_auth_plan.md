### **Firebase 인증 연동 전략 계획**

**1. 목표 이해 (Understanding the Goal)**

본 계획의 목표는 현재 React 애플리케이션에 Firebase Authentication을 연동하여, 이메일과 비밀번호를 사용하는 사용자 인증 시스템을 구축하는 것입니다. 최종적으로 사용자는 회원가입, 로그인, 로그아웃을 할 수 있어야 하며, 로그인 상태에 따라 특정 페이지 접근이 제어되어야 합니다.

**2. 조사 및 분석 (Investigation & Analysis)**

구현에 앞서, 코드베이스의 현재 상태를 파악하고 잠재적인 영향을 분석하기 위해 다음 단계를 수행해야 합니다.

*   **Firebase 의존성 확인:**
    *   `package.json` 파일을 읽어 `firebase` 라이브러리가 이미 설치되어 있는지 확인합니다. 설치되어 있지 않다면, `pnpm add firebase`를 통해 추가해야 합니다.

*   **환경 변수 설정 확인:**
    *   Firebase 프로젝트 설정(API 키, Auth 도메인 등)과 같은 민감한 정보를 안전하게 관리하기 위한 현재의 환경 변수 설정 방식을 파악합니다.
    *   `vite.config.ts`와 `.env` 관련 파일(존재한다면)을 검토하여 Vite 프로젝트에서 환경 변수를 어떻게 로드하고 사용하는지 확인합니다. (`import.meta.env`)

*   **기존 인증 관련 UI 분석:**
    *   `src/pages/RegistrationPage.tsx`: 현재 회원가입 페이지의 구조를 분석하여 Firebase 인증 로직을 연결할 지점을 찾습니다.
    *   `src/pages/MyPage.tsx`: 사용자가 로그인했을 때만 접근해야 할 페이지로, 보호된 라우트(Protected Route)의 적용 대상이 될 것입니다.
    *   `src/components/Layout.tsx` 또는 유사한 네비게이션 컴포넌트: 로그인 상태에 따라 "로그인/회원가입" 버튼과 "로그아웃/마이페이지" 버튼을 동적으로 표시할 위치를 파악합니다.

*   **라우팅 구조 분석:**
    *   `src/App.tsx` 파일을 읽어 현재 `react-router-dom`을 사용한 라우팅 구조를 파악합니다. 로그인하지 않은 사용자가 특정 경로에 접근하는 것을 막는 '보호된 라우트' 로직을 어디에 어떻게 추가할지 결정해야 합니다.

*   **전역 상태 관리 확인:**
    *   `search_file_content` 도구를 사용하여 `createContext`의 사용 여부를 검색하고, 이미 전역 상태 관리(예: React Context)가 사용되고 있는지 확인합니다. 인증 상태(로그인 여부, 현재 사용자 정보)를 전역적으로 관리하기 위한 새로운 `AuthContext`를 도입할지, 기존 시스템에 통합할지 결정합니다.

**3. 제안 전략 계획 (Proposed Strategic Plan)**

분석 결과를 바탕으로, 다음과 같은 단계별 구현 전략을 제안합니다.

*   **1단계: Firebase 설정 및 초기화**
    1.  **Firebase 프로젝트 생성:** Firebase 콘솔에서 새 프로젝트를 생성하고, 웹 앱을 추가하여 이메일/비밀번호 인증을 활성화합니다.
    2.  **의존성 설치:** `package.json`에 `firebase`가 없다면 `pnpm add firebase` 명령어로 설치합니다.
    3.  **환경 변수 설정:** 프로젝트 루트에 `.env` 파일을 생성하고, Firebase 콘솔에서 얻은 설정 값(apiKey, authDomain 등)을 `VITE_FIREBASE_API_KEY`와 같은 형식으로 저장합니다.
    4.  **Firebase 초기화 파일 생성:** `src/lib/firebase.ts` 파일을 생성합니다. 이 파일은 `.env` 파일의 환경 변수를 읽어 Firebase 앱을 초기화하고, `getAuth`를 통해 생성된 `auth` 객체를 다른 파일에서 사용할 수 있도록 `export` 합니다.

*   **2단계: 전역 인증 컨텍스트(Auth Context) 구현**
    1.  **AuthContext 생성:** `src/contexts/AuthContext.tsx` 파일을 생성합니다. 이 컨텍스트는 현재 로그인된 사용자 정보(`currentUser`)와 인증 상태 로딩 여부(`loading`)를 관리합니다.
    2.  **인증 상태 리스너(Listener) 설정:** `AuthContext` 내에서 Firebase의 `onAuthStateChanged` 옵저버를 사용하여 사용자의 로그인/로그아웃 상태 변경을 실시간으로 감지하고 `currentUser` 상태를 업데이트합니다.
    3.  **AuthProvider 적용:** `src/main.tsx` 또는 `src/App.tsx`에서 애플리케이션 전체를 `AuthProvider`로 감싸 모든 컴포넌트가 인증 상태에 접근할 수 있도록 합니다.

*   **3단계: UI 및 기능 구현**
    1.  **회원가입 페이지 (`RegistrationPage.tsx`) 수정:**
        *   `shadcn/ui`의 `Input`, `Button`, `Label` 컴포넌트를 사용하여 이메일과 비밀번호 입력 폼을 구성합니다.
        *   폼 제출 시 `firebase.ts`에서 `export`한 `auth` 객체와 `createUserWithEmailAndPassword` 함수를 호출하여 Firebase에 사용자 생성을 요청합니다.
        *   성공 시 마이페이지로 리디렉션하고, 실패 시 `sonner`나 `toast`를 사용하여 에러 메시지를 표시합니다.
    2.  **로그인 페이지 (`LoginPage.tsx`) 생성:**
        *   회원가입 페이지와 유사한 UI를 가진 `src/pages/LoginPage.tsx` 파일을 새로 생성합니다.
        *   폼 제출 시 `signInWithEmailAndPassword` 함수를 호출합니다.
        *   성공 시 마이페이지로 리디렉션하고, 실패 시 에러 메시지를 표시합니다.
    3.  **로그아웃 기능 추가:**
        *   `Layout.tsx` 또는 네비게이션 컴포넌트에서 `AuthContext`의 `currentUser` 값을 확인합니다.
        *   사용자가 로그인 상태일 경우 '로그아웃' 버튼을 표시하고, 클릭 시 `signOut` 함수를 호출합니다.

*   **4. 단계: 보호된 라우트(Protected Routes) 설정**
    1.  **ProtectedRoute 컴포넌트 생성:** 인증이 필요한 페이지를 감싸는 `ProtectedRoute.tsx` 컴포넌트를 만듭니다.
    2.  이 컴포넌트는 `AuthContext`에서 `currentUser`와 `loading` 상태를 가져옵니다.
    3.  `loading` 중이면 로딩 스피너를 표시하고, 로딩 완료 후 `currentUser`가 없으면 `/login` 페이지로 리디렉션합니다. `currentUser`가 있으면 자식 컴포넌트(예: `MyPage`)를 렌더링합니다.
    4.  `src/App.tsx`에서 `/mypage`와 같이 보호가 필요한 라우트를 이 `ProtectedRoute` 컴포넌트로 감싸줍니다.

**4. 검증 전략 (Verification Strategy)**

구현 완료 후, 다음 시나리오를 통해 기능이 올바르게 작동하는지 검증합니다.

*   **회원가입:** 새 사용자가 유효한 이메일/비밀번호로 가입하고, 성공적으로 마이페이지로 이동하는지 확인합니다.
*   **로그인:** 기존 사용자가 올바른 정보로 로그인하고, 마이페이지로 이동하는지 확인합니다. 잘못된 정보 입력 시 에러 메시지가 표시되는지 확인합니다.
*   **로그아웃:** 로그인된 사용자가 로그아웃 버튼을 클릭하면, 로그아웃 처리되고 홈페이지나 로그인 페이지로 이동하는지 확인합니다.
*   **접근 제어:** 로그아웃 상태에서 `/mypage`와 같은 보호된 경로에 직접 접근 시도 시, 로그인 페이지로 강제 이동되는지 확인합니다.
*   **상태 유지:** 페이지를 새로고침해도 로그인 상태가 유지되는지 확인합니다.

**5. 예상되는 도전 과제 및 고려사항 (Anticipated Challenges & Considerations)**

*   **보안:** Firebase API 키는 클라이언트 측에 노출되지만, Firebase 콘솔에서 허용된 도메인을 설정하여 무단 사용을 방지하는 것이 중요합니다.
*   **사용자 경험(UX):** 인증 상태가 변경될 때(예: 페이지 로드 시) UI가 깜빡이는 현상을 방지해야 합니다. `AuthContext`의 `loading` 상태를 통해 초기 로딩 중임을 명확히 표시하는 것이 좋습니다. 또한, 사용자에게 친절한 에러 메시지(예: "존재하지 않는 계정입니다.")를 제공해야 합니다.
*   **상태 관리 복잡성:** 애플리케이션이 커질수록 인증 상태와 다른 전역 상태 간의 상호작용이 복잡해질 수 있습니다. `AuthContext`를 명확하고 간결하게 유지하는 것이 중요합니다.
