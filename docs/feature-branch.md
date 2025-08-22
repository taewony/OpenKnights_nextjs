GitHub 브랜치 전략에 따른 전체 Git 명령어 흐름을 단계별로 설명해 드리겠습니다.

  작업 흐름

   1. `main` 브랜치를 `old` 브랜치로 백업합니다.
   2. `main` 브랜치에서 `new` 라는 이름의 새 기능 브랜치를 생성하고 이동합니다.
   3. `new` 브랜치에서 기능 추가/수정 작업을 하고 커밋합니다.
   4. 작업이 완료되면 `main` 브랜치로 다시 이동합니다.
   5. `new` 브랜치의 변경 사항을 `main` 브랜치로 병합(merge)합니다.
   6. 최종적으로 `main`, `old`, `new` 세 개의 브랜치를 원격 저장소(origin)에 푸시합니다.

  ---

  전체 Git 명령어

  아래는 위 작업 흐름에 따른 명령어 목록입니다.

  1. `main` 브랜치의 최신 상태 확인 및 `old` 브랜치 생성 (백업)

   1 # (선택 사항) 현재 브랜치가 main이 아니라면 main으로 이동합니다.
   2 git checkout main
   3 
   4 # (선택 사항) 원격 저장소의 최신 main 브랜치 내용을 가져와 동기화합니다.
   5 git pull origin main
   6 
   7 # 현재 main 브랜치 위치에 'old' 라는 이름의 브랜치를 생성합니다. (백업 목적)
   8 # 이 명령어는 브랜치를 생성만 하고 이동하지는 않습니다.
   9 git branch old

  2. `new` 기능 브랜치 생성 및 이동

   1 # 'main' 브랜치에서 'new' 라는 새 브랜치를 생성하고, 해당 브랜치로 즉시 이동합니다.
   2 git checkout -b new

  3. 기능 개발 및 커밋

   1 # ... (이곳에서 파일 수정, 추가 등 실제 기능 개발 작업을 수행합니다) ...
   2 
   3 # 작업한 파일들을 Staging Area에 추가합니다. (모든 변경사항을 추가하려면 '.')
   4 git add .
   5 
   6 # Staging Area에 추가된 변경사항을 커밋 메시지와 함께 기록합니다.
   7 git commit -m "feat: 신규 기능 추가"

  4. `main` 브랜치로 복귀 및 병합

   1 # main 브랜치로 다시 이동합니다.
   2 git checkout main
   3 
   4 # 'new' 브랜치의 모든 변경 내용을 현재 브랜치('main')로 병합합니다.
   5 git merge new

  5. 3개의 브랜치를 원격 저장소에 푸시

   1 # 'main', 'old', 'new' 브랜치를 한 번에 원격 저장소(origin)으로 푸시합니다.
   2 git push origin main old new

  ---

  전체 명령어 요약
```
    1 # 1. 백업 및 준비
    2 git checkout main
    3 git pull origin main
    4 git branch old
    5 
    6 # 2. 신규 브랜치 생성
    7 git checkout -b new
    8 
    9 # 3. 기능 개발 및 커밋
   10 # ... 코드 작업 ...
   11 git add .
   12 git commit -m "feat: 신규 기능 추가"
   13 
   14 # 4. 메인 브랜치에 병합
   15 git checkout main
   16 git merge new
   17 
   18 # 5. 원격 저장소에 푸시
   19 git push origin main old new
```