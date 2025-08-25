# 데이터 모델 기반 코드 변경 작업 계획

이 문서는 `data_models.md`에 정의된 데이터 모델과 비즈니스 규칙을 Next.js 프로젝트 코드에 반영하기 위한 작업 목록을 정의합니다.

---

### 작업 순서

1.  **Type 정의**: TypeScript 인터페이스를 모델에 맞게 수정합니다.
2.  **백엔드 로직 구현**: 데이터 생성/수정 시 고유성 보장 및 기본값 할당 로직을 구현합니다. (주로 Next.js API Routes 또는 Firebase Functions 사용)
3.  **프론트엔드 로직 수정**: 변경된 데이터 구조와 로직을 사용하는 UI 컴포넌트 및 페이지를 수정합니다.

---

## 1. TypeScript Type 정의 (src/lib/firebase.ts 또는 src/types/index.ts)

현재 분리된 타입 파일이 없으므로, `src/lib/firebase.ts`에 임시로 정의하거나 `src/types/index.ts` 파일을 새로 만들어 관리하는 것을 권장합니다. `data_models.md`에 정의된 Kotlin `data class`를 TypeScript `interface`로 변환합니다.

```typescript
// src/types/index.ts

export enum Role {
    ADMIN = "ADMIN",
    JUDGE_PRELIMINARY = "JUDGE_PRELIMINARY",
    JUDGE_FINAL = "JUDGE_FINAL",
    STAFF = "STAFF",
    MENTOR = "MENTOR",
    TEAM_LEADER = "TEAM_LEADER",
    TEAM_MEMBER = "TEAM_MEMBER",
    GUEST = "GUEST",
}

export enum Phase {
    PLANED = "예정",
    REGISTERED = "등록",
    PRELIMINARY_SUBMITTED = "예선 제출",
    PRELIMINARY_PASSED = "예선 통과",
    FINAL_SUBMITTED = "본선 제출",
    FINALIST = "본선 진출",
    PRESENTATION = "본선 발표",
    AWARDED_GRAND = "대상 수상",
    AWARDED_EXCELLENCE = "최우수상 수상",
    AWARDED_ENCOURAGEMENT = "우수상 수상",
    DELETED = "삭제",
    FINISHED = "종료",
}

export interface User {
    uid: string;                   // Firebase Auth UID, Primary Key
    email: string;                 // 이메일 (로그인 계정)
    name: string;                  // 사용자 이름 (Unique)
    studentId?: string;            // 학번
    introduction?: string;     // 자기소개
    imageUrl?: string;         // 프로필 이미지 URL
    roles: Role[];                 // 사용자 역할
    projects: string[];            // 참여 중인 '프로젝트 이름' 목록
}

export interface Project {
    name: string;                  // 프로젝트 이름 (Unique)
    term: string;                  // 참여 대회(Contest)의 term
    teamName: string;              // 팀 이름
    leaderName: string;            // 팀장 '사용자 이름'
    members: string[];             // 팀원 '사용자 이름' 목록
    phase: Phase;                  // 진행 단계
    language?: string;         // 주요 사용 언어
    description?: string;      // 상세 설명
    mentor?: string;           // 멘토 '사용자 이름'
    note?: string;             // 비고
    // ... score fields
}

export interface Contest {
    term: string;                  // 대회 이름 (예: "2024-2", Unique)
    description?: string;      // 대회 설명
    staff: string[];               // 운영진 '사용자 이름' 목록
    phase?: Phase;                 // 현재 대회 진행 단계
}

// 다른 모델(Announcement 등)도 필요에 따라 추가
```

## 2. 백엔드 로직 구현 (API Routes 또는 Firebase Functions)

데이터 무결성(고유성, 기본값)을 보장하는 로직은 반드시 서버 측에서 처리해야 합니다.

### 작업 대상

-   사용자 등록/생성 로직 (`/src/pages/RegistrationPage.tsx` 또는 관련 API Route)
-   프로젝트 생성 로직 (`/src/pages/ProjectsPage.tsx` 또는 관련 API Route)

### 구현할 내용

#### A. 고유성 보장 함수 (Uniqueness Handler)

`User.name`, `Project.name`, `Contest.term` 생성 시 중복을 확인하고, 중복 시 숫자 접미사를 붙이는 로직을 구현해야 합니다. 이 로직은 Firestore Transaction을 사용하여 원자적으로 실행하는 것이 안전합니다.

**예시 (의사코드):**

```typescript
// lib/firestoreUtils.ts 또는 api/users.ts 등에 구현

async function generateUniqueName(collectionName: string, fieldName: string, baseName: string): Promise<string> {
  const db = getFirestore();
  const collectionRef = collection(db, collectionName);

  let newName = baseName;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const q = query(collectionRef, where(fieldName, "==", newName));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      isUnique = true;
    } else {
      newName = `${baseName}${counter}`;
      counter++;
    }
  }
  return newName;
}
```

#### B. 사용자 생성 로직 수정

-   회원가입 또는 첫 로그인으로 User 문서를 생성하는 부분에 다음을 적용합니다.
    1.  `generateUniqueName` 함수를 호출하여 `name`을 확정합니다.
    2.  `roles` 필드가 비어있으면 `[Role.GUEST]`를 기본값으로 설정하여 문서를 생성합니다.

#### C. 프로젝트 생성 로직 수정

-   프로젝트를 생성하는 부분에 다음을 적용합니다.
    1.  `generateUniqueName` 함수를 호출하여 `name`을 확정합니다.
    2.  생성된 프로젝트 이름을 해당 유저의 `projects` 필드(배열)에 추가합니다.

## 3. 프론트엔드 로직 수정

-   **사용자 페이지 (`UsersPage.tsx`) / 프로젝트 상세 페이지 (`ProjectDetailsPage.tsx`)**
    -   사용자 프로필에서 `projects` 필드(프로젝트 이름 배열)를 사용하여, 각 프로젝트의 상세 정보로 이동하는 링크를 생성해야 합니다.
    -   프로젝트 상세 페이지에서 `leaderName` 및 `members` 필드(사용자 이름 배열)를 사용하여, 각 사용자의 프로필로 이동하는 링크를 생성해야 합니다.

-   **전체 컴포넌트**
    -   위에서 정의한 TypeScript `interface`를 `import`하여 컴포넌트의 `props`와 `state` 타입으로 사용하도록 수정합니다.
