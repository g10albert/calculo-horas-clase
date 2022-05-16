const fecha = document.querySelector("#date");
const btn = document.querySelector("#btn");
let now = moment().format('YYYY-MM-DD');

btn.addEventListener('click', () => {
    if (!fecha.value) {
        alert('La fecha no puede estar vacía');
    }
})


fecha.addEventListener('change', () => {
    if (date.value < now) {
        alert('La fecha no puede ser anterior a hoy');
        date.value = now;
    }
});