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
                
                <button class="btn-primary mt-3" onclick="loginWithEmail()">로그인</button>
                
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

    const templateFn = screens[screenId];
    app.innerHTML = templateFn();
    currentState = screenId;
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
            .orderBy('timestamp', 'desc')
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

        let html = '<div class="history-list">';
        snapshot.forEach(doc => {
            const booking = doc.data();
            const statusBg = booking.status === '완료' ? '#eee' : 'var(--primary-light)';
            const statusColor = booking.status === '완료' ? '#999' : 'var(--primary-dark)';

            html += `
                <div class="history-item" style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 16px; box-shadow: var(--shadow-soft);">
                    <div style="display:flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div>
                            <h4 style="font-size: 16px; margin-bottom: 4px;">${booking.mentorName} 멘토</h4>
                            <p style="font-size: 12px; color: var(--primary-dark); font-weight: 700;">${booking.service}</p>
                        </div>
                        <span style="background: ${statusBg}; color: ${statusColor}; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 20px;">${booking.status}</span>
                    </div>
                    <div style="border-top: 1px dashed #eee; padding-top: 12px; font-size: 13px; color: var(--text-dim);">
                        <p style="display:flex; align-items:center; gap:8px;"><i class="fa-regular fa-clock" style="color:var(--primary-color);"></i> ${booking.date} · ${booking.time}</p>
                        <p style="display:flex; align-items:start; gap:8px; margin-top: 6px;"><i class="fa-solid fa-location-dot" style="color:var(--primary-color);"></i> <span>${booking.location}<br><small style="color:var(--text-light);">${booking.address}</small></span></p>
                    </div>
                    ${booking.status !== '완료' ? `
                    <div style="margin-top:16px; display:flex; gap:8px;">
                        <button style="flex:1; height:34px; border-radius:10px; border:1px solid #eee; background:white; font-size:12px; font-weight:600; color:var(--text-dim);" onclick="alert('준비물: 간단한 본인 소개와 궁금한 점을 메모해오세요!')">준비물 확인</button>
                        <button style="flex:1; height:34px; border-radius:10px; border:1px solid #eee; background:white; font-size:12px; font-weight:600; color:#FF6B6B;" onclick="alert('취소는 관리자에게 문의해주세요.')">예약 취소</button>
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
        const snapshot = await db.collection('bookings').orderBy('timestamp', 'desc').get();
        if (snapshot.empty) {
            listContainer.innerHTML = `
                <div style="text-align: center; padding: 100px 20px; color: var(--text-light);">
                    <i class="fa-regular fa-calendar-xmark" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>현재 접수된 예약이 없습니다.</p>
                </div>
            `;
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const booking = doc.data();
            const statusColor = booking.status === '완료' ? '#aaa' : 'var(--primary-color)';

            html += `
                <div class="admin-booking-card" style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 20px; box-shadow: var(--shadow-soft); border-left: 5px solid ${statusColor};">
                    <div style="display:flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-size: 12px; color: var(--text-dim);">${booking.id}</span>
                        <select onchange="updateBookingStatus('${doc.id}', this.value)" style="border:none; background: #f8f9fa; border-radius: 8px; padding: 4px 8px; font-size: 12px; font-weight:700;">
                            <option value="대기" ${booking.status === '대기' ? 'selected' : ''}>⏳ 대기</option>
                            <option value="확정" ${booking.status === '확정' ? 'selected' : ''}>✅ 확정</option>
                            <option value="완료" ${booking.status === '완료' ? 'selected' : ''}>🏁 완료</option>
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
        // 본인의 mentorId와 일치하는 예약만 가져오기
        const snapshot = await db.collection('bookings')
            .where('mentorId', '==', currentUser.mentorId)
            .orderBy('timestamp', 'desc')
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

        let html = `
            <div class="mentor-badge-info" style="background: var(--primary-light); color: var(--primary-dark); padding: 12px; border-radius: 12px; margin-bottom: 20px; font-size: 13px; font-weight: 700;">
                📢 ${mentorsData[currentUser.mentorId].name} 멘토님,<br>현재 담당 파트 예약 건수: ${snapshot.size}건
            </div>
        `;

        snapshot.forEach(doc => {
            const booking = doc.data();
            const statusColor = booking.status === '완료' ? '#aaa' : 'var(--primary-color)';

            html += `
                <div class="admin-booking-card" style="background: white; border-radius: 20px; padding: 20px; margin-bottom: 20px; box-shadow: var(--shadow-soft); border-left: 5px solid ${statusColor};">
                    <div style="display:flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-size: 11px; color: var(--text-dim);">${booking.id}</span>
                        <select onchange="updateBookingStatus('${doc.id}', this.value)" style="border:none; background: #f8f9fa; border-radius: 8px; padding: 4px 8px; font-size: 12px; font-weight:700;">
                            <option value="대기" ${booking.status === '대기' ? 'selected' : ''}>⏳ 대기</option>
                            <option value="확정" ${booking.status === '확정' ? 'selected' : ''}>✅ 확정</option>
                            <option value="완료" ${booking.status === '완료' ? 'selected' : ''}>🏁 완료</option>
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
    else if (email.endsWith('@plus.com') && pw === 'mentor123') {
        const category = email.split('@')[0];
        const categories = ['realEstate', 'healing', 'legal', 'tax', 'insurance', 'edu'];

        if (categories.includes(category)) {
            currentUser = {
                name: mentorsData[category].name.split('&')[0].trim() + ' 멘토님',
                role: 'mentor',
                mentorId: category
            };
            alert(`${currentUser.name}으로 오신 것을 환영합니다. 담당 파트 예약을 관리해 보세요.`);
        } else {
            currentUser = { name: '일반 사용자', role: 'user' };
            alert('멘토 계정이 확인되지 않아 일반 사용자로 로그인되었습니다.');
        }
    }
    // 3. 일반 사용자
    else {
        currentUser = { name: '이메일 사용자', role: 'user' };
        alert('일반 사용자로 로그인되었습니다.');
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

// Initial Rendering
document.addEventListener('DOMContentLoaded', async () => {
    // 1. 로그인 화면 먼저 보여주기
    navigateTo('login');

    // 2. 백그라운드에서 Firebase 데이터 불러오기
    await syncMentorsWithFirebase();
});

