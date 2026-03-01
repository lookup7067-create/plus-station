// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyD2Ng5gORxcxk2E-UrzqhEzMCA1cUu2PeM",
    authDomain: "cut-460909.firebaseapp.com",
    projectId: "cut-460909",
    storageBucket: "cut-460909.firebasestorage.app",
    messagingSenderId: "160421849253",
    appId: "1:160421849253:web:9a74253416ad7802e8454c",
    measurementId: "G-XYT5LX4QJ4"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const app = document.getElementById('app');


// State Management
let currentState = 'login';
let currentUser = null; // { name: '...', role: 'user' | 'developer' }
let viewDate = new Date(); // 달력에서 보여지는 달
let selectedDate = new Date(); // 선택된 날짜
let currentMentor = null; // 현재 선택된 멘토 데이터
let selectedTime = "오전 10:00"; // 기본 선택 시간
let selectedLocation = "플러스 커뮤니티 라운지"; // 기본 장소
let selectedAddress = "서울특별시 마포구 연남동"; // 기본 주소
let tempImageData = null; // 업로드용 임시 이미지 데이터
let bookingHistory = []; // 예약 내역 저장 공간
let bookedTimes = []; // 이미 예약된 시간들을 담는 변수

// Mentors Data
const mentorsData = {
    realEstate: {
        id: 'realEstate',
        name: '이태호 & 박수진',
        title: '부동산·주거 행복 봉사팀',
        image: 'mentor_realestate_3d.png',
        bio: '15년 경력의 베테랑 공인중개사와 열정적인 청년 멘토가 한 조가 되어, 집 계약이나 이사로 고민하는 이웃을 돕습니다. 복잡한 등기부등본 확인부터 좋은 집 고르는 노하우까지, 2인 1조의 꼼꼼함으로 여러분의 새로운 시작을 응원합니다.',
        stats: { sessions: '500+', response: '30분 내', career: '전문가&청년' },
        space: { name: '플러스 정거장: 연남 아뜰리에', address: '서울특별시 마포구 동교로 123-45', desc: '이웃의 보금자리를 함께 고민하는 따뜻한 상담실' }
    },
    healing: {
        id: 'healing',
        name: '정지원 & 서민호',
        title: '마음 치유 미술 봉사팀',
        image: 'mentor_healing_3d.png',
        bio: '미술 치료 전문가와 숲 체험 전문가가 함께하는 2인 1조 치유팀입니다. 색채 활동과 자연 이야기를 통해 지친 마음을 어루만져 드립니다. 두 명의 멘토가 더 깊은 공감과 따뜻한 대화 시간을 선물해 드립니다.',
        stats: { sessions: '120+', response: '1시간 내', career: '전문가팀' },
        space: { name: '플러스 정거장: 숲속 대화방', address: '서울특별시 마포구 연남동 123-4', desc: '두 배의 위로가 있는 마음 치유 공간' }
    },
    legal: {
        id: 'legal',
        name: '강성현 & 최지현',
        title: '이웃 법률 수호 봉사팀',
        image: 'mentor_legal_3d.png',
        bio: '법률 분석가와 사회복지 전문가가 한 팀이 되어, 어렵고 딱딱한 법 문제를 이웃의 입장에서 쉽게 풀어드립니다. 법률 자문과 함께 실질적인 생활 지원 대책까지 2인 1조로 명쾌하고 든든하게 안내해 드립니다.',
        stats: { sessions: '300+', response: '2시간 내', career: '법률지원팀' },
        space: { name: '성현 법률 파트너스', address: '서울특별시 마포구 공덕동 456', desc: '당신의 권리를 함께 찾는 든든한 공간' }
    },
    tax: {
        id: 'tax',
        name: '한정우 & 윤준호',
        title: '스마트 자산 코칭 봉사팀',
        image: 'mentor_tax_3d.png',
        bio: '세무사와 자산 관리사가 짝을 이루어 복잡한 세금과 효율적인 돈 관리법을 알려드립니다. 한 분은 꼼꼼한 계산을, 한 분은 미래 설계를 맡아 2인 1조의 시너지로 여러분의 소중한 자산을 지켜드립니다.',
        stats: { sessions: '450+', response: '1시간 내', career: '세무금융팀' },
        space: { name: '정우 세무 컨설턴트', address: '서울특별시 마포구 서교동 789', desc: '부담 없는 세무 고민 해결소' }
    },
    insurance: {
        id: 'insurance',
        name: '신은주 & 오석준',
        title: '안심 보험 설계 봉사팀',
        image: 'mentor_insurance_3d.png',
        bio: '보험 분석과 손해 사정 분야의 두 멘토가 모여 여러분의 보험을 정직하게 진단합니다. 과다한 지출은 줄이고 보장은 탄탄하게 채우는 법을 2인 1조의 협업을 통해 투명하게 분석해 드립니다.',
        stats: { sessions: '280+', response: '1시간 내', career: '보험분석팀' },
        space: { name: '은주 보험 디자인룸', address: '서울특별시 마포구 성산동 101', desc: '나의 미래를 안심으로 채우는 공간' }
    },
    edu: {
        id: 'edu',
        name: '배미소 & 안다온',
        title: '꿈 키움 교육 컨설팅팀',
        image: 'mentor_edu_3d.png',
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
            <header class="header" style="background:transparent; box-shadow:none;">
                <button class="back-btn" onclick="navigateTo('login')">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
            </header>
            
            <div class="email-login-content p-3" style="margin-top:20px;">
                <h2 style="font-size: 26px; font-weight: 800; margin-bottom: 8px; color: #333;">로그인</h2>
                <p style="color: var(--text-dim); margin-bottom: 40px; font-size: 15px;">아이디 또는 이메일을 입력해 주세요.</p>
                
                <div class="input-group">
                    <label style="font-size:13px; font-weight:700; color:#555; margin-bottom:8px; display:block;">아이디 / 이메일</label>
                    <input type="text" id="login-email" placeholder="아이디 혹은 example@mail.com" style="width:100%; height:55px; border-radius:15px; border:1px solid #eee; padding:0 18px; background:#f9f9f9; font-size:15px;">
                </div>
                
                <div class="input-group mt-3">
                    <label style="font-size:13px; font-weight:700; color:#555; margin-bottom:8px; display:block;">비밀번호</label>
                    <input type="password" id="login-pw" placeholder="비밀번호를 입력하세요" style="width:100%; height:55px; border-radius:15px; border:1px solid #eee; padding:0 18px; background:#f9f9f9; font-size:15px;">
                </div>
                
                <div style="text-align: right; margin: 16px 0;">
                    <a href="#" style="font-size: 13px; color: var(--text-dim); text-decoration: none; font-weight:500;">비밀번호 찾기</a>
                </div>
                
                <button class="btn-primary mt-4" style="height:55px; border-radius:15px; font-size:16px; font-weight:700;" onclick="loginWithEmail()">로그인</button>
                
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
                    <p class="brand-tag">HEALING 2026</p>
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
            
                ${currentUser && currentUser.role === 'developer' ? `
                <button class="btn-admin-panel" onclick="navigateTo('adminDashboard')" style="margin-top: 16px; width: 100%; height: 50px; background: var(--text-main); color: white; border-radius: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: var(--shadow-soft);">
                    <i class="fa-solid fa-screwdriver-wrench"></i> 예약 현황 관리 (관리자)
                </button>
                ` : ''}

                ${currentUser && currentUser.role === 'mentor' ? `
                <button class="btn-admin-panel" onclick="navigateTo('mentorDashboard')" style="margin-top: 16px; width: 100%; height: 50px; background: var(--primary-dark); color: white; border-radius: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: var(--shadow-soft);">
                    <i class="fa-solid fa-clipboard-list"></i> 내 예약 확인 (멘토 전용)
                </button>
                ` : ''}
            </section>
            
            <div class="category-list">
                <div class="category-card item-real-estate" onclick="openMentor('realEstate')">
                    <div class="category-icon icon-real-estate">
                         <i class="fa-solid fa-house"></i>
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">부동산 · 주거 상담</h3>
                        <p class="category-desc">집 계약이나 이사 문제가 고민이에요</p>
                    </div>
                    <i class="fa-solid fa-chevron-right category-arrow"></i>
                </div>
                
                <div class="category-card item-healing" onclick="openMentor('healing')">
                    <div class="category-icon icon-healing">
                         <i class="fa-solid fa-heart"></i>
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">심리 상담 · 관계 개선</h3>
                        <p class="category-desc">나와 가족, 관계의 마음을 돌보고 싶어요</p>
                    </div>
                    <i class="fa-solid fa-chevron-right category-arrow"></i>
                </div>
                
                <div class="category-card item-legal" onclick="openMentor('legal')">
                    <div class="category-icon icon-legal">
                         <i class="fa-solid fa-scale-balanced"></i>
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">법률 자문 · 권리 구제</h3>
                        <p class="category-desc">억울하고 답답한 법적 문제가 생겼요</p>
                    </div>
                    <i class="fa-solid fa-chevron-right category-arrow"></i>
                </div>
                
                <div class="category-card item-tax" onclick="openMentor('tax')">
                    <div class="category-icon icon-tax">
                         <i class="fa-solid fa-calculator"></i>
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">세무 · 자산 관리</h3>
                        <p class="category-desc">복잡한 세금과 돈 관리가 막막해요</p>
                    </div>
                    <i class="fa-solid fa-chevron-right category-arrow"></i>
                </div>
                
                <div class="category-card item-insurance" onclick="openMentor('insurance')">
                    <div class="category-icon icon-insurance">
                         <i class="fa-solid fa-shield-heart"></i>
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">보험 진단 · 설계 상담</h3>
                        <p class="category-desc">내 보험, 제대로 들고 있는지 궁금해요</p>
                    </div>
                    <i class="fa-solid fa-chevron-right category-arrow"></i>
                </div>
                
                <div class="category-card item-edu" onclick="openMentor('edu')">
                    <div class="category-icon icon-edu">
                         <i class="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">교육 · 입시 · 진로</h3>
                        <p class="category-desc">우리 아이 교육과 진로 방향을 잡고 싶어요</p>
                    </div>
                    <i class="fa-solid fa-chevron-right category-arrow"></i>
                </div>
            </div>
            
            <nav class="bottom-nav">
                <div class="nav-item ${currentState === 'category' ? 'active' : ''}" onclick="navigateTo('category')">
                    <i class="fa-solid fa-house-chimney"></i>
                    <span>홈</span>
                </div>
                <div class="nav-item ${currentState === 'myBookings' ? 'active' : ''}" onclick="navigateTo('myBookings')">
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>예약내역</span>
                </div>
                <div class="nav-item ${currentState === 'settings' ? 'active' : ''}" onclick="navigateTo('settings')">
                    <i class="fa-solid fa-gear"></i>
                    <span>설정</span>
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
                    ${currentUser && currentUser.role === 'developer' ? `
                    <button class="share-btn" onclick="navigateTo('editMentor')" title="수정하기">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    ` : ''}
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

                <div class="mentor-stats ${currentUser && currentUser.role === 'developer' ? 'clickable-stats' : ''}" 
                     onclick="${currentUser && currentUser.role === 'developer' ? "navigateTo('editMentor')" : ""}" 
                     title="${currentUser && currentUser.role === 'developer' ? '클릭하여 수정' : ''}">
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
                        <p class="stat-value-large">${currentMentor.stats.career} ${currentUser && currentUser.role === 'developer' ? '<i class="fa-solid fa-pen" style="font-size:10px; color:var(--primary-color); vertical-align:middle; cursor:pointer;"></i>' : ''}</p>
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
                <div class="nav-item ${currentState === 'category' ? 'active' : ''}" onclick="navigateTo('category')">
                    <i class="fa-solid fa-house-chimney"></i>
                    <span>홈</span>
                </div>
                <div class="nav-item ${currentState === 'myBookings' ? 'active' : ''}" onclick="navigateTo('myBookings')">
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>예약내역</span>
                </div>
                <div class="nav-item ${currentState === 'settings' ? 'active' : ''}" onclick="navigateTo('settings')">
                    <i class="fa-solid fa-gear"></i>
                    <span>설정</span>
                </div>
            </nav>
        </div>
    `,
    booking: () => {
        const timeSlots = ["오전 10:00", "오전 11:30", "오후 01:00", "오후 02:30", "오후 04:00", "오후 05:30"];
        let timeChips = timeSlots.map(time => {
            const isBooked = bookedTimes.includes(time);
            return `
                <button class="time-chip ${selectedTime === time ? 'active' : ''} ${isBooked ? 'booked' : ''}" 
                        onclick="${isBooked ? '' : `selectTime('${time}')`}"
                        ${isBooked ? 'disabled' : ''}>
                    ${time}
                    ${isBooked ? '<span style="display:block; font-size:9px; opacity:0.7;">(예약완료)</span>' : ''}
                </button>
            `;
        }).join('');

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
                    <button class="btn-payment" onclick="navigateTo('payment')">
                        결정 완료 및 결제하기 <i class="fa-solid fa-chevron-right" style="font-size:12px; margin-left:4px;"></i>
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
        <div class="screen bookings-screen fade-in" style="background: #F8F9FA;">
            <header class="header">
                <h2 class="brand-name">마이 페이지</h2>
                <div class="profile-icon" style="background: var(--primary-color); color: white;">
                    <i class="fa-solid fa-user"></i>
                </div>
            </header>

            <div class="user-summary p-3" style="background: white; border-bottom-left-radius: 30px; border-bottom-right-radius: 30px; box-shadow: var(--shadow-soft);">
                <div style="display:flex; align-items:center; gap:16px; margin-bottom:10px;">
                    <div style="width:60px; height:60px; border-radius:50%; background:#eee; overflow:hidden;">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser ? currentUser.name : 'User'}" style="width:100%; height:100%;">
                    </div>
                    <div>
                        <h3 style="font-size:20px;">${currentUser ? currentUser.name : '로그인 세션 만료'}님</h3>
                        <p style="font-size:13px; color:var(--text-dim);">플러스 정거장과 함께 행복한 하루 되세요!</p>
                    </div>
                </div>
            </div>

            <div class="bookings-content p-3" id="user-booking-list">
                <!-- 로딩 중 표시 -->
                <div style="text-align: center; padding: 60px 20px;">
                    <i class="fa-solid fa-spinner fa-spin" style="font-size: 32px; color: var(--primary-color);"></i>
                    <p style="margin-top: 16px; color: var(--text-dim);">나의 예약 내역을 확인하는 중...</p>
                </div>
            </div>

            <!-- 안내 섹션 추가 -->
            <div class="notice-section p-3" style="margin-bottom: 100px;">
                <h4 style="font-size:16px; margin-bottom:16px; color:var(--text-main); padding-left:4px;">💡 예약 전 확인해 주세요!</h4>
                
                <div class="notice-card" style="background: white; border-radius: 20px; padding: 16px; margin-bottom: 12px; border-left: 4px solid var(--accent-color);">
                    <div style="display:flex; gap:12px;">
                        <i class="fa-solid fa-lightbulb" style="color:var(--accent-color); font-size:18px;"></i>
                        <div>
                            <p style="font-weight:700; font-size:14px; margin-bottom:4px;">상담 준비물</p>
                            <p style="font-size:12px; color:var(--text-dim); line-height:1.5;">필요한 서류나 필기도구를 미리 챙겨주시면 더욱 알찬 상담이 가능합니다.</p>
                        </div>
                    </div>
                </div>

                <div class="notice-card" style="background: white; border-radius: 20px; padding: 16px; border-left: 4px solid var(--primary-color);">
                    <div style="display:flex; gap:12px;">
                        <i class="fa-solid fa-circle-exclamation" style="color:var(--primary-color); font-size:18px;"></i>
                        <div>
                            <p style="font-weight:700; font-size:14px; margin-bottom:4px;">노쇼 및 취소 규정</p>
                            <p style="font-size:12px; color:var(--text-dim); line-height:1.5;">예약 시간 24시간 전까지는 취소가 가능합니다. 멘토님과의 소중한 시간을 지켜주세요!</p>
                        </div>
                    </div>
                </div>
            </div>

            <nav class="bottom-nav">
                <div class="nav-item ${currentState === 'category' ? 'active' : ''}" onclick="navigateTo('category')">
                    <i class="fa-solid fa-house-chimney"></i>
                    <span>홈</span>
                </div>
                <div class="nav-item ${currentState === 'myBookings' ? 'active' : ''}" onclick="navigateTo('myBookings')">
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>예약내역</span>
                </div>
                <div class="nav-item ${currentState === 'settings' ? 'active' : ''}" onclick="navigateTo('settings')">
                    <i class="fa-solid fa-gear"></i>
                    <span>설정</span>
                </div>
            </nav>
        </div>
    `,
    adminDashboard: () => `
        <div class="screen admin-screen fade-in">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('category')">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 class="title-center">전체 예약 현황 (관리자)</h2>
                <div style="width:40px;"></div>
            </header>

            <div class="admin-content p-3" id="admin-booking-list">
                <div style="text-align: center; padding: 100px 20px;">
                    <i class="fa-solid fa-spinner fa-spin" style="font-size: 32px; color: var(--primary-color);"></i>
                    <p style="margin-top: 16px; color: var(--text-dim);">예약 데이터를 불러오는 중...</p>
                </div>
            </div>
        </div>
    `,
    mentorDashboard: () => `
        <div class="screen admin-screen fade-in">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('category')">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 class="title-center">내 파트 예약 현황 (멘토)</h2>
                <div style="width:40px;"></div>
            </header>

            <div class="admin-content p-3" id="mentor-booking-list">
                <div style="text-align: center; padding: 100px 20px;">
                    <i class="fa-solid fa-spinner fa-spin" style="font-size: 32px; color: var(--primary-color);"></i>
                    <p style="margin-top: 16px; color: var(--text-dim);">상담 내역을 불러오는 중...</p>
                </div>
            </div>
        </div>
    `,
    settings: () => `
        <div class="screen settings-screen fade-in">
            <header class="header">
                <div class="brand-wrapper">
                    <h2 class="brand-name">설정</h2>
                </div>
                <div style="width:40px;"></div>
            </header>

            <div class="settings-content p-3">
                <div class="user-profile-card" style="background: white; border-radius: 20px; padding: 24px; display: flex; align-items: center; gap: 20px; margin-bottom: 24px; box-shadow: var(--shadow-soft);">
                    <div class="profile-avatar-wrapper">
                        <img id="settings-profile-img" src="${currentUser && currentUser.avatar ? currentUser.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser ? currentUser.name : 'Guest'}`}" class="settings-profile-img">
                        <div class="camera-badge" onclick="document.getElementById('profile-file-input').click()" title="사진 변경">
                            <i class="fa-solid fa-camera"></i>
                        </div>
                    </div>
                    <input type="file" id="profile-file-input" style="display:none;" accept="image/*" onchange="handleProfilePhotoChange(event)">
                    <div>
                        <h3 style="font-size: 18px; margin-bottom: 4px;">${currentUser ? currentUser.name : '사용자'}님</h3>
                        <p style="font-size: 13px; color: var(--text-dim);">${currentUser && currentUser.role === 'developer' ? '최고 관리자 권한' : (currentUser && currentUser.role === 'mentor' ? '멘토 권한' : '일반 회원')}</p>
                    </div>
                </div>

                <div class="settings-list" style="background: white; border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-soft);">
                    <div class="settings-item" onclick="navigateTo('editProfile')">
                        <span style="font-weight: 500;">개인정보 수정</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                    <div class="settings-item" onclick="navigateTo('notificationSettings')">
                        <span style="font-weight: 500;">알림 설정</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                    <div class="settings-item" onclick="navigateTo('announcements')">
                        <span style="font-weight: 500;">공지사항</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                    <div class="settings-item" style="color: #FF6B6B; font-weight: 700;" onclick="handleLogout()">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <i class="fa-solid fa-arrow-right-from-bracket"></i>
                            <span>로그아웃</span>
                        </div>
                    </div>
                </div>

                <p style="text-align: center; margin-top: 32px; font-size: 12px; color: #ccc;">버전 1.2.0 • 플러스 정거장</p>
            </div>

            <nav class="bottom-nav">
                <div class="nav-item ${currentState === 'category' ? 'active' : ''}" onclick="navigateTo('category')">
                    <i class="fa-solid fa-house-chimney"></i>
                    <span>홈</span>
                </div>
                <div class="nav-item ${currentState === 'myBookings' ? 'active' : ''}" onclick="navigateTo('myBookings')">
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>예약내역</span>
                </div>
                <div class="nav-item ${currentState === 'settings' ? 'active' : ''}" onclick="navigateTo('settings')">
                    <i class="fa-solid fa-gear"></i>
                    <span>설정</span>
                </div>
            </nav>
        </div>
    `,
    editProfile: () => `
        <div class="screen edit-profile-screen fade-in">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('settings')">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 class="title-center">개인정보 수정</h2>
                <div style="width:40px;"></div>
            </header>
            
            <div class="p-3">
                <div class="input-group" style="margin-bottom: 24px;">
                    <label style="font-size:13px; font-weight:700; color:#555; margin-bottom:8px; display:block;">이름</label>
                    <input type="text" id="edit-user-name" value="${currentUser ? currentUser.name : ''}" style="width:100%; height:55px; border-radius:15px; border:1px solid #eee; padding:0 18px; background:#f9f9f9; font-size:15px;">
                </div>
                
                <div class="input-group" style="margin-bottom: 32px;">
                    <label style="font-size:13px; font-weight:700; color:#555; margin-bottom:8px; display:block;">이메일</label>
                    <input type="email" value="${currentUser && currentUser.email ? currentUser.email : 'user@plus.com'}" disabled style="width:100%; height:55px; border-radius:15px; border:1px solid #eee; padding:0 18px; background:#f0f0f0; color:#999; font-size:15px;">
                    <p style="font-size:11px; color:#aaa; margin-top:8px; margin-left:4px;">이메일은 변경할 수 없습니다.</p>
                </div>
                
                <button class="btn-primary" style="height:55px; border-radius:15px; width:100%;" onclick="saveUserProfile()">변경사항 저장</button>
            </div>
        </div>
    `,
    notificationSettings: () => {
        if (!currentUser.settings) currentUser.settings = { push: true, marketing: false, night: true };
        const s = currentUser.settings;
        return `
        <div class="screen notification-screen fade-in">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('settings')">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 class="title-center">알림 설정</h2>
                <div style="width:40px;"></div>
            </header>
            
            <div class="p-3">
                <div class="settings-list" style="background: white; border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-soft);">
                    <div class="settings-item" onclick="toggleSetting('push', event)" style="padding: 24px 20px;">
                        <div>
                            <p style="font-weight: 500; margin-bottom: 2px;">푸시 알림</p>
                            <p style="font-size: 11px; color: var(--text-dim);">예약 확정 및 취소 알림</p>
                        </div>
                        <div class="toggle-switch ${s.push ? 'active' : ''}"></div>
                    </div>
                    <div class="settings-item" onclick="toggleSetting('marketing', event)" style="padding: 24px 20px;">
                        <div>
                            <p style="font-weight: 500; margin-bottom: 2px;">마케팅 정보 수신</p>
                            <p style="font-size: 11px; color: var(--text-dim);">새로운 멘토 및 이벤트 소식</p>
                        </div>
                        <div class="toggle-switch ${s.marketing ? 'active' : ''}"></div>
                    </div>
                    <div class="settings-item" onclick="toggleSetting('night', event)" style="padding: 24px 20px;">
                        <div>
                            <p style="font-weight: 500; margin-bottom: 2px;">야간 알림 제한</p>
                            <p style="font-size: 11px; color: var(--text-dim);">오후 9시 ~ 오전 8시 알림 끄기</p>
                        </div>
                        <div class="toggle-switch ${s.night ? 'active' : ''}"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    },
    announcements: () => `
        <div class="screen announcements-screen fade-in">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('settings')">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 class="title-center">공지사항</h2>
                <div style="width:40px;"></div>
            </header>
            
            ${currentUser && currentUser.role === 'developer' ? `
                <div class="p-3">
                    <div style="background: white; border-radius: 20px; padding: 20px; box-shadow: var(--shadow-soft); margin-bottom: 24px;">
                        <h3 style="font-size:16px; margin-bottom:16px; color:var(--primary-color);">
                            <i class="fa-solid fa-pen-nib"></i> 공지사항 작성 (관리자)
                        </h3>
                        <input type="text" id="notice-title" placeholder="제목을 입력하세요" style="width:100%; height:45px; border-radius:12px; border:1px solid #eee; padding:0 15px; margin-bottom:12px; font-size:14px;">
                        <textarea id="notice-content" placeholder="공지할 내용을 상세히 적어주세요" style="width:100%; height:100px; border-radius:12px; border:1px solid #eee; padding:12px 15px; margin-bottom:12px; font-size:14px; font-family:inherit; resize:none;"></textarea>
                        <button class="btn-primary" onclick="submitNotice()" style="width:100%; height:45px; font-size:14px;">공지 등록하기</button>
                    </div>
                </div>
            ` : ''}

            <div class="p-3" id="announcement-list" style="display: flex; flex-direction: column; gap: 16px; padding-top: ${currentUser && currentUser.role === 'developer' ? '0' : '20px'};">
                <!-- 공지 리스트가 여기에 렌더링됩니다 -->
            </div>
        </div>
    `,
    payment: () => `
        <div class="screen payment-screen fade-in">
            <header class="header">
                <button class="back-btn" onclick="navigateTo('booking')">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 class="title-center">결제하기</h2>
                <div style="width:40px;"></div>
            </header>

            <div class="p-3">
                <div class="payment-summary" style="background: white; border-radius: 20px; padding: 24px; box-shadow: var(--shadow-soft); margin-bottom: 24px; text-align: center;">
                    <p style="font-size: 14px; color: var(--text-dim); margin-bottom: 8px;">최종 결제 금액</p>
                    <h2 style="font-size: 32px; color: var(--primary-color); font-weight: 800;">2,000원</h2>
                    <p style="font-size: 12px; color: #aaa; margin-top: 12px;">멘토링 노쇼 방지를 위한 소액 책임비(다과비)입니다.</p>
                </div>

                <h3 style="font-size: 16px; margin-bottom: 16px; font-weight: 700;">결제 수단 선택</h3>
                
                <div class="payment-methods" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px;">
                    <div class="pay-method-card active" onclick="selectPayMethod(this)">
                        <i class="fa-solid fa-credit-card"></i>
                        <span>신용/체크카드</span>
                    </div>
                    <div class="pay-method-card" onclick="selectPayMethod(this)">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Kakao_logo.jpg" style="width:18px; height:18px; border-radius:4px; vertical-align:middle; margin-right:4px;" alt="">
                        <span>카카오페이</span>
                    </div>
                    <div class="pay-method-card" onclick="selectPayMethod(this)">
                        <i class="fa-solid fa-mobile-screen-button"></i>
                        <span>토스페이</span>
                    </div>
                    <div class="pay-method-card" onclick="selectPayMethod(this)">
                        <i class="fa-brands fa-paypal"></i>
                        <span>PayPal</span>
                    </div>
                </div>

                <div class="agree-section" style="margin-bottom: 32px;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" id="pay-agree" checked style="width:18px; height:18px; accent-color: var(--primary-color);">
                        <span style="font-size: 13px; color: #666;">위 결제 내용을 확인하였으며 본인 동의합니다.</span>
                    </label>
                </div>

                <button class="btn-primary" style="height: 60px; border-radius: 18px; width: 100%; font-size: 18px;" onclick="processPayment()">
                    보안 결제하기 <i class="fa-solid fa-lock" style="font-size:14px; margin-left:8px;"></i>
                </button>
                
                <p style="text-align: center; font-size: 11px; color: #bbb; margin-top: 20px;">
                    안전한 결제를 위해 암호화된 보안 서버를 이용합니다.
                </p>
            </div>
        </div>
    `
};

// Navigation Function
function navigateTo(screenId) {
    // 권한 체크: 수정 페이지는 개발자만 접근 가능
    if (screenId === 'editMentor') {
        if (!currentUser || currentUser.role !== 'developer') {
            alert('개발자(관리자) 권한이 필요한 페이지입니다.');
            return;
        }
    }

    currentState = screenId;
    const templateFn = screens[screenId];
    app.innerHTML = templateFn();
    window.scrollTo(0, 0);

    if (screenId === 'booking') {
        renderCalendar();
        checkBookedTimes(); // 예약된 시간대 불러오기
    }

    if (screenId === 'success') {
        const successLabel = document.getElementById('success-date-label');
        const formattedDate = `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;

        if (successLabel) {
            successLabel.innerText = `${formattedDate} · ${selectedTime}`;
        }

        // 예약 객체 생성
        const newBooking = {
            id: 'B' + Date.now(),
            date: formattedDate,
            time: selectedTime,
            service: currentMentor.id === 'healing' ? '마음 치유 세션' : currentMentor.title + ' 상담',
            mentorName: currentMentor.name,
            mentorId: currentMentor.id,
            userName: currentUser.name,
            location: selectedLocation,
            address: selectedAddress,
            status: '대기', // 기본 상태
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        // 로컬 히스토리에 추가
        bookingHistory.push(newBooking);

        // --- Firebase 예약 저장 ---
        // 최종 중복 체크 (결제 직전 한 번 더 확인)
        db.collection('bookings')
            .where('mentorId', '==', currentMentor.id)
            .where('date', '==', formattedDate)
            .where('time', '==', selectedTime)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    alert('앗! 그새 다른 분이 먼저 예약하셨네요. 다른 시간을 선택해 주세요.');
                    navigateTo('booking');
                    return;
                }

                db.collection('bookings').doc(newBooking.id).set(newBooking)
                    .then(() => console.log("예약 정보가 클라우드에 저장되었습니다."))
                    .catch(err => console.error("예약 저장 오류:", err));
            });
    }

    if (screenId === 'myBookings') {
        loadUserBookings();
    }

    if (screenId === 'adminDashboard') {
        loadAllBookings();
    }

    if (screenId === 'mentorDashboard') {
        loadMentorBookings();
    }

    if (screenId === 'announcements') {
        loadAnnouncements();
    }

    if (screenId === 'qrShare') {
        setTimeout(() => {
            const container = document.getElementById('qrcode-container');
            if (container && currentMentor) {
                container.innerHTML = "";
                // 현재 접속 중인 주소를 기반으로 멘토 아이디 파라미터 추가 (더 견고한 방식)
                const baseUrl = window.location.href.split('?')[0].split('#')[0];
                const shareUrl = `${baseUrl}?m=${currentMentor.id}`;

                new QRCode(container, {
                    text: shareUrl,
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

async function saveMentorSettings() {
    const name = document.getElementById('edit-name').value;
    const title = document.getElementById('edit-title').value;
    const bio = document.getElementById('edit-bio').value;

    if (!name || !title) {
        alert('이름과 직함을 입력해 주세요.');
        return;
    }

    // 로컬 데이터 선반영
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

    // --- Firebase 저장 로직 추가 ---
    try {
        await db.collection('mentors').doc(currentMentor.id).set(currentMentor);
        alert('프로필이 성공적으로 수정되었으며 클라우드에 저장되었습니다! ✨');
    } catch (error) {
        console.error("Firebase 저장 Error:", error);
        alert('로컬에 저장되었지만, 클라우드 저장에 실패했습니다. (나중에 다시 시도해 주세요)');
    }

    tempImageData = null; // 저장 후 초기화
    navigateTo('mentor');
}

function shareMentorProfile() {
    navigateTo('qrShare');
}

function shareMentorProfileOriginal() {
    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const shareUrl = `${baseUrl}?m=${currentMentor.id}`;
    if (navigator.share) {
        navigator.share({
            title: `플러스 정거장 - ${currentMentor.name} 멘토`,
            text: `${currentMentor.title} ${currentMentor.name} 멘토님을 소개합니다.`,
            url: shareUrl,
        })
            .then(() => console.log('공유 성공'))
            .catch((error) => console.log('공유 실패', error));
    } else {
        // Web Share API를 지원하지 않는 경우 클립보드 복사
        const dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.value = shareUrl;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        alert("멘토 프로필 링크가 클립보드에 복사되었습니다. ✨");
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
    selectedTime = null; // 날짜가 바뀌면 선택된 시간 초기화
    renderCalendar();
    checkBookedTimes(); // 날짜 선택 시 즉시 중복 시간 체크
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
window.loginWithEmail = loginWithEmail;
window.updateBookingStatus = updateBookingStatus;
window.checkBookedTimes = checkBookedTimes;
window.loadUserBookings = loadUserBookings;

// --- User MyPage Logic ---
async function loadUserBookings() {
    const listContainer = document.getElementById('user-booking-list');
    if (!listContainer || !currentUser) return;

    try {
        const snapshot = await db.collection('bookings')
            .where('userName', '==', currentUser.name)
            .get();

        if (snapshot.empty) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <i class="fa-regular fa-calendar-xmark" style="font-size: 50px; color: var(--primary-light); margin-bottom: 16px; display: block;"></i>
                    <p style="color: var(--text-dim);">아직 신청하신 예약이 없습니다.<br>멘토님들이 당신을 기다리고 있어요!</p>
                    <button class="btn-primary mt-3" style="width: auto; padding: 0 32px;" onclick="navigateTo('category')">상담 신청하기</button>
                </div>
            `;
            return;
        }

        // 로컬에서 정렬
        const bookings = [];
        snapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });
        bookings.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

        let html = '<div class="history-list">';
        bookings.forEach(booking => {
            const isCancelled = booking.status === '취소';
            const isCompleted = booking.status === '완료';

            let statusBg = 'var(--primary-light)';
            let statusColor = 'var(--primary-dark)';

            if (isCancelled) {
                statusBg = '#FFEEEE';
                statusColor = '#FF6B6B';
            } else if (isCompleted) {
                statusBg = '#eee';
                statusColor = '#999';
            }

            html += `
                <div class="history-item" style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 16px; box-shadow: var(--shadow-soft); ${isCancelled ? 'opacity: 0.7;' : ''}">
                    <div style="display:flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div>
                            <h4 style="font-size: 16px; margin-bottom: 4px; ${isCancelled ? 'text-decoration: line-through;' : ''}">${booking.mentorName} 멘토</h4>
                            <p style="font-size: 12px; color: var(--primary-dark); font-weight: 700;">${booking.service}</p>
                        </div>
                        <span style="background: ${statusBg}; color: ${statusColor}; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 20px;">${booking.status}</span>
                    </div>
                    <div style="border-top: 1px dashed #eee; padding-top: 12px; font-size: 13px; color: var(--text-dim);">
                        <p style="display:flex; align-items:center; gap:8px;"><i class="fa-regular fa-clock" style="color:var(--primary-color);"></i> ${booking.date} · ${booking.time}</p>
                        <p style="display:flex; align-items:start; gap:8px; margin-top: 6px;"><i class="fa-solid fa-location-dot" style="color:var(--primary-color);"></i> <span>${booking.location}<br><small style="color:var(--text-light);">${booking.address}</small></span></p>
                    </div>
                    ${(!isCancelled && !isCompleted) ? `
                    <div style="margin-top:16px; display:flex; gap:8px;">
                        <button style="flex:1; height:34px; border-radius:10px; border:1px solid #eee; background:white; font-size:12px; font-weight:600; color:var(--text-dim);" onclick="alert('준비물: 간단한 본인 소개와 궁금한 점을 메모해오세요!')">준비물 확인</button>
                        <button style="flex:1; height:34px; border-radius:10px; border:1px solid #eee; background:white; font-size:12px; font-weight:600; color:#FF6B6B;" onclick="cancelBooking('${booking.id}')">예약 취소</button>
                    </div>
                    ` : ''}
                </div>
            `;
        });
        html += '</div>';
        listContainer.innerHTML = html;
    } catch (err) {
        console.error("사용자 예약 로드 실패:", err);
        listContainer.innerHTML = `<p style="padding:40px; text-align:center; color:red;">데이터를 불러오지 못했습니다.</p>`;
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('정말로 이 예약을 취소하시겠습니까?')) return;

    try {
        await db.collection('bookings').doc(bookingId).update({
            status: '취소',
            cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert('예약이 성공적으로 취소되었습니다.');
        loadUserBookings(); // 내역 새로고침
    } catch (err) {
        console.error("예약 취소 오류:", err);
        alert('예약 취소 중 오류가 발생했습니다.');
    }
}

// --- Double Booking Prevention ---
async function checkBookedTimes() {
    if (!currentMentor || !selectedDate) return;

    const formattedDate = `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;

    try {
        const snapshot = await db.collection('bookings')
            .where('mentorId', '==', currentMentor.id)
            .where('date', '==', formattedDate)
            .get();

        bookedTimes = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.status !== '취소') {
                bookedTimes.push(data.time);
            }
        });

        // 현재 화면이 예약 화면이라면 리렌더링하여 버튼 비활성화 반영
        if (currentState === 'booking') {
            const templateFn = screens['booking'];
            app.innerHTML = templateFn();
            renderCalendar();
        }
    } catch (err) {
        console.error("예약 내역 조회 오류:", err);
    }
}

// --- Admin Dashboard Logic ---
async function loadAllBookings() {
    const listContainer = document.getElementById('admin-booking-list');
    if (!listContainer) return;

    try {
        // 인덱스 오류 방지: orderBy를 빼고 전체를 가져온 뒤 로컬에서 정렬
        const snapshot = await db.collection('bookings').get();
        if (snapshot.empty) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 100px 20px; color: var(--text-light);">
                    <i class="fa-regular fa-calendar-xmark" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>현재 접수된 예약이 없습니다.</p>
                </div>
            `;
            return;
        }

        // 데이터를 배열로 변환 후 정렬
        const bookings = [];
        snapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });
        bookings.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

        let html = '';
        bookings.forEach(booking => {
            const statusColor = booking.status === '완료' ? '#aaa' : 'var(--primary-color)';

            html += `
                <div class="admin-booking-card" style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 20px; box-shadow: var(--shadow-soft); border-left: 5px solid ${statusColor};">
                    <div style="display:flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-size: 12px; color: var(--text-dim);">${booking.id}</span>
                        <select onchange="updateBookingStatus('${booking.id}', this.value)" style="border:none; background: #f8f9fa; border-radius: 8px; padding: 4px 8px; font-size: 12px; font-weight:700;">
                            <option value="대기" ${booking.status === '대기' ? 'selected' : ''}>⏳ 대기</option>
                            <option value="확정" ${booking.status === '확정' ? 'selected' : ''}>✅ 확정</option>
                            <option value="완료" ${booking.status === '완료' ? 'selected' : ''}>🏁 완료</option>
                            <option value="취소" ${booking.status === '취소' ? 'selected' : ''}>❌ 취소</option>
                        </select>
                    </div>
                    <h3 style="font-size: 18px; margin-bottom: 8px;">${booking.userName} 님의 예약</h3>
                    <p style="font-size: 14px; margin-bottom: 12px; color: var(--primary-dark); font-weight:700;">${booking.service} (멘토: ${booking.mentorName})</p>
                    
                    <div style="background: #fdfcf0; padding: 12px; border-radius: 12px; font-size: 13px; line-height: 1.6;">
                        <p>📅 <strong>날짜:</strong> ${booking.date}</p>
                        <p>⏰ <strong>시간:</strong> ${booking.time}</p>
                        <p>📍 <strong>장소:</strong> ${booking.location}</p>
                        <p>🏠 <strong>주소:</strong> ${booking.address}</p>
                    </div>
                    
                    <div style="margin-top: 12px; display: flex; gap: 8px;">
                        <button class="btn-secondary" style="height: 36px; font-size: 12px; flex: 1;" onclick="alert('${booking.userName} 님께 연락 중...')">연락하기</button>
                        <button class="btn-primary" style="height: 36px; font-size: 12px; flex: 1; background: #eee; color: #666; box-shadow:none;" onclick="alert('메모 기능 준비 중입니다.')">메모</button>
                    </div>
                </div>
            `;
        });
        listContainer.innerHTML = html;
    } catch (err) {
        console.error("예약 목록 불러오기 실패:", err);
        listContainer.innerHTML = `<p style="text-align:center; color:red; padding: 40px;">데이터를 불러오는 중 오류가 발생했습니다.</p>`;
    }
}

async function updateBookingStatus(bookingId, newStatus) {
    try {
        await db.collection('bookings').doc(bookingId).update({ status: newStatus });
        alert(`상태가 [${newStatus}]로 업데이트되었습니다.`);

        // 대시보드 새로고침 (어느 화면이냐에 따라)
        if (currentState === 'adminDashboard') loadAllBookings();
        if (currentState === 'mentorDashboard') loadMentorBookings();
    } catch (err) {
        console.error("상태 업데이트 실패:", err);
        alert("상태 업데이트에 실패했습니다.");
    }
}

// --- Mentor Dashboard Logic ---
async function loadMentorBookings() {
    const listContainer = document.getElementById('mentor-booking-list');
    if (!listContainer || !currentUser || !currentUser.mentorId) return;

    try {
        // 인덱스 오류 방지: 서버 정렬 대신 클라이언트 정렬
        const snapshot = await db.collection('bookings')
            .where('mentorId', '==', currentUser.mentorId)
            .get();

        if (snapshot.empty) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 100px 20px; color: var(--text-light);">
                    <i class="fa-regular fa-calendar-check" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>아직 담당 파트에 들어온<br>예약이 없습니다.</p>
                </div>
            `;
            return;
        }

        // 로컬에서 정렬
        const bookings = [];
        snapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });
        bookings.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

        let html = `
            <div class="mentor-badge-info" style="background: var(--primary-light); color: var(--primary-dark); padding: 12px; border-radius: 12px; margin-bottom: 20px; font-size: 13px; font-weight: 700;">
                📢 ${mentorsData[currentUser.mentorId].name} 멘토님,<br>현재 담당 파트 예약 건수: ${bookings.length}건
            </div>
        `;

        bookings.forEach(booking => {
            const statusColor = booking.status === '완료' ? '#aaa' : 'var(--primary-color)';

            html += `
                <div class="admin-booking-card" style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 20px; box-shadow: var(--shadow-soft); border-left: 5px solid ${statusColor};">
                    <div style="display:flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-size: 11px; color: var(--text-dim);">${booking.id}</span>
                        <select onchange="updateBookingStatus('${booking.id}', this.value)" style="border:none; background: #f8f9fa; border-radius: 8px; padding: 4px 8px; font-size: 12px; font-weight:700;">
                            <option value="대기" ${booking.status === '대기' ? 'selected' : ''}>⏳ 대기</option>
                            <option value="확정" ${booking.status === '확정' ? 'selected' : ''}>✅ 확정</option>
                            <option value="완료" ${booking.status === '완료' ? 'selected' : ''}>🏁 완료</option>
                            <option value="취소" ${booking.status === '취소' ? 'selected' : ''}>❌ 취소</option>
                        </select>
                    </div>
                    <h3 style="font-size: 16px; margin-bottom: 4px;">${booking.userName} 님</h3>
                    
                    <div style="margin-top: 10px; font-size: 13px; line-height: 1.6;">
                        <p>📅 <strong>날짜:</strong> ${booking.date}</p>
                        <p>⏰ <strong>시간:</strong> ${booking.time}</p>
                        <p>📍 <strong>장소:</strong> ${booking.location}</p>
                    </div>
                    
                    <button class="btn-primary mt-2" style="height: 40px; font-size: 13px; background: var(--primary-dark);" onclick="alert('${booking.userName} 님께 곧 메시지를 전송합니다.')">상담 수락 및 연락</button>
                </div>
            `;
        });
        listContainer.innerHTML = html;
    } catch (err) {
        console.error("멘토 예약 목록 불러오기 실패:", err);
        listContainer.innerHTML = `<p style="text-align:center; color:red; padding: 40px;">데이터를 불러오는 중 오류가 발생했습니다.<br><small>Firebase 인덱스 생성이 필요할 수 있습니다.</small></p>`;
    }
}

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
        currentUser = { name: '일반 사용자', role: 'user' };
        alert(`${provider} 계정으로 로그인이 완료되었습니다!\n플러스 정거장에 오신 것을 환영합니다. 😊`);
        navigateTo('category');
    }, 1500);
}

function loginWithEmail() {
    const email = document.getElementById('login-email').value;
    const pw = document.getElementById('login-pw').value;

    if (!email) {
        alert('이메일을 입력해 주세요.');
        return;
    }

    // --- 계정 시뮬레이션 확장 ---

    // 1. 개발자(관리자)
    if (email === 'lookup10@naver.com' && pw === 'lookup1004') {
        currentUser = { name: '개발자님', role: 'developer' };
        alert('개발자 계정으로 로그인되었습니다. 모든 예약 열람 및 수정 권한이 활성화됩니다.');
    }
    // 2. 멘토 계정들 (비번: mentor123 공통)
    // 이메일(@plus.com) 혹은 간편 아이디(realestate 등) 지원
    else {
        const categoriesMap = {
            'realestate': 'realEstate',
            'healing': 'healing',
            'legal': 'legal',
            'tax': 'tax',
            'insurance': 'insurance',
            'edu': 'edu'
        };

        const inputLower = email.toLowerCase().replace('@plus.com', '');
        const categoryKey = categoriesMap[inputLower];

        if (categoryKey && pw === 'mentor123') {
            currentUser = {
                name: mentorsData[categoryKey].name.split('&')[0].trim() + ' 멘토님',
                role: 'mentor',
                mentorId: categoryKey
            };
            alert(`${currentUser.name}으로 오신 것을 환영합니다. 담당 파트 예약을 관리해 보세요.`);
        }
        // 3. 일반 사용자
        else {
            currentUser = { name: '이메일 사용자', role: 'user' };
            alert('일반 사용자로 로그인되었습니다.');
        }
    }

    navigateTo('category');
}

window.handleLogin = handleLogin;

// --- Firebase Data Synchronization ---
async function syncMentorsWithFirebase() {
    try {
        const snapshot = await db.collection('mentors').get();
        if (snapshot.empty) {
            // 처음 실행 시 기본 데이터 업로드
            console.log("Firebase가 비어있습니다. 초기 데이터를 업로드합니다.");
            for (const key in mentorsData) {
                await db.collection('mentors').doc(key).set(mentorsData[key]);
            }
        } else {
            // 클라우드 데이터 가져와서 반영
            snapshot.forEach(doc => {
                const data = doc.data();
                if (mentorsData[doc.id]) {
                    mentorsData[doc.id] = data;
                }
            });
            console.log("Firebase에서 최신 데이터를 불러왔습니다.");
        }
    } catch (error) {
        console.error("데이터 동기화 오류:", error);
    }
}

function handleLogout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        currentUser = null;
        navigateTo('login');
    }
}

// Profile Photo Change Function for Settings
function handleProfilePhotoChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (currentUser) {
                currentUser.avatar = e.target.result;
                const img = document.getElementById('settings-profile-img');
                if (img) img.src = e.target.result;
                alert('프로필 사진이 성공적으로 변경되었습니다! ✨');
            }
        };
        reader.readAsDataURL(file);
    }
}

function saveUserProfile() {
    const newName = document.getElementById('edit-user-name').value;
    if (newName.trim() === '') {
        alert('이름을 입력해 주세요.');
        return;
    }
    if (currentUser) {
        currentUser.name = newName;
        alert('회원 정보가 저장되었습니다. ✨');
        navigateTo('settings');
    }
}

// Settings Toggle Function
function toggleSetting(key, event) {
    if (event) {
        event.stopPropagation();
    }

    if (!currentUser.settings) {
        currentUser.settings = { push: true, marketing: false, night: true };
    }

    // 해당 설정값 반전
    currentUser.settings[key] = !currentUser.settings[key];

    // UI 즉시 반영 (전체 화면 갱신 대신 DOM 직접 조작으로 더 부드럽게)
    const item = event ? event.currentTarget : null;
    if (item) {
        const toggle = item.querySelector('.toggle-switch');
        if (toggle) {
            if (currentUser.settings[key]) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }
        }
    } else {
        // 이벤트를 못 잡은 경우 전체 갱신
        navigateTo('notificationSettings');
    }

    console.log(`알림 설정 변경: ${key} -> ${currentUser.settings[key]}`);
}

// Announcement Functions
async function submitNotice() {
    const title = document.getElementById('notice-title').value;
    const content = document.getElementById('notice-content').value;

    if (!title || !content) {
        alert('제목과 내용을 모두 입력해 주세요. 😊');
        return;
    }

    try {
        await db.collection('notices').add({
            title,
            content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            isNew: true
        });
        alert('공지사항이 성공적으로 등록되었습니다! 📢');
        loadAnnouncements(); // Refresh list
    } catch (error) {
        console.error("공지 등록 오류:", error);
        alert('앗, 등록 중에 문제가 발생했어요. 다시 시도해 주세요.');
    }
}

async function loadAnnouncements() {
    const list = document.getElementById('announcement-list');
    if (!list) return;

    list.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 32px; color: var(--primary-color);"></i>
        </div>
    `;

    try {
        const snapshot = await db.collection('notices').orderBy('timestamp', 'desc').get();
        if (snapshot.empty) {
            list.innerHTML = `
                <div style="text-align:center; padding: 60px 24px; color: #bbb;">
                    <i class="fa-regular fa-bell-slash" style="font-size:40px; margin-bottom: 16px; opacity:0.3;"></i>
                    <p>등록된 공지사항이 아직 없어요.<br>소중한 소식을 기다려 주세요!</p>
                </div>
            `;
            return;
        }

        list.innerHTML = snapshot.docs.map(doc => {
            const data = doc.data();
            const dateStr = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString('ko-KR', {
                year: 'numeric', month: '2-digit', day: '2-digit'
            }) : '방금 전';

            return `
                <div class="notice-card" style="background: white; border-radius: 20px; padding: 20px; box-shadow: var(--shadow-soft); position:relative;">
                    ${data.isNew ? '<span style="font-size: 11px; color: var(--primary-color); font-weight: 700; background: var(--primary-light); padding: 4px 10px; border-radius: 10px;">New</span>' : ''}
                    <h4 style="margin: 12px 0 8px; font-size: 16px; color:#333;">${data.title}</h4>
                    <p style="font-size: 13px; color: var(--text-dim); line-height: 1.5; word-break: break-all;">${data.content}</p>
                    <p style="font-size: 11px; color: #ccc; margin-top: 12px;">${dateStr}</p>
                    ${currentUser && currentUser.role === 'developer' ? `
                        <button onclick="deleteNotice('${doc.id}')" style="position:absolute; top:20px; right:20px; background:none; border:none; color:#FF6B6B; cursor:pointer;">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error("공지 로딩 오류:", error);
        list.innerHTML = '<p style="text-align:center; padding:40px; color:#FF6B6B;">공지사항을 가져오는 데 실패했습니다.</p>';
    }
}

async function deleteNotice(id) {
    if (confirm('이 공지사항을 삭제할까요?')) {
        try {
            await db.collection('notices').doc(id).delete();
            loadAnnouncements();
        } catch (error) {
            alert('삭제 중에 오류가 발생했습니다.');
        }
    }
}

// Payment Functions
function selectPayMethod(el) {
    document.querySelectorAll('.pay-method-card').forEach(card => card.classList.remove('active'));
    el.classList.add('active');
}

function processPayment() {
    const agree = document.getElementById('pay-agree').checked;
    if (!agree) {
        alert('결제 약관에 동의해 주세요.');
        return;
    }

    // 결제 시뮬레이션
    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 결제 처리 중...';

    setTimeout(() => {
        navigateTo('success');
    }, 1500);
}

// Global scope expose
window.handleProfilePhotoChange = handleProfilePhotoChange;
window.saveUserProfile = saveUserProfile;
window.toggleSetting = toggleSetting;
window.submitNotice = submitNotice;
window.deleteNotice = deleteNotice;
window.selectPayMethod = selectPayMethod;
window.processPayment = processPayment;

// Initial Rendering
document.addEventListener('DOMContentLoaded', async () => {
    // 1. URL 파라미터 확인 (쿼리문 ?m= 혹은 해시 #m= 모두 지원)
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));

    const mIdRaw = urlParams.get('m') || hashParams.get('m');
    const view = urlParams.get('v') || hashParams.get('v');

    // 2. 백그라운드에서 Firebase 데이터 불러오기
    await syncMentorsWithFirebase();

    // 3. 파라미터에 따라 초기 화면 결정
    if (mIdRaw) {
        // 대소문자 구분 없이 멘토 데이터 매칭
        const mentorKey = Object.keys(mentorsData).find(
            key => key.toLowerCase() === mIdRaw.toLowerCase()
        );

        if (mentorKey) {
            openMentor(mentorKey);
            return;
        }
    }

    if (view) {
        navigateTo(view);
    } else {
        navigateTo('login');
    }
});

