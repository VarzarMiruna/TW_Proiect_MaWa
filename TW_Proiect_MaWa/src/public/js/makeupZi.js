document.getElementById('zi-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = new URLSearchParams(formData);

  const response = await fetch('/api/zi-sfaturi', {
      method: 'POST',
      body: data
  });
  const sfaturi = await response.json();
  const sfaturiDiv = document.getElementById('sfaturi');

  sfaturiDiv.innerHTML = `
      <h3>Sfaturi pentru un makeup de zi</h3>
      <ul>
          <li><strong>Vârstă:</strong> ${sfaturi.varsta}</li>
          <li><strong>Tip Ten:</strong> ${sfaturi.tipTen}</li>
          <li><strong>Ocazie:</strong> ${sfaturi.ocazie}</li>
          <li><strong>Pret:</strong> ${sfaturi.pret}</li>
      </ul>
  `;
});
