
document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('resource-search');
  const topic = document.getElementById('topic-filter');
  const format = document.getElementById('format-filter');
  const cards = [...document.querySelectorAll('.resource-card')];
  const count = document.getElementById('resource-count');
  const empty = document.getElementById('no-results');

  function normalize(value) {
    return (value || "")
      .normalize("NFKC")
      .replace(/\s+/g, " ")
      .trim()
      .toLocaleLowerCase();
  }

  function matchesCategory(value, selected) {
    return !normalize(selected) ||
      (value || "")
        .split(";")
        .map(normalize)
        .includes(normalize(selected));
  }

  function update() {
    const query = normalize(search.value);
    let shown = 0;

    cards.forEach(card => {
      const match =
        normalize(card.dataset.search).includes(query) &&
        matchesCategory(card.dataset.topic, topic.value) &&
        matchesCategory(card.dataset.format, format.value);

      card.hidden = !match;

      if (match) shown++;
    });

    count.textContent = `${shown} of ${cards.length} resources`;
    empty.hidden = shown !== 0;
  }

  [search, topic, format].forEach(el =>
    el.addEventListener('input', update)
  );

  update();
});
