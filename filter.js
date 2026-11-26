document.addEventListener('DOMContentLoaded', () => {
  const get = id => document.getElementById(id);
  const search = get('resource-search'), topic = get('topic-filter'), format = get('format-filter');
  const list = get('resource-list'), count = get('resource-count'), empty = get('no-results');
  const sort = get('resource-sort'), size = get('page-size'), pagination = get('resource-pagination');
  if (!list || !search || !topic || !format || !sort || !size) return;
  const cards = [...list.querySelectorAll('.resource-card')];
  let page = 1, view = 'grid';
  const normalize = value => (value || '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLocaleLowerCase();
  const categories = value => (value || '').split(';').map(x => x.trim()).filter(Boolean);
  const matchesCategory = (value, selected) => !normalize(selected) || categories(value).map(normalize).includes(normalize(selected));
  const icons = {
    'article / book': '<path d="M12 7v14M3 4h4a5 5 0 0 1 5 3 5 5 0 0 1 5-3h4v15h-4a5 5 0 0 0-5 2 5 5 0 0 0-5-2H3z"/>',
    'report': '<path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h8"/>',
    'video': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    'podcast': '<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="3" y="12" width="4" height="7" rx="2"/><rect x="17" y="12" width="4" height="7" rx="2"/>',
    'website': '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    'art': '<path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 1-4 2 2 0 0 1 1-4h3a2 2 0 0 0 2-2 9 9 0 0 0-9-8z"/><path d="M7 10h.1M11 7h.1M16 8h.1M7 15h.1" stroke-width="3"/>',
    'museum / exhibit': '<path d="m3 8 9-5 9 5zM5 10v8M10 10v8M14 10v8M19 10v8M3 21h18"/>',
    'infographic': '<path d="M4 3v17h17M8 16v-5M13 16V6M18 16v-8"/>',
    'map': '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>'
  };
  cards.forEach(card => {
    const holder = card.querySelector('.resource-formats');
    if (!holder) return;
    holder.replaceChildren();
    categories(card.dataset.format).forEach(label => {
      const tag = document.createElement('span'); tag.className = 'format-label';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = icons[normalize(label)] || icons.report;
      tag.append(svg, document.createTextNode(label)); holder.append(tag);
    });
  });
  const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });
  const year = card => { const m = (card.dataset.year || '').match(/\b\d{4}\b/); return m ? Number(m[0]) : null; };
  function compare(a,b) {
    const title = () => collator.compare(a.dataset.title, b.dataset.title);
    if (sort.value === 'original') return cards.indexOf(a)-cards.indexOf(b);
    if (sort.value === 'author') return Number(!a.dataset.author)-Number(!b.dataset.author) || collator.compare(a.dataset.author,b.dataset.author) || title();
    if (sort.value === 'newest' || sort.value === 'oldest') {
      const ay=year(a), by=year(b);
      return Number(ay===null)-Number(by===null) || (ay!==null && by!==null ? (sort.value==='newest'?by-ay:ay-by):0) || title();
    }
    return title();
  }
  function update() {
    const matching = cards.filter(card => normalize(card.dataset.search).includes(normalize(search.value)) && matchesCategory(card.dataset.topic,topic.value) && matchesCategory(card.dataset.format,format.value)).sort(compare);
    const perPage = size.value === 'all' ? Math.max(1,matching.length) : Number(size.value);
    const pages = Math.max(1,Math.ceil(matching.length/perPage)); page = Math.min(page,pages);
    const start = (page-1)*perPage, end = Math.min(start+perPage,matching.length);
    const visible = new Set(matching.slice(start,end));
    cards.forEach(card => { card.hidden = !visible.has(card); });
    matching.forEach(card => list.append(card));
    count.textContent = matching.length ? `Showing ${start+1}–${end} of ${matching.length} matching resources (${cards.length} total)` : `0 of ${cards.length} resources`;
    empty.hidden = matching.length !== 0; pagination.hidden = pages <= 1;
    get('page-status').textContent = `Page ${page} of ${pages}`;
    get('prev-page').disabled = page===1; get('next-page').disabled = page===pages;
  }
  function resetPage() { page=1; update(); }
  search.addEventListener('input',resetPage);
  [topic,format,sort,size].forEach(el => el.addEventListener('change',resetPage));
  function setView(next) {
    view=next; list.classList.toggle('list-view',view==='list');
    get('grid-view').setAttribute('aria-pressed',String(view==='grid'));
    get('list-view').setAttribute('aria-pressed',String(view==='list'));
    size.value=view==='list'?'24':'12'; resetPage();
  }
  get('grid-view').addEventListener('click',()=>{if(view!=='grid')setView('grid');});
  get('list-view').addEventListener('click',()=>{if(view!=='list')setView('list');});
  get('clear-filters').addEventListener('click',()=>{search.value=topic.value=format.value='';resetPage();});
  get('prev-page').addEventListener('click',()=>{page--;update();count.scrollIntoView({block:'start'});});
  get('next-page').addEventListener('click',()=>{page++;update();count.scrollIntoView({block:'start'});});
  // Apply homepage links without changing the existing filter logic.
  const params = new URLSearchParams(window.location.search);
  function selectFromUrl(select, key) {
    const requested = params.get(key);
    if (!requested) return;
    const option = [...select.options].find(o => normalize(o.value) === normalize(requested));
    if (option) select.value = option.value;
  }
  selectFromUrl(topic, 'topic');
  selectFromUrl(format, 'format');
  get('library-toolbar').hidden=false; update();
});
