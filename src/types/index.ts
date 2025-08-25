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
