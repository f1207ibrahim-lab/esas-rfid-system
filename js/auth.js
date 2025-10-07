// In-memory authentication state
let currentUser = null;
let resetCodeData = null;

// Demo credentials
const validCredentials = {
  'admin123': { password: '123', name: 'Admin Utama' },
  'test': { password: '123', name: 'Admin Ujian' }
};

// Check if user is already logged in on page load
function checkAuth() {
  if (currentUser) {
    showDashboard();
  }
}

function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');

  // Clear previous error
  errorMsg.classList.remove('show');

  // Validate input
  if (!email || !password) {
    errorMsg.textContent = 'Sila masukkan emel dan kata laluan';
    errorMsg.classList.add('show');
    return;
  }

  // Check credentials
  if (validCredentials[email] && validCredentials[email].password === password) {
    currentUser = {
      email: email,
      name: validCredentials[email].name
    };
    showDashboard();
  } else {
    errorMsg.textContent = 'Emel atau kata laluan salah';
    errorMsg.classList.add('show');
    // Clear password field
    document.getElementById('password').value = '';
  }
}

function showDashboard() {
  document.getElementById('login-box').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  
  if (currentUser) {
    document.getElementById('admin-name').textContent = currentUser.name;
  }
}

function logout() {
  currentUser = null;
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('login-box').classList.remove('hidden');
  
  // Clear input fields
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  document.getElementById('error-msg').classList.remove('show');
}

function togglePassword() {
  const passwordInput = document.getElementById('password');
  const toggleIcon = document.querySelector('.toggle-password');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.textContent = '🙈';
  } else {
    passwordInput.type = 'password';
    toggleIcon.textContent = '👁️';
  }
}

function forgotPassword() {
  document.getElementById('forgot-modal').classList.remove('hidden');
  document.getElementById('forgot-email').value = '';
  document.getElementById('forgot-error').textContent = '';
  document.getElementById('forgot-error').classList.remove('show');
}

function closeForgotModal() {
  document.getElementById('forgot-modal').classList.add('hidden');
}

function sendResetCode() {
  const email = document.getElementById('forgot-email').value.trim();
  const errorMsg = document.getElementById('forgot-error');

  errorMsg.classList.remove('show');

  if (!email) {
    errorMsg.textContent = 'Sila masukkan emel anda';
    errorMsg.classList.add('show');
    return;
  }

  if (!validCredentials[email]) {
    errorMsg.textContent = 'Emel tidak dijumpai dalam sistem';
    errorMsg.classList.add('show');
    return;
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store reset code data
  resetCodeData = {
    email: email,
    code: code,
    timestamp: Date.now()
  };

  // Show reset modal
  document.getElementById('forgot-modal').classList.add('hidden');
  document.getElementById('reset-modal').classList.remove('hidden');
  document.getElementById('reset-email').textContent = email;
  document.getElementById('display-code').textContent = code;
  
  // Clear inputs
  document.getElementById('reset-code').value = '';
  document.getElementById('new-password').value = '';
  document.getElementById('confirm-password').value = '';
  document.getElementById('reset-error').textContent = '';
  document.getElementById('reset-error').classList.remove('show');
  document.getElementById('reset-success').classList.remove('show');
}

function closeResetModal() {
  document.getElementById('reset-modal').classList.add('hidden');
  resetCodeData = null;
}

function resetPassword() {
  const code = document.getElementById('reset-code').value.trim();
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const errorMsg = document.getElementById('reset-error');
  const successMsg = document.getElementById('reset-success');

  errorMsg.classList.remove('show');
  successMsg.classList.remove('show');

  if (!code || !newPassword || !confirmPassword) {
    errorMsg.textContent = 'Sila lengkapkan semua medan';
    errorMsg.classList.add('show');
    return;
  }

  if (code !== resetCodeData.code) {
    errorMsg.textContent = 'Kod reset tidak sah';
    errorMsg.classList.add('show');
    return;
  }

  if (newPassword.length < 6) {
    errorMsg.textContent = 'Kata laluan mestilah sekurang-kurangnya 6 aksara';
    errorMsg.classList.add('show');
    return;
  }

  if (newPassword !== confirmPassword) {
    errorMsg.textContent = 'Kata laluan tidak sepadan';
    errorMsg.classList.add('show');
    return;
  }

  // Update password
  validCredentials[resetCodeData.email].password = newPassword;
  
  // Show success
  successMsg.classList.add('show');
  
  // Close modal after 2 seconds
  setTimeout(() => {
    closeResetModal();
    alert('Kata laluan berjaya ditukar! Sila log masuk dengan kata laluan baru.');
  }, 2000);
}

// Allow Enter key to submit login
document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  if (emailInput && passwordInput) {
    emailInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') login();
    });
    
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') login();
    });
  }
  
  checkAuth();
});
