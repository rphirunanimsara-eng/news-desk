(async () => {
  const s = await api('session.php');
  if (!s.logged_in) { location.href = BASE + 'login.html'; return; }

  const cats = await api('categories.php');
  $('category_id').innerHTML = cats.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');


  $('image').addEventListener('change', () => {
    const f = $('image').files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { alert('Image is too big (max 5MB).'); $('image').value = ''; $('preview').style.display = 'none'; return; }
    $('preview').src = URL.createObjectURL(f);
    $('preview').style.display = 'block';
  });

  $('submitForm').addEventListener('submit', async e => {
    e.preventDefault();
    const r = await api('submit.php', { method: 'POST', body: new FormData($('submitForm')) });
    const m = $('msg');
    m.textContent = r.error || 'Submitted! An admin will review your article.';
    m.className = 'msg ' + (r.error ? 'error' : 'success');
    if (!r.error) { $('submitForm').reset(); $('preview').style.display = 'none'; }
  });
})();