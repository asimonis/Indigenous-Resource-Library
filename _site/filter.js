document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('resource-search');
  const topic = document.getElementById('topic-filter');
  const format = document.getElementById('format-filter');
  const cards = [...document.querySelectorAll('.resource-card')];
  const count = document.getElementById('resource-count');
  const empty = document.getElementById('no-results');
  function update() {
    const query = search.value.toLocaleLowerCase().trim();
    let shown = 0;
    cards.forEach(card => {
      const match = card.dataset.search.includes(query) &&
        (!topic.value || card.dataset.topic === topic.value) &&
        (!format.value || card.dataset.format === format.value);
      card.hidden = !match;
      if (match) shown++;
    });
    count.textContent = `${shown} of ${cards.length} resources`;
    empty.hidden = shown !== 0;
  }
  [search, topic, format].forEach(el => el.addEventListener('input', update));
  update();
});
