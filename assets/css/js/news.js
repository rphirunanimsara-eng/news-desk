(async () => {
  const p = new URLSearchParams(location.search);
  const cats = await api('categories.php');
  const select = $('cat');
  cats.forEach(c => select.insertAdjacentHTML('beforeend', `<option value="${c.id}">${esc(c.name)}</option>`));

  // Fill the filter boxes from the URL
  $('q').value = p.get('q') || '';
  select.value = p.get('cat') || '0';
  $('date').value = p.get('date') || '';

  const list = await api('articles.php?' + p.toString());
  $('news-list').innerHTML = list.length ? list.map(cardHtml).join('') : '<p>No news found.</p>';
})();