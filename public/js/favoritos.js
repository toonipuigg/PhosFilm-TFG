document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.heart-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form))
      });

      if (res.ok) {
        form.querySelector('.heart-button').classList.toggle('liked');
      }
    });
  });
});