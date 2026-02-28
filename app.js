const app = document.getElementById('app');

// State Management
let currentState = 'login';
let viewDate = new Date(); // 달력에서 보여지는 달
let selectedDate = new Date(); // 선택된 날짜
let currentMentor = null; // 현재 선택된 멘토 데이터
let selectedTime = "오전 10:00"; // 기본 선택 시간
let selectedLocation = "플러스 커뮤니티 라운지"; // 기본 장소
let selectedAddress = "서울특별시 마포구 연남동"; // 기본 주소
let tempImageData = null; // 업로드용 임시 이미지 데이터
let bookingHistory = []; // 예약 내역 저장 공간

// Mentors Data
const mentorsData = {
    realEstate: {
        id: 'realEstate',
        name: '김태호 & 이수진',
        title: '부동산·주거 행복 봉사팀',
        image: 'cat_realestate.png',
        bio: '15년 경력의 베테랑 공인중개사와 열정적인 청년 멘토가 한 조가 되어, 집 계약이나 이사로 고민하는 이웃을 돕습니다. 복잡한 등기부등본 확인부터 좋은 집 고르는 노하우까지, 2인 1조의 꼼꼼함으로 여러분의 새로운 시작을 응원합니다.',
        stats: { sessions: '500+', response: '30분 내', career: '전문가&청년' },
        space: { name: '플러스 정거장: 연남 아뜰리에', address: '서울특별시 마포구 동교로 123-45', desc: '이웃의 보금자리를 함께 고민하는 따뜻한 상담실' }
    },
    healing: {
        id: 'healing',
        name: '박지원 & 김민호',
        title: '마음 치유 미술 봉사팀',
        image: 'cat_healing.png',
        bio: '미술 치료 전문가와 숲 체험 전문가가 함께하는 2인 1조 치유팀입니다. 색채 활동과 자연 이야기를 통해 지친 마음을 어루만져 드립니다. 두 명의 멘토가 더 깊은 공감과 따뜻한 대화 시간을 선물해 드립니다.',
        stats: { sessions: '120+', response: '1시간 내', career: '전문가팀' },
        space: { name: '플러스 정거장: 숲속 대화방', address: '서울특별시 마포구 연남동 123-4', desc: '두 배의 위로가 있는 마음 치유 공간' }
    },
    legal: {
        id: 'legal',
        name: '박성현 & 김지현',
        title: '이웃 법률 수호 봉사팀',
        image: 'cat_legal.png',
        bio: '법률 분석가와 사회복지 전문가가 한 팀이 되어, 어렵고 딱딱한 법 문제를 이웃의 입장에서 쉽게 풀어드립니다. 법적 자문과 함께 실질적인 생활 지원 대책까지 2인 1조로 명쾌하고 든든하게 안내해 드립니다.',
        stats: { sessions: '300+', response: '2시간 내', career: '법률지원팀' },
        space: { name: '성현 법률 파트너스', address: '서울특별시 마포구 공덕동 456', desc: '당신의 권리를 함께 찾는 든든한 공간' }
    },
    tax: {
        id: 'tax',
        name: '이정우 & 최준호',
        title: '스마트 자산 코칭 봉사팀',
        image: 'cat_tax.png',
        bio: '세무사와 자산 관리사가 짝을 이루어 복잡한 세금과 효율적인 돈 관리법을 알려드립니다. 한 분은 꼼꼼한 계산을, 한 분은 미래 설계를 맡아 2인 1조의 시너지로 여러분의 소중한 자산을 지켜드립니다.',
        stats: { sessions: '450+', response: '1시간 내', career: '세무금융팀' },
        space: { name: '정우 세무 컨설턴트', address: '서울특별시 마포구 서교동 789', desc: '부담 없는 세무 고민 해결소' }
    },
    insurance: {
        id: 'insurance',
        name: '최은주 & 강석준',
        title: '안심 보험 설계 봉사팀',
        image: 'cat_insurance.png',
        bio: '보험 분석과 손해 사정 분야의 두 멘토가 모여 여러분의 보험을 정직하게 진단합니다. 과다한 지출은 줄이고 보장은 탄탄하게 채우는 법을 2인 1조의 협업을 통해 투명하게 분석해 드립니다.',
        stats: { sessions: '280+', response: '1시간 내', career: '보험분석팀' },
        space: { name: '은주 보험 디자인룸', address: '서울특별시 마포구 성산동 101', desc: '나의 미래를 안심으로 채우는 공간' }
    },
    edu: {
        id: 'edu',
        name: '정미소 & 이다온',
        title: '꿈 키움 교육 컨설팅팀',
        image: 'cat_edu.png',
        bio: '교육 전문가와 진로 상담사가 2인 1조로 우리 아이들의 꿈을 함께 그립니다. 아이의 재능을 발견하는 법과 학습 방향 설정을 위해 두 명의 멘토가 정성을 다해 함께 고민하고 가이드를 제공합니다.',
        stats: { sessions: '200+', response: '2시간 내', career: '교육진로팀' },
        space: { name: '미소 교육 코칭 센터', address: '서울특별시 마포구 연남동 202', desc: '아이와 부모가 함께 꿈꾸는 공간' }
    }
};

// Screen Templates
const screens = {
    login: () => `
        <div class="screen login-screen fade-in-up">
            <div class="welcome-image-container">
                <img src="plus_station_mascot_welcome.png?v=1.1" alt="플러스 정거장에 오신 것을 환영합니다">
            </div>
            <div class="welcome-content">
                <h1 class="welcome-title">플러스 정거장에<br>오신 것을 환영합니다</h1>
                <p class="welcome-subtitle">이웃의 재능을 나누고<br>마음을 치유하는 따뜻한 공간<br><span style="color:var(--primary-color)">간편하게 시작하기 ↓</span></p>
                
                <div class="login-buttons">
                    <button class="btn-login btn-kakao" onclick="handleLogin('카카오')">
                        <i class="fa-solid fa-comment"></i> 카카오로 1초 로그인
                    </button>
                    <button class="btn-login btn-naver" onclick="handleLogin('네이버')">
                        <i class="fa-solid fa-n"></i> 네이버로 1초 로그인
                    </button>
                </div>
                
                <div class="login-footer">
                    <a href="#" class="other-login" onclick="navigateTo('emailLogin')">다른 방법으로 로그인</a>
                    <p class="terms-text">
                        계속 진행하면 플러스 정거장의<br>
                        이용약관 및 개인정보 처리방침에 동의하게 됩니다.
                    </p>
                </div>
            </div>
        </div>
    `,
    emailLogin: () => `
        <div class="screen email-login-screen fade-in">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('login')">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
            </header>
            
            <div class="email-login-content p-3">
                <h2 style="font-size: 24px; margin-bottom: 8px;">이메일로 로그인</h2>
                <p style="color: var(--text-dim); margin-bottom: 32px;">나머지 정보를 입력해 주세요.</p>
                
                <div class="input-group mt-3">
                    <label>이메일</label>
                    <input type="email" id="login-email" placeholder="example@mail.com" style="width:100%; height:50px; border-radius:12px; border:1px solid #ddd; padding:0 16px;">
                </div>
                
                <div class="input-group mt-2">
                    <label>비밀번호</label>
                    <input type="password" id="login-pw" placeholder="비밀번호를 입력하세요" style="width:100%; height:50px; border-radius:12px; border:1px solid #ddd; padding:0 16px;">
                </div>
                
                <div style="text-align: right; margin: 16px 0;">
                    <a href="#" style="font-size: 13px; color: var(--text-dim); text-decoration: none;">비밀번호 찾기</a>
                </div>
                
                <button class="btn-primary mt-3" onclick="navigateTo('category')">로그인</button>
                
                <div style="text-align: center; margin-top: 32px;">
                    <p style="font-size: 14px; color: var(--text-dim);">계정이 없으신가요? <a href="#" style="color: var(--primary-color); font-weight: 700; text-decoration: none;">회원가입</a></p>
                </div>
            </div>
        </div>
    `,
    category: () => `
        <div class="screen category-screen fade-in">
            <header class="header">
                <div class="brand-wrapper">
                    <p class="brand-tag">HEALING O2O</p>
                    <h2 class="brand-name">플러스 정거장</h2>
                </div>
                <div style="display:flex; gap: 8px;">
                    <button class="share-btn" onclick="navigateTo('globalQr')" title="내 QR">
                        <i class="fa-solid fa-qrcode"></i>
                    </button>
                    <div class="profile-icon">
                        <i class="fa-regular fa-user"></i>
                    </div>
                </div>
            </header>
            
            <section class="greeting-section">
                <h1 class="greeting-title">오늘 당신의<br><span>마음은 어떤가요?</span></h1>
                <p class="greeting-subtitle">고민 중인 카테고리를 선택해 주세요.</p>
            </section>
            
            <div class="category-list">
                <div class="category-card item-real-estate" onclick="openMentor('realEstate')">
                    <div class="category-thumb">
                         <img src="cat_realestate.png" alt="부동산">
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">집 계약이나 이사 문제가 고민이에요</h3>
                        <p class="category-desc">부동산 · 주거 상담</p>
                    </div>
                    <i class="fa-solid fa-chevron-right category-arrow"></i>
                </div>
                
                <div class="category-card item-healing" onclick="openMentor('healing')">
                    <div class="category-thumb">
                         <img src="cat_healing.png" alt="치유">
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">나와 가족, 관계의 마음을 돌보고 싶어요</h3>
                        <p class="category-desc">심리 상담 · 관계 개선</p>
                    </div>
                    <i class="fa-solid fa-chevron-right category-arrow"></i>
                </div>
                
                <div class="category-card item-legal" onclick="openMentor('legal')">
                    <div class="category-thumb">
                         <img src="cat_legal.png" alt="법률">
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">억울하고 답답한 법적 문제가 생겼요</h3>
                        <p class="category-desc">법률 자문 · 권리 구제</p>
                    </div>
                    <i class="fa-solid fa-chevron-right category-arrow"></i>
                </div>
                
                <div class="category-card item-tax" onclick="openMentor('tax')">
                    <div class="category-thumb">
                         <img src="cat_tax.png" alt="세무">
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">복잡한 세금과 돈 관리가 막막해요</h3>
                        <p class="category-desc">세무 · 자산 관리</p>
                    </div>
                    <i class="fa-solid fa-chevron-right category-arrow"></i>
                </div>
                
                <div class="category-card item-insurance" onclick="openMentor('insurance')">
                    <div class="category-thumb">
                         <img src="cat_insurance.png" alt="보험">
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">내 보험, 제대로 들고 있는지 궁금해요</h3>
                        <p class="category-desc">보험 진단 · 설계 상담</p>
                    </div>
                    <i class="fa-solid fa-chevron-right category-arrow"></i>
                </div>
                
                <div class="category-card item-edu" onclick="openMentor('edu')">
                    <div class="category-thumb">
                         <img src="cat_edu.png" alt="교육">
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">우리 아이 교육과 진로 방향을 잡고 싶어요</h3>
                        <p class="category-desc">교육 · 입시 · 진로</p>
                    </div>
                    <i class="fa-solid fa-chevron-right category-arrow"></i>
                </div>
            </div>
            
            <nav class="bottom-nav">
                <div class="nav-item active" onclick="navigateTo('category')">
                    <i class="fa-solid fa-house-chimney"></i>
                    <span>홈</span>
                </div>
                <div class="nav-item" onclick="navigateTo('myBookings')">
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>예약내역</span>
                </div>
                <div class="nav-item" onclick="alert('커뮤니티 서비스는 현재 준비 중입니다.')">
                    <i class="fa-solid fa-users"></i>
                    <span>커뮤니티</span>
                </div>
                <div class="nav-item" onclick="alert('내 정보 관리 기능은 현재 준비 중입니다.')">
                    <i class="fa-regular fa-id-card"></i>
                    <span>내 정보</span>
                </div>
            </nav>
        </div>
    `,
    mentor: () => `
        <div class="screen mentor-screen fade-in">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('category')">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 class="title-center">멘토 프로필</h2>
                <div style="display:flex; gap: 8px;">
                    <button class="share-btn" onclick="navigateTo('editMentor')" title="수정하기">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="share-btn" onclick="shareMentorProfile()">
                        <i class="fa-solid fa-share-nodes"></i>
                    </button>
                </div>
            </header>

            <div class="profile-main-section">
                <div class="profile-avatar-container">
                    <img src="${currentMentor.image}" alt="Mentor Profile">
                    <div class="status-badge"></div>
                </div>
                <h2 class="mentor-name">${currentMentor.name}</h2>
                <p class="mentor-title">${currentMentor.title}</p>
                <div class="rating-row">
                    <i class="fa-solid fa-star"></i> 5.0 <span>(리뷰 48개)</span>
                </div>

                <div class="mentor-status-row">
                    <div class="status-item">
                        <span class="status-label">현재 상태</span>
                        <span class="status-value live"><i class="fa-solid fa-circle" style="font-size:8px; vertical-align:middle; margin-right:4px;"></i> LIVE</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">상담 가능</span>
                        <span class="status-value">예약 가능</span>
                    </div>
                </div>

                <div class="mentor-stats clickable-stats" onclick="navigateTo('editMentor')" title="클릭하여 수정">
                    <div class="stat-box">
                        <p class="stat-label">상담 횟수</p>
                        <p class="stat-value-large">${currentMentor.stats.sessions}</p>
                    </div>
                    <div class="stat-box">
                        <p class="stat-label">응답 시간</p>
                        <p class="stat-value-large">${currentMentor.stats.response}</p>
                    </div>
                    <div class="stat-box" style="position:relative;">
                        <p class="stat-label">경력</p>
                        <p class="stat-value-large">${currentMentor.stats.career} <i class="fa-solid fa-pen" style="font-size:10px; color:var(--primary-color); vertical-align:middle; cursor:pointer;"></i></p>
                    </div>
                </div>

                <div class="mentor-bio">
                    <h3 class="section-title">자기소개</h3>
                    <p class="bio-text">${currentMentor.bio}</p>
                </div>

                <div class="mentor-bio">
                    <h3 class="section-title">치유 공간</h3>
                    <div class="healing-space-preview" onclick="navigateTo('space')">
                        <div class="space-image">
                            <img src="space.png" alt="Healing Space">
                        </div>
                        <div class="space-info">
                            <p class="space-name">${currentMentor.space.name}</p>
                            <p class="space-address">${currentMentor.space.address}</p>
                        </div>
                        <i class="fa-solid fa-chevron-right category-arrow" style="align-self:center;"></i>
                    </div>
                </div>

                <div class="fixed-bottom">
                    <button class="btn-primary" onclick="navigateTo('booking')">${currentMentor.id === 'healing' ? '마음 치유' : currentMentor.title} 상담 예약하기</button>
                </div>
            </div>
        </div>
    `,
    editMentor: () => `
        <div class="screen edit-screen fade-in">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('mentor')">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <h2 class="title-center">프로필 편집</h2>
                <div style="width:40px;"></div>
            </header>

            <div class="edit-form">
                <div class="input-group">
                    <label>프로필 사진</label>
                    <div class="photo-edit-container">
                        <img src="${currentMentor.image}" class="photo-preview-small" id="edit-preview">
                        <input type="file" id="file-input" style="display:none;" accept="image/*" onchange="handlePhotoChange(event)">
                        <button class="btn-upload" onclick="document.getElementById('file-input').click()">사진 변경</button>
                    </div>
                </div>

                <div class="input-group">
                    <label>이름</label>
                    <input type="text" id="edit-name" value="${currentMentor.name}" placeholder="이름을 입력하세요">
                </div>

                <div class="input-group">
                    <label>분야 및 직함</label>
                    <input type="text" id="edit-title" value="${currentMentor.title}" placeholder="예: 법률 자문 변호사">
                </div>

                <div class="input-group">
                    <label>자기소개</label>
                    <textarea id="edit-bio" placeholder="나를 표현하는 따뜻한 말을 남겨주세요">${currentMentor.bio}</textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                    <div class="input-group">
                        <label>상담 횟수</label>
                        <input type="text" id="edit-sessions" value="${currentMentor.stats.sessions}" placeholder="예: 100+">
                    </div>
                    <div class="input-group">
                        <label>응답 시간</label>
                        <input type="text" id="edit-response" value="${currentMentor.stats.response}" placeholder="예: 1시간 내">
                    </div>
                    <div class="input-group">
                        <label>경력</label>
                        <input type="text" id="edit-career" value="${currentMentor.stats.career}" placeholder="예: 5년">
                    </div>
                </div>

                <div class="input-divider" style="height:1px; background:#eee; margin: 24px 0;"></div>
                <h3 class="section-title" style="margin-bottom:16px;">치유 공간 설정</h3>

                <div class="input-group">
                    <label>공간 이름</label>
                    <input type="text" id="edit-space-name" value="${currentMentor.space.name}" placeholder="공간 이름을 입력하세요">
                </div>

                <div class="input-group">
                    <label>공간 한줄 설명</label>
                    <input type="text" id="edit-space-desc" value="${currentMentor.space.desc}" placeholder="공간에 대한 따뜻한 설명을 적어주세요">
                </div>

                <div class="input-group">
                    <label>공간 주소</label>
                    <input type="text" id="edit-space-address" value="${currentMentor.space.address}" placeholder="주소를 입력하세요">
                </div>

                <div class="fixed-bottom">
                    <button class="btn-primary" onclick="saveMentorSettings()">수정 완료</button>
                </div>
            </div>
        </div>
    `,
    space: () => `
        <div class="screen space-screen fade-in">
            <header class="header" style="position:absolute; top:0; z-index:20; background:transparent;">
                <button class="back-btn" onclick="navigateTo('mentor')" style="background:rgba(255,255,255,0.8); border-radius:50%;">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
            </header>

            <div class="space-hero">
                <img src="space.png" alt="Healing Space">
                <div class="space-hero-overlay">
                    <span class="space-badge">인기 장소</span>
                </div>
            </div>

            <div class="space-booking-card">
                <h2 class="space-main-title">${currentMentor.space.name}</h2>
                <p class="space-sub-text">${currentMentor.space.desc}</p>

                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-icon"><i class="fa-solid fa-location-dot"></i></div>
                        <div class="info-text-group">
                            <span class="info-label">위치</span>
                            <span class="info-val">${currentMentor.space.address.split(' ')[1] || '위치 미지정'}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon"><i class="fa-solid fa-clock"></i></div>
                        <div class="info-text-group">
                            <span class="info-label">이용 가능</span>
                            <span class="info-val">10:00 - 22:00</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon"><i class="fa-solid fa-couch"></i></div>
                        <div class="info-text-group">
                            <span class="info-label">시설</span>
                            <span class="info-val">최대 6인</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon"><i class="fa-solid fa-mug-hot"></i></div>
                        <div class="info-text-group">
                            <span class="info-label">서비스</span>
                            <span class="info-val">무료 다과 제공</span>
                        </div>
                    </div>
                </div>

                <h3 class="section-title">오시는 길</h3>
                <div class="map-placeholder">
                    <i class="fa-solid fa-map-location-dot" style="font-size:32px; color:var(--primary-color);"></i>
                    <p style="font-size:12px;">지도가 곧 로딩됩니다...</p>
                </div>

                <button class="btn-secondary" onclick="alert('길찾기 외부 앱으로 연결됩니다.')">길찾기 앱으로 보기</button>

                <div class="fixed-bottom">
                    <button class="btn-primary" onclick="alert('공간 대여 예약 페이지 준비 중입니다.')">공간 방문 예약하기</button>
                </div>
            </div>
            
            <nav class="bottom-nav">
                <div class="nav-item" onclick="navigateTo('category')">
                    <i class="fa-solid fa-house-chimney"></i>
                    <span>홈</span>
                </div>
                <div class="nav-item" onclick="navigateTo('history')">
                    <i class="fa-regular fa-comment-dots"></i>
                    <span>상담</span>
                </div>
                <div class="nav-item" onclick="alert('커뮤니티 서비스는 현재 준비 중입니다.')">
                    <i class="fa-solid fa-users"></i>
                    <span>커뮤니티</span>
                </div>
                <div class="nav-item" onclick="alert('내 정보 관리 기능은 현재 준비 중입니다.')">
                    <i class="fa-regular fa-id-card"></i>
                    <span>내 정보</span>
                </div>
            </nav>
        </div>
    `,
    booking: () => {
        const timeSlots = ["오전 10:00", "오전 11:30", "오후 01:00", "오후 02:30", "오후 04:00", "오후 05:30"];
        let timeChips = timeSlots.map(time =>
            `<button class="time-chip ${selectedTime === time ? 'active' : ''}" onclick="selectTime('${time}')">${time}</button>`
        ).join('');

        return `
        <div class="screen booking-screen fade-in">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('mentor')">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 class="title-center">예약 및 책임비 결제</h2>
                <div style="width:40px;"></div>
            </header>

            <div class="step-indicator">
                <div class="step-dots">
                    <div class="dot active"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>

            <div class="booking-section">
                <span class="section-label">1. 날짜 선택</span>
                <div class="calendar-container">
                    <div class="calendar-header">
                        <button onclick="changeMonth(-1)" style="background:none; border:none; padding:10px;"><i class="fa-solid fa-chevron-left" style="color:#ccc"></i></button>
                        <span class="calendar-month" id="calendar-month-label">2024년 5월</span>
                        <button onclick="changeMonth(1)" style="background:none; border:none; padding:10px;"><i class="fa-solid fa-chevron-right" style="color:#ccc"></i></button>
                    </div>
                    <div class="calendar-grid" id="calendar-grid">
                        <!-- 달력이 여기에 렌더링됩니다 -->
                    </div>
                </div>

                <span class="section-label">2. 시간 선택</span>
                <div class="time-grid" id="time-grid">
                    ${timeChips}
                </div>

                <div class="notice-banner">
                    <i class="fa-solid fa-circle-info notice-icon"></i>
                    <p class="notice-text">
                        <strong>최소 책임비: 2,000원</strong><br>
                        오프라인 다과비로 사용되며 노쇼 방지를 위한 최소한의 약속입니다.
                    </p>
                </div>

                <div class="booking-summary-card">
                    <div class="summary-header">
                        <span class="summary-title">예약 요약</span>
                        <span class="summary-date-tag" id="summary-date-label">2024년 5월 5일</span>
                    </div>
                    <div class="summary-detail-row">
                        <i class="fa-regular fa-clock"></i>
                        <div class="detail-container">
                            <p class="detail-text" id="summary-time-label">${selectedTime} - ${getEndTime(selectedTime)}</p>
                        </div>
                    </div>
                    <div class="summary-detail-row">
                        <i class="fa-solid fa-location-dot"></i>
                        <div class="detail-container">
                            <input type="text" id="summary-location-input" value="${selectedLocation}" oninput="updateLocation(this.value)" placeholder="장소명을 입력해주세요">
                            <input type="text" class="input-sub" id="summary-address-input" value="${selectedAddress}" oninput="updateAddress(this.value)" placeholder="상세 주소를 입력해주세요">
                        </div>
                    </div>
                    <div class="total-row">
                        <span class="total-label">총 결제 금액</span>
                        <span class="total-amount">2,000원</span>
                    </div>
                </div>

                <div class="payment-footer">
                    <button class="btn-payment" onclick="navigateTo('success')">
                        결제 및 예약 확정 <i class="fa-solid fa-credit-card"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    },
    success: () => `
        <div class="screen success-screen fade-in">
            <div style="padding: 100px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                <div style="width: 80px; height: 80px; background-color: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 40px; margin-bottom: 32px; box-shadow: 0 10px 20px rgba(80, 180, 152, 0.3);">
                    <i class="fa-solid fa-check"></i>
                </div>
                <h2 style="font-size: 26px; margin-bottom: 12px;">예약이 완료되었습니다!</h2>
                <p style="color: var(--text-dim); line-height: 1.6; margin-bottom: 48px;">
                    따뜻한 마음의 온기가 시작됩니다.<br>
                    선택하신 시간에 맞춰 설레는 마음으로 만나요.
                </p>
                
                <div class="booking-summary-card" style="width: 100%; margin-bottom: 40px; text-align: left;">
                    <div class="summary-header">
                        <span class="summary-title">예약 정보</span>
                    </div>
                    <div class="summary-detail-row">
                        <i class="fa-solid fa-heart" style="color:var(--primary-color);"></i>
                        <div class="detail-container">
                            <p class="detail-text">${currentMentor.id === 'healing' ? '마음 치유 세션' : currentMentor.title + ' 상담'}</p>
                            <p class="detail-sub">멘토 ${currentMentor.name}</p>
                        </div>
                    </div>
                    <div class="summary-detail-row">
                        <i class="fa-regular fa-calendar-check" style="color:var(--primary-color);"></i>
                        <div class="detail-container">
                            <p class="detail-text" id="success-date-label">10월 24일 · 오후 2:00</p>
                        </div>
                    </div>
                    <div class="summary-detail-row">
                        <i class="fa-solid fa-location-dot" style="color:var(--primary-color);"></i>
                        <div class="detail-container">
                            <p class="detail-text">${selectedLocation}</p>
                            <p class="detail-sub">${selectedAddress}</p>
                        </div>
                    </div>
                </div>

                <button class="btn-primary" onclick="navigateTo('category')" style="width:100%;">홈으로 돌아가기</button>
            </div>
        </div>
    `,
    history: () => {
        let historyItems = bookingHistory.length > 0 ? bookingHistory.map(item => `
            <div class="booking-summary-card" style="margin-bottom: 16px; background: white; border: 1px solid #eee; color: #333;">
                <div class="summary-header" style="border-bottom: 1px solid #eee;">
                    <span class="summary-title" style="color: #666;">예약 상세</span>
                    <span class="summary-date-tag">${item.date}</span>
                </div>
                <div class="summary-detail-row">
                    <i class="fa-solid fa-heart" style="color:var(--primary-color);"></i>
                    <div class="detail-container">
                        <p class="detail-text" style="color:#333;">${item.service}</p>
                        <p class="detail-sub" style="color:#888;">멘토 ${item.mentorName}</p>
                    </div>
                </div>
                <div class="summary-detail-row">
                    <i class="fa-regular fa-clock" style="color:var(--primary-color);"></i>
                    <div class="detail-container">
                        <p class="detail-text" style="color:#333;">${item.time}</p>
                    </div>
                </div>
                <div class="summary-detail-row">
                    <i class="fa-solid fa-location-dot" style="color:var(--primary-color);"></i>
                    <div class="detail-container">
                        <p class="detail-text" style="color:#333;">${item.location}</p>
                    </div>
                </div>
                <div style="text-align:right; margin-top: 10px;">
                    <span style="font-size:12px; color: var(--primary-color); font-weight:700;">예약 완료</span>
                </div>
            </div>
        `).reverse().join('') : `
            <div style="text-align:center; padding: 100px 24px; color: #999;">
                <i class="fa-regular fa-calendar-xmark" style="font-size:48px; margin-bottom: 20px; opacity:0.3;"></i>
                <p>아직 예약 내역이 없습니다.<br>따뜻한 상담을 예약해 보세요!</p>
            </div>
        `;

        return `
        <div class="screen history-screen fade-in">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('category')">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 class="title-center">상담 예약 내역</h2>
                <div style="width:40px;"></div>
            </header>
            
            <div style="padding: 24px;">
                ${historyItems}
            </div>

            <nav class="bottom-nav">
                <div class="nav-item" onclick="navigateTo('category')">
                    <i class="fa-solid fa-house-chimney"></i>
                    <span>홈</span>
                </div>
                <div class="nav-item active">
                    <i class="fa-solid fa-comment-dots"></i>
                    <span>상담</span>
                </div>
                <div class="nav-item" onclick="alert('커뮤니티 서비스는 현재 준비 중입니다.')">
                    <i class="fa-solid fa-users"></i>
                    <span>커뮤니티</span>
                </div>
                <div class="nav-item" onclick="alert('내 정보 관리 기능은 현재 준비 중입니다.')">
                    <i class="fa-regular fa-id-card"></i>
                    <span>내 정보</span>
                </div>
            </nav>
        </div>
        `;
    },
    qrShare: () => `
        <div class="screen qr-screen fade-in">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('mentor')">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 class="title-center">QR 코드로 공유하기</h2>
                <div style="width:40px;"></div>
            </header>

            <div class="qr-content">
                <div class="qr-card">
                    <div class="mentor-brief">
                        <img src="${currentMentor.image}" alt="Mentor" class="qr-mentor-img">
                        <div class="mentor-brief-text">
                            <h3>${currentMentor.name}</h3>
                            <p>${currentMentor.title}</p>
                        </div>
                    </div>
                    
                    <div id="qrcode-container" class="qrcode-wrapper">
                        <!-- QR Code will be rendered here -->
                    </div>
                    
                    <p class="qr-instruction">상대방의 카메라로 스캔하면<br>멘토 프로필로 바로 연결됩니다.</p>
                </div>
                
                <div class="qr-actions">
                    <button class="btn-secondary" onclick="shareMentorProfileOriginal()">
                        <i class="fa-solid fa-link"></i> 링크 복사하기
                    </button>
                    <button class="btn-primary" onclick="window.print()">
                        <i class="fa-solid fa-download"></i> QR 이미지 저장
                    </button>
                </div>
            </div>
        </div>
    `,
    globalQr: () => `
        <div class="screen qr-screen fade-in" style="background: var(--primary-color);">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('category')" style="color:white;">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 class="title-center" style="color:white;">내 폰을 QR로 공유하기</h2>
                <div style="width:40px;"></div>
            </header>

            <div class="qr-content">
                <div class="qr-card" style="padding: 40px 24px;">
                    <h3 style="margin-bottom:8px; color:var(--primary-color);">플러스 정거장</h3>
                    <p style="font-size:13px; color:var(--text-dim); margin-bottom:24px;">이웃과 함께하는 따뜻한 공간</p>
                    
                    <div id="global-qrcode-container" class="qrcode-wrapper" style="border-color: var(--primary-light); background:white; padding:10px;">
                        <!-- QR Code will be rendered here -->
                    </div>
                    
                    <p class="qr-instruction" style="margin-top:24px;">지금 이 화면을 다른 사람에게 보여주세요!<br>카메라로 찍으면 바로 접속됩니다.</p>
                </div>
                
                <button class="btn-primary" onclick="navigateTo('category')" style="background:white; color:var(--primary-color); margin-top:32px; box-shadow:none;">
                    닫기
                </button>
            </div>
        </div>
    `,
    myBookings: () => `
        <div class="screen bookings-screen fade-in">
            <header class="header">
                <h2 class="brand-name">내 예약 내역</h2>
                <div class="profile-icon">
                    <i class="fa-regular fa-user"></i>
                </div>
            </header>

            <div class="bookings-content p-3">
                ${bookingHistory.length === 0 ? `
                    <div style="text-align: center; padding: 100px 20px;">
                        <i class="fa-regular fa-calendar-check" style="font-size: 60px; color: var(--primary-light); margin-bottom: 24px; display: block;"></i>
                        <p style="color: var(--text-dim);">아직 예약된 내역이 없습니다.<br>멘토를 찾아 마음을 나누어 보세요.</p>
                        <button class="btn-primary mt-3" onclick="navigateTo('category')">멘토 찾기</button>
                    </div>
                ` : `
                    <div class="history-list">
                        ${bookingHistory.map(item => `
                            <div class="history-item" style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 16px; box-shadow: var(--shadow-soft);">
                                <div style="display:flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                    <div>
                                        <h4 style="font-size: 16px; margin-bottom: 4px;">${item.mentorName}</h4>
                                        <p style="font-size: 13px; color: var(--primary-dark); font-weight: 600;">${item.location}</p>
                                    </div>
                                    <span style="background: var(--primary-light); color: var(--primary-dark); font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 20px;">예약 확정</span>
                                </div>
                                <div style="border-top: 1px dashed #eee; padding-top: 12px; font-size: 13px; color: var(--text-dim);">
                                    <p><i class="fa-regular fa-clock" style="margin-right: 6px;"></i> ${item.date} ${item.time}</p>
                                    <p style="margin-top: 4px;"><i class="fa-solid fa-location-dot" style="margin-right: 6px;"></i> ${item.address}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>

            <nav class="bottom-nav">
                <div class="nav-item" onclick="navigateTo('category')">
                    <i class="fa-solid fa-house-chimney"></i>
                    <span>홈</span>
                </div>
                <div class="nav-item active" onclick="navigateTo('myBookings')">
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>예약내역</span>
                </div>
                <div class="nav-item">
                    <i class="fa-solid fa-gear"></i>
                    <span>설정</span>
                </div>
            </nav>
        </div>
    `
};

// Navigation Function
function navigateTo(screenId) {
    const templateFn = screens[screenId];
    app.innerHTML = templateFn();
    currentState = screenId;
    window.scrollTo(0, 0);

    if (screenId === 'booking') {
        renderCalendar();
    }

    if (screenId === 'success') {
        const successLabel = document.getElementById('success-date-label');
        const formattedDate = `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;

        if (successLabel) {
            successLabel.innerText = `${formattedDate} · ${selectedTime}`;
        }

        // 히스토리에 추가
        bookingHistory.push({
            date: formattedDate,
            time: selectedTime,
            service: currentMentor.id === 'healing' ? '마음 치유 세션' : currentMentor.title + ' 상담',
            mentorName: currentMentor.name,
            location: selectedLocation
        });
    }

    if (screenId === 'qrShare') {
        setTimeout(() => {
            const container = document.getElementById('qrcode-container');
            if (container) {
                container.innerHTML = "";
                new QRCode(container, {
                    text: window.location.href,
                    width: 200,
                    height: 200,
                    colorDark: "#2D3436",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        }, 100);
    }

    if (screenId === 'globalQr') {
        setTimeout(() => {
            const container = document.getElementById('global-qrcode-container');
            if (container) {
                container.innerHTML = "";
                new QRCode(container, {
                    text: window.location.href.split('#')[0].split('?')[0], // 깔끔한 기본 주소만
                    width: 220,
                    height: 220,
                    colorDark: "#2D3436",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        }, 100);
    }
}

function openMentor(mentorKey) {
    currentMentor = mentorsData[mentorKey];
    tempImageData = null; // 멘토 초기화 시 임시 데이터도 초기화

    // 멘토의 공간 정보를 예약 기본 정보로 설정
    selectedLocation = currentMentor.space.name;
    selectedAddress = currentMentor.space.address;

    navigateTo('mentor');
}

function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            tempImageData = e.target.result;
            document.getElementById('edit-preview').src = tempImageData;
        };
        reader.readAsDataURL(file);
    }
}

function saveMentorSettings() {
    const name = document.getElementById('edit-name').value;
    const title = document.getElementById('edit-title').value;
    const bio = document.getElementById('edit-bio').value;

    if (!name || !title) {
        alert('이름과 직함을 입력해 주세요.');
        return;
    }

    currentMentor.name = name;
    currentMentor.title = title;
    currentMentor.bio = bio;

    // 실적 데이터 업데이트
    currentMentor.stats.sessions = document.getElementById('edit-sessions').value;
    currentMentor.stats.response = document.getElementById('edit-response').value;
    currentMentor.stats.career = document.getElementById('edit-career').value;

    // 공간 정보 업데이트
    currentMentor.space.name = document.getElementById('edit-space-name').value;
    currentMentor.space.desc = document.getElementById('edit-space-desc').value;
    currentMentor.space.address = document.getElementById('edit-space-address').value;

    // 예약 기본 정보도 최신화
    selectedLocation = currentMentor.space.name;
    selectedAddress = currentMentor.space.address;

    // 업로드된 이미지가 있으면 반영
    if (tempImageData) {
        currentMentor.image = tempImageData;
    }

    alert('프로필이 성공적으로 수정되었습니다.');
    tempImageData = null; // 저장 후 초기화
    navigateTo('mentor');
}

function shareMentorProfile() {
    navigateTo('qrShare');
}

function shareMentorProfileOriginal() {
    if (navigator.share) {
        navigator.share({
            title: `플러스 정거장 - ${currentMentor.name} 멘토`,
            text: `${currentMentor.title} ${currentMentor.name} 멘토님을 소개합니다.`,
            url: window.location.href,
        })
            .then(() => console.log('공유 성공'))
            .catch((error) => console.log('공유 실패', error));
    } else {
        // Web Share API를 지원하지 않는 경우 클립보드 복사
        const dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        alert("링크가 클립보드에 복사되었습니다. 원하는 곳에 붙여넣기 해주세요!");
    }
}

// --- Booking Helpers ---
function selectTime(time) {
    selectedTime = time;
    navigateTo('booking'); // 화면 리프레시하여 활성화 상태 반영
}

function updateLocation(val) {
    selectedLocation = val;
}

function updateAddress(val) {
    selectedAddress = val;
}

function getEndTime(startTime) {
    if (!startTime) return "";
    const [period, time] = startTime.split(' ');
    const [hour, min] = time.split(':');
    let h = parseInt(hour);
    let m = parseInt(min);

    m += 90; // 1시간 30분 상담 기준
    if (m >= 60) {
        h += Math.floor(m / 60);
        m = m % 60;
    }

    let endPeriod = period;
    if (period === "오전" && h >= 12) {
        if (h > 12) h -= 12;
        endPeriod = "오후";
    } else if (period === "오후" && h >= 12 && h < 12) {
        // 특별 처리 없음
    } else if (h > 12) {
        h -= 12;
    }

    return `${endPeriod} ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// --- Calendar Logic ---

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const label = document.getElementById('calendar-month-label');
    const summaryLabel = document.getElementById('summary-date-label');
    if (!grid || !label) return;

    label.innerText = `${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`;

    if (summaryLabel) {
        summaryLabel.innerText = `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;
    }

    grid.innerHTML = '<div class="day-name">일</div><div class="day-name">월</div><div class="day-name">화</div><div class="day-name">수</div><div class="day-name">목</div><div class="day-name">금</div><div class="day-name">토</div>';

    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const lastDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const prevLastDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();

    // 이전 달 날짜
    for (let i = firstDay - 1; i >= 0; i--) {
        grid.innerHTML += `<div class="day dim">${prevLastDate - i}</div>`;
    }

    // 현재 달 날짜
    for (let i = 1; i <= lastDate; i++) {
        const isSelected = i === selectedDate.getDate() && viewDate.getMonth() === selectedDate.getMonth() && viewDate.getFullYear() === selectedDate.getFullYear();
        grid.innerHTML += `<div class="day ${isSelected ? 'active' : ''}" onclick="selectDay(${i})">${i}</div>`;
    }
}

function changeMonth(offset) {
    const now = new Date();
    const futureLimit = new Date();
    futureLimit.setFullYear(now.getFullYear() + 1);

    const newViewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);

    if (newViewDate >= new Date(now.getFullYear(), now.getMonth(), 1) && newViewDate <= futureLimit) {
        viewDate = newViewDate;
        renderCalendar();
    }
}

function selectDay(day) {
    selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    renderCalendar();
}

// Global exposure
window.changeMonth = changeMonth;
window.selectDay = selectDay;
window.navigateTo = navigateTo;
window.openMentor = openMentor;
window.handlePhotoChange = handlePhotoChange;
window.saveMentorSettings = saveMentorSettings;
window.shareMentorProfile = shareMentorProfile;
window.updateLocation = updateLocation;
window.updateAddress = updateAddress;
window.selectTime = selectTime;

// --- Login Simulation ---
function handleLogin(provider) {
    const loginButtons = document.querySelector('.login-buttons');
    if (!loginButtons) return;

    // 로딩 상태 표시
    loginButtons.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 32px; color: var(--primary-color); margin-bottom: 16px;"></i>
            <p style="color: var(--text-dim); font-size: 14px;">${provider} 인증 중입니다...</p>
        </div>
    `;

    // 1.5초 후 로그인 완료 처리
    setTimeout(() => {
        alert(`${provider} 계정으로 로그인이 완료되었습니다!\n플러스 정거장에 오신 것을 환영합니다. 😊`);
        navigateTo('category');
    }, 1500);
}

window.handleLogin = handleLogin;

// Initial Rendering
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('login');
});
