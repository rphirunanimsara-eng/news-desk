const articleId = new URLSearchParams(location.search).get('id');

async function loadComments() {
  const list = await api('comments.php?article_id=' + encodeURIComponent(articleId));
  $('comments').innerHTML = list.map(c =>
    `<div class="comment"><b>${esc(c.name)}</b> <span class="date">${esc(c.created_at)}</span><p>${esc(c.body)}</p></div>`
  ).join('') || '<p>No comments yet.</p>';
}

(async () => {
  const a = await api('articles.php?id=' + encodeURIComponent(articleId));
  if (a.error) { $('article').innerHTML = '<p>Article not found.</p>'; return; }

  document.title = a.title;
  $('article').innerHTML = `
    <span class="tag">${esc(a.cat)}</span>
    <h1>${esc(a.title)}</h1>
    <p class="date">${fmtDate(a.created_at)}</p><br>
    <img class="cover" src="${imgUrl(a.image)}" alt="">
    <div style="margin-top:20px">${esc(a.content).replace(/\n/g, '<br>')}</div>`;

  loadComments();

  const s = await api('session.php');
  if (s.logged_in) $('commentForm').style.display = 'block';
  else $('loginNote').style.display = 'block';

  $('commentForm').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData($('commentForm'));
    fd.append('article_id', articleId);
    const r = await api('comments.php', { method: 'POST', body: fd });
    if (r.error) return alert(r.error);
    $('commentForm').reset();
    loadComments();
  });
})();