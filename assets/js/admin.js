const adminGet = a => api('admin.php?action=' + a);
function adminPost(action, data) {
  const fd = data instanceof FormData ? data : new FormData();
  if (!(data instanceof FormData)) for (const k in (data || {})) fd.append(k, data[k]);
  fd.append('action', action);
  return api('admin.php', { method: 'POST', body: fd });
}

// Show one tab at a time
function showTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.style.display = 'none');
  $('tab-' + name).style.display = 'block';
  if (name === 'dashboard') loadStats();
  if (name === 'articles') loadArticles();
  if (name === 'categories') loadCategories();
  if (name === 'announcements') loadAnnouncements();
  if (name === 'comments') loadComments();
}

async function loadStats() {
  const s = await adminGet('stats');
  $('stats').innerHTML = `
    <div class="stat"><b>${s.published}</b>Published</div>
    <div class="stat"><b>${s.pending}</b>Pending approval</div>
    <div class="stat"><b>${s.students}</b>Students</div>
    <div class="stat"><b>${s.comments}</b>Comments</div>`;
}

async function loadArticles() {
  const rows = await adminGet('articles');
  $('articleRows').innerHTML = rows.map(r => `<tr>
    <td>${esc(r.title)} ${r.featured == 1 ? '<span class="tag tag-gold">Featured</span>' : ''} ${r.breaking == 1 ? '<span class="tag" style="background:#b71c1c">Breaking</span>' : ''}</td>
    <td>${esc(r.cat)}</td><td>${esc(r.status)}</td><td>${fmtDate(r.created_at)}</td>
    <td>
      ${r.status === 'pending' ? `<button class="btn" data-act="approve" data-id="${r.id}">Approve</button>
      <button class="btn btn-grey" data-act="reject" data-id="${r.id}">Reject</button>` : ''}
      <button class="btn" data-act="edit" data-id="${r.id}">Edit</button>
      <button class="btn btn-red" data-act="delete" data-id="${r.id}">Delete</button>
    </td></tr>`).join('');
}

async function loadCategories() {
  const cats = await api('categories.php');
  $('categoryRows').innerHTML = cats.map(c => `<tr><td>${esc(c.name)}</td>
    <td><button class="btn btn-red" data-id="${c.id}">Delete</button></td></tr>`).join('');
  $('f_category').innerHTML = cats.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
}

async function loadAnnouncements() {
  const rows = await adminGet('announcements');
  $('announcementRows').innerHTML = rows.map(r => `<tr><td>${esc(r.title)}</td><td>${esc(r.created_at)}</td>
    <td><button class="btn btn-red" data-id="${r.id}">Delete</button></td></tr>`).join('');
}

async function loadComments() {
  const rows = await adminGet('comments');
  $('commentRows').innerHTML = rows.map(r => `<tr><td>${esc(r.name)}</td><td>${esc(r.title)}</td><td>${esc(r.body)}</td>
    <td><button class="btn btn-red" data-id="${r.id}">Delete</button></td></tr>`).join('');
}

// Reset the article form for a NEW article
function newArticle() {
  $('articleForm').reset();
  $('f_id').value = '';
  $('formTitle').textContent = 'Create New Article';
  $('curImg').style.display = 'none';
  showTab('form');
}

(async () => {
  // Only admins may be here
  const s = await api('session.php');
  if (s.role !== 'admin') { location.href = BASE + 'login.html'; return; }

  document.querySelectorAll('.admin-side a[data-tab]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    a.dataset.tab === 'form' ? newArticle() : showTab(a.dataset.tab);
  }));
  $('btnNew').addEventListener('click', newArticle);
  $('adminLogout').addEventListener('click', async e => { e.preventDefault(); await api('logout.php'); location.href = BASE + 'index.html'; });

  await loadCategories();   // fills the category dropdown in the form
  showTab('dashboard');

  // Article table buttons
  $('articleRows').addEventListener('click', async e => {
    const b = e.target.closest('button'); if (!b) return;
    const id = b.dataset.id;
    if (b.dataset.act === 'approve') { await adminPost('set_status', { id, status: 'published' }); loadArticles(); }
    if (b.dataset.act === 'reject')  { await adminPost('set_status', { id, status: 'rejected' }); loadArticles(); }
    if (b.dataset.act === 'delete' && confirm('Delete this article?')) { await adminPost('delete_article', { id }); loadArticles(); }
    if (b.dataset.act === 'edit') {
      const a = await api('admin.php?action=article&id=' + id);
      const f = $('articleForm');
      $('f_id').value = a.id; f.title.value = a.title; f.category_id.value = a.category_id;
      f.status.value = a.status; f.featured.checked = a.featured == 1; f.breaking.checked = a.breaking == 1;
      f.excerpt.value = a.excerpt; f.content.value = a.content;
      $('curImg').src = imgUrl(a.image); $('curImg').style.display = 'block';
      $('formTitle').textContent = 'Edit Article';
      showTab('form');
    }
  });

  // Save article (add or edit)
  $('articleForm').addEventListener('submit', async e => {
    e.preventDefault();
    const r = await adminPost('save_article', new FormData($('articleForm')));
    if (r.error) return alert(r.error);
    showTab('articles');
  });

  // Picture preview
  $('f_image').addEventListener('change', () => {
    const f = $('f_image').files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { alert('Image is too big (max 5MB).'); $('f_image').value = ''; return; }
    $('curImg').src = URL.createObjectURL(f); $('curImg').style.display = 'block';
  });

  // Categories
  $('categoryForm').addEventListener('submit', async e => { e.preventDefault(); await adminPost('add_category', new FormData($('categoryForm'))); $('categoryForm').reset(); loadCategories(); });
  $('categoryRows').addEventListener('click', async e => { const b = e.target.closest('button'); if (b && confirm('Delete category?')) { await adminPost('delete_category', { id: b.dataset.id }); loadCategories(); } });

  // Announcements
  $('announcementForm').addEventListener('submit', async e => { e.preventDefault(); await adminPost('add_announcement', new FormData($('announcementForm'))); $('announcementForm').reset(); loadAnnouncements(); });
  $('announcementRows').addEventListener('click', async e => { const b = e.target.closest('button'); if (b && confirm('Delete announcement?')) { await adminPost('delete_announcement', { id: b.dataset.id }); loadAnnouncements(); } });

  // Comments
  $('commentRows').addEventListener('click', async e => { const b = e.target.closest('button'); if (b && confirm('Delete comment?')) { await adminPost('delete_comment', { id: b.dataset.id }); loadComments(); } });
})();