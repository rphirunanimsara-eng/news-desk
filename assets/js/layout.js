const BASE = '/nsbm-newsdesk/';
const $ = id => document.getElementById(id);

// Helpers used by all pages
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function imgUrl(i) { return BASE + (i ? 'assets/uploads/' + encodeURIComponent(i) : 'assets/images/campus.jpg'); }
function fmtDate(d) { return new Date(d.replace(' ', 'T')).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
async function api(path, options) { const r = await fetch(BASE + 'api/' + path, options); return r.json(); }

function cardHtml(a) {
  return `<div class="card">
    <img src="${imgUrl(a.image)}" alt="">
    <div class="card-body">
      <span class="tag">${esc(a.cat)}</span>
      <h3><a href="${BASE}article.html?id=${a.id}">${esc(a.title)}</a></h3>
      <p>${esc(a.excerpt)}</p>
      <p class="date">${fmtDate(a.created_at)}</p>
    </div></div>`;
}

// Build the top menu and footer
async function buildLayout() {
  if (!$('site-header')) return;
  const [cats, s] = await Promise.all([api('categories.php'), api('session.php')]);

  const catLinks = cats.map(c => `<li><a href="${BASE}news.html?cat=${c.id}">${esc(c.name)}</a></li>`).join('');
  const adminLink = s.role === 'admin' ? `<li><a href="${BASE}admin/index.html">Admin Panel</a></li>` : '';
  const authLink = s.logged_in
    ? `<li><a href="#" id="logout">Logout (${esc(s.name)})</a></li>`
    : `<li><a href="${BASE}login.html">Login / Register</a></li>`;

  $('site-header').innerHTML = `
  <nav class="navbar">
    <a href="${BASE}index.html" class="brand"><img src="${BASE}assets/images/logo.png" alt="NSBM"></a>
    <ul class="menu">
      <li><a href="${BASE}index.html">Home</a></li>
      <li><a href="${BASE}news.html">News</a></li>
      <li class="dropdown"><a href="#">Categories &#9662;</a><ul class="dropdown-menu">${catLinks}</ul></li>
      <li><a href="${BASE}submit.html">Submit Article</a></li>
      ${adminLink}
      ${authLink}
    </ul>
    <form action="${BASE}news.html" method="get" class="search">
      <input type="text" name="q" placeholder="Search news...">
      <button type="submit">Go</button>
    </form>
  </nav>`;

  if ($('logout')) $('logout').addEventListener('click', async e => {
    e.preventDefault();
    await api('logout.php');
    location.href = BASE + 'index.html';
  });

  $('site-footer').innerHTML = `
  <footer class="footer">
    <div class="footer-grid">
      <div>
        <img src="${BASE}assets/images/logo.png" alt="NSBM" class="footer-logo">
        <p>NSBM Green University is a leading higher education institution in Sri Lanka.</p>
      </div>
      <div>
        <h4>Contact Us</h4>
        <p>Address: Mahenwaththa, Pitipana, Homagama, Sri Lanka</p>
        <p>General / Hotline: +94 11 544 5000</p>
        <p>Email: info@nsbm.ac.lk</p>
      </div>
      <div>
        <h4>Follow Us</h4>
        <div class="social">
          <a href="https://www.nsbm.ac.lk/" target="_blank">Website</a>
          <a href="https://www.facebook.com/nsbm.lk" target="_blank">Facebook</a>
          <a href="https://www.instagram.com/nsbm_green_university/" target="_blank">Instagram</a>
          <a href="https://www.linkedin.com/school/nsbm-green-university/" target="_blank">LinkedIn</a>
          <a href="https://www.youtube.com/@NSBMGreenUniversityTown" target="_blank">YouTube</a>
        </div>
      </div>
    </div>
    <p class="copy">&copy; ${new Date().getFullYear()} NSBM Green University. All Rights Reserved.</p>
  </footer>`;
}
buildLayout();