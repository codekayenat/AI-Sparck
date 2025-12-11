async function fetchJSON(url) {
  const res = await fetch(url);
  return res.json();
}

function renderTutorials(tuts) {
  const container = document.getElementById('tutorials');
  container.innerHTML = '';
  tuts.forEach(t => {
    const card = document.createElement('div');
    card.className = 'card p-3';
    card.innerHTML = `<h5>${t.title}</h5><p>${t.content}</p>`;
    container.appendChild(card);
  });
}

function renderExercises(exs) {
  const container = document.getElementById('exercises');
  container.innerHTML = '';
  exs.forEach((ex, idx) => {
    const card = document.createElement('div');
    card.className = 'card p-3';
    let html = `<strong>Q${idx+1}.</strong> ${ex.question}<div class="mt-2">`;
    ex.options.forEach((opt, i) => {
      const id = `q${idx}_opt${i}`;
      html += `<div class="form-check">
                <input class="form-check-input" type="radio" name="q${idx}" id="${id}" value="${i}">
                <label class="form-check-label" for="${id}">${opt}</label>
               </div>`;
    });
    html += `</div>`;
    card.innerHTML = html;
    container.appendChild(card);
  });
}

function renderFunfacts(facts) {
  const ul = document.getElementById('funfacts');
  ul.innerHTML = '';
  facts.forEach(f => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = f;
    ul.appendChild(li);
  });
}

async function main() {
  const [tuts, exs, facts] = await Promise.all([
    fetchJSON('/api/tutorials'),
    fetchJSON('/api/exercises'),
    fetchJSON('/api/funfacts')
  ]);
  renderTutorials(tuts);
  renderExercises(exs);
  renderFunfacts(facts);

  document.getElementById('submitBtn').addEventListener('click', async () => {
    const answers = exs.map((ex, idx) => {
      const radios = document.getElementsByName(`q${idx}`);
      let selected = null;
      for (const r of radios) { if (r.checked) selected = parseInt(r.value); }
      return { questionId: ex.id, selected, correct: selected === ex.correctIndex };
    });

    const res = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    const json = await res.json();
    document.getElementById('result').innerHTML = `<div class="alert alert-info">Score: ${json.score} / ${json.total}</div>`;
  });
}

main().catch(err => { console.error(err); });
