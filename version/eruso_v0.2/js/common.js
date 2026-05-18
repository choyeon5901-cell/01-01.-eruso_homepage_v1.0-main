// 조치원 스마트 약배송 서비스 - 공통 JavaScript

// 현재 로그인한 사용자 (시뮬레이션용)
let currentUser = null;

// API 베이스 URL
const API_BASE = 'tables';

// 로컬 스토리지에서 사용자 정보 가져오기
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// 로컬 스토리지에 사용자 정보 저장
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;
}

// 로그아웃
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'index.html';
}

// 날짜 포맷팅
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 날짜를 간단하게 표시
function formatDateShort(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// 처방전 상태 한글 변환
function getStatusText(status) {
    const statusMap = {
        'issued': '발행됨',
        'received': '접수완료',
        'preparing': '조제중',
        'delivering': '배송중',
        'completed': '완료',
        'cancelled': '취소됨',
        'pending': '대기중',
        'picked_up': '픽업완료',
        'in_transit': '배송중',
        'delivered': '배송완료',
        'failed': '배송실패',
        'active': '활성',
        'inactive': '비활성'
    };
    return statusMap[status] || status;
}

// 처방전 상태 배지 클래스
function getStatusBadgeClass(status) {
    const classMap = {
        'issued': 'badge-info',
        'received': 'badge-warning',
        'preparing': 'badge-warning',
        'delivering': 'badge-info',
        'completed': 'badge-success',
        'cancelled': 'badge-danger',
        'pending': 'badge-secondary',
        'picked_up': 'badge-warning',
        'in_transit': 'badge-info',
        'delivered': 'badge-success',
        'failed': 'badge-danger',
        'active': 'badge-success',
        'inactive': 'badge-secondary'
    };
    return classMap[status] || 'badge-secondary';
}

// UUID 생성
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// API 호출 함수들
async function fetchTableData(tableName, page = 1, limit = 100) {
    try {
        const response = await fetch(`${API_BASE}/${tableName}?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('데이터를 가져오는데 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        showAlert('데이터를 불러오는데 실패했습니다.', 'danger');
        return null;
    }
}

async function getRecord(tableName, recordId) {
    try {
        const response = await fetch(`${API_BASE}/${tableName}/${recordId}`);
        if (!response.ok) throw new Error('데이터를 가져오는데 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error('Error getting record:', error);
        showAlert('데이터를 불러오는데 실패했습니다.', 'danger');
        return null;
    }
}

async function createRecord(tableName, data) {
    try {
        const response = await fetch(`${API_BASE}/${tableName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('데이터 생성에 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error('Error creating record:', error);
        showAlert('데이터 생성에 실패했습니다.', 'danger');
        return null;
    }
}

async function updateRecord(tableName, recordId, data) {
    try {
        const response = await fetch(`${API_BASE}/${tableName}/${recordId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('데이터 업데이트에 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error('Error updating record:', error);
        showAlert('데이터 업데이트에 실패했습니다.', 'danger');
        return null;
    }
}

async function patchRecord(tableName, recordId, data) {
    try {
        const response = await fetch(`${API_BASE}/${tableName}/${recordId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('데이터 업데이트에 실패했습니다.');
        return await response.json();
    } catch (error) {
        console.error('Error patching record:', error);
        showAlert('데이터 업데이트에 실패했습니다.', 'danger');
        return null;
    }
}

async function deleteRecord(tableName, recordId) {
    try {
        const response = await fetch(`${API_BASE}/${tableName}/${recordId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('데이터 삭제에 실패했습니다.');
        return true;
    } catch (error) {
        console.error('Error deleting record:', error);
        showAlert('데이터 삭제에 실패했습니다.', 'danger');
        return false;
    }
}

// 알림 표시
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// 모달 열기
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// 모달 닫기
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// 페이지 초기화 시 사용자 정보 로드
document.addEventListener('DOMContentLoaded', () => {
    currentUser = getCurrentUser();
    
    // 로그아웃 버튼 이벤트
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('로그아웃 하시겠습니까?')) {
                logout();
            }
        });
    }
    
    // 모달 외부 클릭시 닫기
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});

// ==================== 검색 기능 ====================

// 배열 데이터 검색 (처방전 번호, 환자명 등)
function searchData(data, searchTerm, searchFields = []) {
    if (!searchTerm || searchTerm.trim() === '') {
        return data;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return data.filter(item => {
        // 검색 필드가 지정되지 않은 경우 모든 필드에서 검색
        if (searchFields.length === 0) {
            return Object.values(item).some(value => 
                String(value).toLowerCase().includes(term)
            );
        }
        
        // 지정된 필드에서만 검색
        return searchFields.some(field => {
            const value = item[field];
            return value && String(value).toLowerCase().includes(term);
        });
    });
}

// 검색 입력 필드 생성 헬퍼
function createSearchInput(placeholder = '검색어를 입력하세요...', onSearch) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = 'margin-bottom: 1.5rem;';
    
    searchContainer.innerHTML = `
        <div style="display: flex; gap: 0.5rem;">
            <div style="flex: 1; position: relative;">
                <input 
                    type="text" 
                    class="form-input search-input" 
                    placeholder="${placeholder}"
                    style="padding-left: 2.5rem;"
                >
                <i class="fas fa-search" style="position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: #6b7280;"></i>
            </div>
            <button class="btn btn-outline search-clear-btn" style="display: none;">
                <i class="fas fa-times"></i> 초기화
            </button>
        </div>
    `;
    
    const input = searchContainer.querySelector('.search-input');
    const clearBtn = searchContainer.querySelector('.search-clear-btn');
    
    // 입력 이벤트 (디바운싱)
    let searchTimeout;
    input.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const value = e.target.value;
        
        if (value.trim()) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
        
        searchTimeout = setTimeout(() => {
            if (onSearch) onSearch(value);
        }, 300);
    });
    
    // 초기화 버튼
    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        if (onSearch) onSearch('');
    });
    
    return searchContainer;
}

// ==================== 페이지네이션 기능 ====================

class Pagination {
    constructor(data, itemsPerPage = 10) {
        this.allData = data;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = Math.ceil(data.length / itemsPerPage);
    }
    
    // 현재 페이지 데이터 가져오기
    getCurrentPageData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.allData.slice(start, end);
    }
    
    // 페이지 변경
    goToPage(page) {
        if (page < 1 || page > this.totalPages) return false;
        this.currentPage = page;
        return true;
    }
    
    // 다음 페이지
    nextPage() {
        return this.goToPage(this.currentPage + 1);
    }
    
    // 이전 페이지
    prevPage() {
        return this.goToPage(this.currentPage - 1);
    }
    
    // 데이터 업데이트
    updateData(newData) {
        this.allData = newData;
        this.totalPages = Math.ceil(newData.length / this.itemsPerPage);
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
            this.currentPage = this.totalPages;
        } else if (this.totalPages === 0) {
            this.currentPage = 1;
        }
    }
    
    // 페이지네이션 UI 생성
    createPaginationUI(onPageChange) {
        const container = document.createElement('div');
        container.className = 'pagination-container';
        container.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; flex-wrap: wrap; gap: 1rem;';
        
        if (this.totalPages <= 1) {
            container.innerHTML = `<div style="color: #6b7280; font-size: 0.875rem;">전체 ${this.allData.length}개</div>`;
            return container;
        }
        
        const info = document.createElement('div');
        info.style.cssText = 'color: #6b7280; font-size: 0.875rem;';
        info.textContent = `${this.currentPage} / ${this.totalPages} 페이지 (전체 ${this.allData.length}개)`;
        
        const buttons = document.createElement('div');
        buttons.style.cssText = 'display: flex; gap: 0.5rem; align-items: center;';
        
        // 이전 버튼
        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn btn-outline';
        prevBtn.style.cssText = 'padding: 0.5rem 0.75rem;';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (this.prevPage()) {
                info.textContent = `${this.currentPage} / ${this.totalPages} 페이지 (전체 ${this.allData.length}개)`;
                updatePageButtons();
                if (onPageChange) onPageChange(this.currentPage);
            }
        });
        
        // 페이지 번호 버튼들
        const pageButtons = document.createElement('div');
        pageButtons.style.cssText = 'display: flex; gap: 0.25rem;';
        
        const updatePageButtons = () => {
            pageButtons.innerHTML = '';
            const maxButtons = 5;
            let startPage = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
            let endPage = Math.min(this.totalPages, startPage + maxButtons - 1);
            
            if (endPage - startPage < maxButtons - 1) {
                startPage = Math.max(1, endPage - maxButtons + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                const btn = document.createElement('button');
                btn.className = i === this.currentPage ? 'btn btn-primary' : 'btn btn-outline';
                btn.style.cssText = 'padding: 0.5rem 0.75rem; min-width: 2.5rem;';
                btn.textContent = i;
                btn.addEventListener('click', () => {
                    if (this.goToPage(i)) {
                        info.textContent = `${this.currentPage} / ${this.totalPages} 페이지 (전체 ${this.allData.length}개)`;
                        updatePageButtons();
                        prevBtn.disabled = this.currentPage === 1;
                        nextBtn.disabled = this.currentPage === this.totalPages;
                        if (onPageChange) onPageChange(this.currentPage);
                    }
                });
                pageButtons.appendChild(btn);
            }
        };
        
        updatePageButtons();
        
        // 다음 버튼
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-outline';
        nextBtn.style.cssText = 'padding: 0.5rem 0.75rem;';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = this.currentPage === this.totalPages;
        nextBtn.addEventListener('click', () => {
            if (this.nextPage()) {
                info.textContent = `${this.currentPage} / ${this.totalPages} 페이지 (전체 ${this.allData.length}개)`;
                updatePageButtons();
                prevBtn.disabled = this.currentPage === 1;
                nextBtn.disabled = this.currentPage === this.totalPages;
                if (onPageChange) onPageChange(this.currentPage);
            }
        });
        
        buttons.appendChild(prevBtn);
        buttons.appendChild(pageButtons);
        buttons.appendChild(nextBtn);
        
        container.appendChild(info);
        container.appendChild(buttons);
        
        return container;
    }
}

// ==================== 인쇄 기능 ====================

// 처방전 인쇄
function printPrescription(prescription, medicines = [], delivery = null) {
    const printWindow = window.open('', '_blank');
    
    const medicinesHtml = medicines.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
                <tr style="border-bottom: 2px solid #000;">
                    <th style="padding: 8px; text-align: left;">약품명</th>
                    <th style="padding: 8px; text-align: left;">용법</th>
                    <th style="padding: 8px; text-align: left;">일수</th>
                </tr>
            </thead>
            <tbody>
                ${medicines.map(med => `
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 8px;">${med.name}</td>
                        <td style="padding: 8px;">${med.dosage}</td>
                        <td style="padding: 8px;">${med.days}일</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    ` : '<p>약물 정보가 없습니다.</p>';
    
    const deliveryHtml = delivery ? `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd;">
            <h3 style="margin-bottom: 10px;">배송 정보</h3>
            <p><strong>배송 주소:</strong> ${delivery.delivery_address}</p>
            <p><strong>수령인:</strong> ${delivery.recipient_name}</p>
            <p><strong>연락처:</strong> ${delivery.recipient_phone}</p>
            <p><strong>배송 상태:</strong> ${getStatusText(delivery.status)}</p>
        </div>
    ` : '';
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>처방전 - ${prescription.id.substring(0, 8).toUpperCase()}</title>
            <style>
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
                body {
                    font-family: 'Malgun Gothic', sans-serif;
                    padding: 30px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 30px;
                    color: #2563eb;
                    border-bottom: 3px solid #2563eb;
                    padding-bottom: 10px;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .info-item {
                    padding: 10px;
                    background: #f9fafb;
                    border-left: 3px solid #2563eb;
                }
                .info-item strong {
                    display: block;
                    margin-bottom: 5px;
                    color: #374151;
                }
                .section {
                    margin: 20px 0;
                }
                .section h3 {
                    margin-bottom: 10px;
                    color: #1e40af;
                }
                .print-button {
                    text-align: center;
                    margin: 20px 0;
                }
                button {
                    padding: 10px 30px;
                    background: #2563eb;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }
                button:hover {
                    background: #1e40af;
                }
            </style>
        </head>
        <body>
            <h1>처방전</h1>
            
            <div class="info-grid">
                <div class="info-item">
                    <strong>처방전 번호</strong>
                    ${prescription.id.substring(0, 8).toUpperCase()}
                </div>
                <div class="info-item">
                    <strong>발행일</strong>
                    ${formatDate(prescription.issued_at)}
                </div>
                <div class="info-item">
                    <strong>환자명</strong>
                    ${prescription.patient_name}
                </div>
                <div class="info-item">
                    <strong>병원</strong>
                    ${prescription.hospital_name}
                </div>
                <div class="info-item">
                    <strong>담당 의사</strong>
                    ${prescription.doctor_name}
                </div>
                <div class="info-item">
                    <strong>진단명</strong>
                    ${prescription.diagnosis}
                </div>
            </div>
            
            <div class="section">
                <h3>처방 약물</h3>
                ${medicinesHtml}
            </div>
            
            ${prescription.notes ? `
                <div class="section">
                    <h3>특이사항</h3>
                    <p style="padding: 10px; background: #fef3c7; border-left: 3px solid #f59e0b;">
                        ${prescription.notes}
                    </p>
                </div>
            ` : ''}
            
            ${deliveryHtml}
            
            <div class="print-button no-print">
                <button onclick="window.print()">
                    <i class="fas fa-print"></i> 인쇄하기
                </button>
                <button onclick="window.close()" style="background: #6b7280; margin-left: 10px;">
                    닫기
                </button>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #6b7280; font-size: 14px;">
                <p>조치원 스마트 약배송 서비스</p>
                <p>전화: 044-300-3000 | 이메일: admin@jochiwon-smartmed.kr</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// ==================== 알림 시스템 ====================

// 알림 저장소 (로컬 스토리지)
const NotificationSystem = {
    storageKey: 'smart_delivery_notifications',
    
    // 알림 저장
    saveNotification(notification) {
        const notifications = this.getNotifications();
        notifications.unshift({
            id: generateUUID(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        });
        
        // 최근 50개만 유지
        if (notifications.length > 50) {
            notifications.splice(50);
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(notifications));
        this.updateBadge();
    },
    
    // 알림 목록 가져오기
    getNotifications() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    },
    
    // 읽지 않은 알림 수
    getUnreadCount() {
        return this.getNotifications().filter(n => !n.read).length;
    },
    
    // 알림 읽음 처리
    markAsRead(notificationId) {
        const notifications = this.getNotifications();
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            localStorage.setItem(this.storageKey, JSON.stringify(notifications));
            this.updateBadge();
        }
    },
    
    // 모두 읽음 처리
    markAllAsRead() {
        const notifications = this.getNotifications();
        notifications.forEach(n => n.read = true);
        localStorage.setItem(this.storageKey, JSON.stringify(notifications));
        this.updateBadge();
    },
    
    // 알림 삭제
    deleteNotification(notificationId) {
        let notifications = this.getNotifications();
        notifications = notifications.filter(n => n.id !== notificationId);
        localStorage.setItem(this.storageKey, JSON.stringify(notifications));
        this.updateBadge();
    },
    
    // 모든 알림 삭제
    clearAll() {
        localStorage.setItem(this.storageKey, JSON.stringify([]));
        this.updateBadge();
    },
    
    // 배지 업데이트
    updateBadge() {
        const count = this.getUnreadCount();
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    },
    
    // 처방전 상태 변경 알림 생성
    notifyPrescriptionStatusChange(prescriptionId, patientName, oldStatus, newStatus) {
        this.saveNotification({
            type: 'prescription_status',
            title: '처방전 상태 변경',
            message: `${patientName}님의 처방전(#${prescriptionId.substring(0, 8)})이 "${getStatusText(oldStatus)}"에서 "${getStatusText(newStatus)}"로 변경되었습니다.`,
            prescriptionId: prescriptionId
        });
        
        // 화면 알림도 표시
        showAlert(`처방전 상태가 "${getStatusText(newStatus)}"로 변경되었습니다.`, 'success');
    }
};

// 알림 패널 생성 (헤더에 추가할 버튼과 패널)
function createNotificationPanel() {
    // 알림 버튼 HTML
    const buttonHtml = `
        <a href="#" id="notificationBtn" style="position: relative; color: inherit; text-decoration: none;">
            <i class="fas fa-bell" style="font-size: 1.25rem;"></i>
            <span id="notificationBadge" 
                  style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; 
                         border-radius: 50%; width: 20px; height: 20px; display: none; font-size: 0.75rem; 
                         align-items: center; justify-content: center; font-weight: 600;">0</span>
        </a>
    `;
    
    // 알림 패널 HTML
    const panelHtml = `
        <div id="notificationPanel" style="display: none; position: fixed; top: 70px; right: 20px; 
             width: 400px; max-height: 500px; background: white; border-radius: 0.75rem; 
             box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); z-index: 1000; overflow: hidden;">
            <div style="padding: 1rem; border-bottom: 2px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 1.125rem; font-weight: 600;">알림</h3>
                <div style="display: flex; gap: 0.5rem;">
                    <button id="markAllReadBtn" class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;">
                        모두 읽음
                    </button>
                    <button id="clearAllBtn" class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;">
                        모두 삭제
                    </button>
                </div>
            </div>
            <div id="notificationList" style="max-height: 400px; overflow-y: auto;"></div>
        </div>
    `;
    
    // DOM에 추가
    const container = document.createElement('div');
    container.innerHTML = buttonHtml;
    
    const panel = document.createElement('div');
    panel.innerHTML = panelHtml;
    document.body.appendChild(panel.firstElementChild);
    
    // 이벤트 리스너
    setTimeout(() => {
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationPanel = document.getElementById('notificationPanel');
        
        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const isVisible = notificationPanel.style.display === 'block';
                notificationPanel.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    updateNotificationList();
                }
            });
        }
        
        document.getElementById('markAllReadBtn')?.addEventListener('click', () => {
            NotificationSystem.markAllAsRead();
            updateNotificationList();
        });
        
        document.getElementById('clearAllBtn')?.addEventListener('click', () => {
            if (confirm('모든 알림을 삭제하시겠습니까?')) {
                NotificationSystem.clearAll();
                updateNotificationList();
            }
        });
        
        // 외부 클릭시 패널 닫기
        document.addEventListener('click', (e) => {
            if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
                notificationPanel.style.display = 'none';
            }
        });
        
        // 초기 배지 업데이트
        NotificationSystem.updateBadge();
    }, 100);
    
    return container.firstElementChild;
}

// 알림 목록 업데이트
function updateNotificationList() {
    const listContainer = document.getElementById('notificationList');
    if (!listContainer) return;
    
    const notifications = NotificationSystem.getNotifications();
    
    if (notifications.length === 0) {
        listContainer.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #6b7280;">
                <i class="fas fa-bell-slash" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <p>알림이 없습니다.</p>
            </div>
        `;
        return;
    }
    
    listContainer.innerHTML = notifications.map(notification => `
        <div class="notification-item" data-id="${notification.id}" 
             style="padding: 1rem; border-bottom: 1px solid #e5e7eb; cursor: pointer; 
                    background: ${notification.read ? 'white' : '#eff6ff'}; transition: background 0.2s;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <strong style="color: #1e40af; font-size: 0.875rem;">${notification.title}</strong>
                <button class="delete-notification" data-id="${notification.id}" 
                        style="border: none; background: none; color: #6b7280; cursor: pointer; padding: 0;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p style="margin: 0; font-size: 0.875rem; color: #374151;">${notification.message}</p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.75rem; color: #6b7280;">
                ${formatDate(notification.timestamp)}
            </p>
        </div>
    `).join('');
    
    // 알림 클릭 이벤트
    listContainer.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-notification')) {
                const notificationId = item.dataset.id;
                NotificationSystem.markAsRead(notificationId);
                updateNotificationList();
            }
        });
    });
    
    // 삭제 버튼 이벤트
    listContainer.querySelectorAll('.delete-notification').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const notificationId = btn.dataset.id;
            NotificationSystem.deleteNotification(notificationId);
            updateNotificationList();
        });
    });
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-item:hover {
        background: #dbeafe !important;
    }
    
    @media (max-width: 768px) {
        #notificationPanel {
            width: calc(100vw - 40px) !important;
            right: 20px !important;
        }
    }
`;
document.head.appendChild(style);
