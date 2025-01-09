document.addEventListener('DOMContentLoaded', function() {
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const modal = document.getElementById('editProfileModal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalCancelBtn = document.querySelector('.modal-btn.modal-cancel');
    const profileForm = document.querySelector('#editProfileModal form');

    function showToast(message, isSuccess = true) {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: isSuccess ? "#28a745" : "#dc3545",
            },
            onClick: function(){} 
        }).showToast();
    }

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    function openModal() {
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Form submit işlemi
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                    // FormData kullanıldığında Content-Type header'ı otomatik ayarlanır
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast(data.message || 'Profil başarıyla güncellendi', true);
                    closeModal();
                    // Sayfayı yenilemek yerine DOM'u güncelle
                    const bioElement = document.querySelector('.profile-bio');
                    const emailElement = document.querySelector('#email');
                    if (bioElement) bioElement.textContent = formData.get('bio');
                    if (emailElement) emailElement.value = formData.get('email');
                    
                    // Avatar güncellenmişse
                    const avatarInput = document.querySelector('input[name="avatar"]');
                    if (avatarInput && avatarInput.files[0]) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const avatarImages = document.querySelectorAll('.profile-avatar img');
                            avatarImages.forEach(img => {
                                img.src = e.target.result;
                            });
                        };
                        reader.readAsDataURL(avatarInput.files[0]);
                    }
                } else {
                    showToast(data.error || 'Bir hata oluştu', false);
                }
            })
            .catch(error => {
                console.error('Fetch hatası:', error);
                showToast('İstek gönderilirken bir hata oluştu', false);
            });
        });
    }

    // Profil düzenleme butonuna tıklama
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', openModal);
    }

    // Çarpı işaretine tıklama
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // İptal butonuna tıklama
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', closeModal);
    }

    // Modal dışına tıklama
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC tuşu ile kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});