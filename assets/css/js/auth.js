function showMsg(text, ok) { const m = $('msg'); m.textContent = text; m.className = 'msg ' + (ok ? 'success' : 'error'); }

if ($('loginForm')) {
  $('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const r = await api('login.php', { method: 'POST', body: new FormData($('loginForm')) });
    if (r.error) return showMsg(r.error, false);
    location.href = BASE + (r.role === 'admin' ? 'admin/index.html' : 'index.html');
  });
}

if ($('registerForm')) {
  $('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const f = $('registerForm');
    if (f.name.value.trim() === '') return showMsg('Please enter your full name.', false);
    if (f.password.value.length < 6) return showMsg('Password must be at least 6 characters.', false);
    const r = await api('register.php', { method: 'POST', body: new FormData(f) });
    if (r.error) return showMsg(r.error, false);
    showMsg('Account created! You can login now.', true);
    f.reset();
  });
}