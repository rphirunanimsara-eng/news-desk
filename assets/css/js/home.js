(async () => {
  const breaking = await api('articles.php?breaking=1&limit=1');
  if (breaking.length) {
    $('breaking').innerHTML = `<div class="breaking">BREAKING: <a href="${BASE}article.html?id=${breaking[0].id}">${esc(breaking[0].title)}</a></div>`;
  }

  const featured = await api('articles.php?featured=1&limit=1');
  if (featured.length) {
    const f = featured[0];
    $('featured').innerHTML = `<h2 class="title">Featured</h2>
      <div class="card"><div class="card-body">
        <span class="tag tag-gold">FEATURED</span> <span class="tag">${esc(f.cat)}</span>
        <h3><a href="${BASE}article.html?id=${f.id}">${esc(f.title)}</a></h3>
        <p>${esc(f.excerpt)}</p>
      </div></div>`;
  }

  const latest = await api('articles.php?limit=6');
  $('latest').innerHTML = latest.length ? latest.map(cardHtml).join('') : '<p>No news yet.</p>';

  const ann = await api('announcements.php');
  $('announcements').innerHTML = ann.map(n => `<li>${esc(n.title)}<br><span class="date">${fmtDate(n.created_at)}</span></li>`).join('');
})();