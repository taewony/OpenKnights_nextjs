# OpenKnights 데이터 모델 및 운영 규칙

이 문서는 OpenKnights 프로젝트에서 사용하는 Firestore 데이터베이스의 컬렉션, 데이터 모델, 그리고 데이터 운영에 대한 규칙을 정의합니다.

---

## 1. 주요 컬렉션 (Collections)

- **Users**: 사용자 정보
- **Projects**: 프로젝트 정보
- **Contests**: 대회 정보
- **Announcements**: 공지사항

---

## 2. 데이터 모델 정의

### 2.1. Users Collection

사용자 계정 정보를 저장하는 컬렉션입니다.

```kotlin
enum class Role {
    ADMIN,              // 관리자
    JUDGE_PRELIMINARY,  // 예선 심사위원
    JUDGE_FINAL,        // 본선 심사위원
    STAFF,              // 운영진
    MENTOR,             // 멘토
    TEAM_LEADER,        // 팀장
    TEAM_MEMBER,        // 팀원
    GUEST               // 일반 사용자 (기본값)
}

data class User (
    // 식별 정보
    val uid: String,                   // Firebase Auth UID, Primary Key
    val email: String,                 // 이메일 (로그인 계정)
    val name: String,                  // 사용자 이름 (Unique)
    val studentId: String?,            // 학번 (선택)

    // 프로필 정보
    val introduction: String = "",     // 자기소개
    val imageUrl: String = "",         // 프로필 이미지 URL

    // 활동 정보
    val roles: List<Role> = listOf(Role.GUEST), // 사용자 역할
    val projects: List<String> = emptyList(),   // 참여 중인 '프로젝트 이름' 목록
)
```

### 2.2. Projects Collection

학생들이 진행하는 프로젝트 정보를 저장하는 컬렉션입니다.

```kotlin
enum class Phase(val label: String) {
    PLANED("예정"),
    REGISTERED("등록"),
    PRELIMINARY_SUBMITTED("예선 제출"),
    PRELIMINARY_PASSED("예선 통과"),
    FINAL_SUBMITTED("본선 제출"),
    FINALIST("본선 진출"),
    PRESENTATION("본선 발표"),
    AWARDED_GRAND("대상 수상"),
    AWARDED_EXCELLENCE("최우수상 수상"),
    AWARDED_ENCOURAGEMENT("우수상 수상"),
    DELETED("삭제"),
    FINISHED("종료")
}

data class Score(
    val usability: Int = 0,
    val techStack: Int = 0,
    val creativity: Int = 0,
    val completeness: Int = 0,
)

data class Project(
    val name: String,                  // 프로젝트 이름 (Unique)
    val term: String,                  // 참여 대회(Contest)의 term
    val teamName: String,              // 팀 이름

    // 참여자 정보
    val leaderName: String,            // 팀장 '사용자 이름'
    val members: List<String> = emptyList(), // 팀원 '사용자 이름' 목록

    // 프로젝트 상세
    val phase: Phase = Phase.PLANED,   // 진행 단계
    val language: String = "",         // 주요 사용 언어
    val description: String = "",      // 상세 설명
    val mentor: String = "",           // 멘토 '사용자 이름'
    val note: String = "",             // 비고

    // 평가 정보
    val preTotal: Int = 0,
    val preScore: Score = Score(),
    val finalTotal: Int = 0,
    val finalScore: Score = Score()
)
```

### 2.3. Contests Collection

매 학기 열리는 대회 정보를 저장하는 컬렉션입니다.

```kotlin
data class Contest(
    val term: String,                  // 대회 이름 (예: "2024-2", Unique)
    val description: String = "",      // 대회 설명
    val staff: List<String> = emptyList(), // 운영진 '사용자 이름' 목록
    val phase: Phase? = null           // 현재 대회 진행 단계
)
```

### 2.4. Announcements Collection

공지사항 정보를 저장하는 컬렉션입니다.

```kotlin
data class Announcement(
  var id: String,
  var title: String,
  var body: String,
  var publishAt: Long,
  var endAt: Long,
  var createdBy: String, // 작성자 '사용자 이름'
  var priority: Int = 0
)
```

---

## 3. 데이터 운영 및 비즈니스 규칙

### 3.1. 데이터 생성 (Create)

#### 사용자 (User)
- **필수 필드**: `uid`, `email`, `name`는 사용자 등록 시 반드시 제공되어야 합니다.
- **기본 역할 (Default Role)**: `roles` 필드가 비어있는 상태로 생성을 요청하면, 시스템은 자동으로 `[GUEST]` 역할을 부여합니다.
- **고유성 (Uniqueness)**: `name` (사용자 이름)은 **unique** 해야 합니다.

#### 프로젝트 (Project)
- **필수 필드**: `name`, `term`, `teamName`, `leaderName`은 프로젝트 생성 시 반드시 제공되어야 합니다.
- **고유성 (Uniqueness)**: `name` (프로젝트 이름)은 **unique** 해야 합니다.

#### 대회 (Contest)
- **필수 필드**: `term`은 대회 생성 시 반드시 제공되어야 합니다.
- **고유성 (Uniqueness)**: `term` (대회 이름)은 **unique** 해야 합니다.

### 3.2. 데이터 관계 및 조회 (Relationship & Lookup)

- **User ↔ Project**:
  - **사용자 → 프로젝트**: 사용자의 `projects` 필드(프로젝트 이름 목록)를 통해 참여 중인 모든 프로젝트를 조회합니다.
  - **프로젝트 → 사용자**: 프로젝트의 `leaderName`과 `members` 필드(사용자 이름 목록)를 통해 참여중인 리더와 멤버 정보를 조회합니다.

- **Project ↔ Contest**:
  - **프로젝트 → 대회**: 프로젝트의 `term` 필드를 통해 어떤 대회에 참여하고 있는지 조회합니다.

### 3.3. 데이터 무결성 및 고유성 관리 (Integrity & Uniqueness)

데이터의 고유성(Uniqueness)을 보장하기 위해 다음 규칙을 적용합니다.

- **대상 필드**:
  - `User.name`
  - `Project.name`
  - `Contest.term`

- **처리 방식**:
  - 새로운 데이터 생성 또는 기존 데이터의 이름/term 변경 시, 시스템은 대상 컬렉션에서 해당 필드의 값이 이미 존재하는지 확인합니다.
  - 만약 동일한 값이 존재한다면, **새로 입력된 값의 맨 뒤에 숫자 1을 붙입니다.** (예: `홍길동` → `홍길동1`)
  - 숫자를 붙인 값도 이미 존재한다면, 숫자를 1씩 증가시켜 고유한 값이 될 때까지 반복합니다. (예: `홍길동2`, `홍길동3`, ...)
