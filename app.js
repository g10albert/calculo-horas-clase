// const moment = require("moment");

// const moment = require("moment");

//const moment = require("moment");


const inputTotalHoras = document.querySelector('#inputTotalHoras');
const inputHorasDia = document.querySelector('#inputHorasDia');
const btnProcesar = document.querySelector('#procesar');
const diaFechaInicio = document.querySelector('#diaFechaInicio');
const inputFechaInicio = document.querySelector('#inputFechaInicio');
const inputDiasLaborar = document.querySelector('#inputDiasLaborar');
const inputFechaFinal = document.querySelector('#inputFechaFinal');
const inputLunVieCheck = document.querySelector('#lunVieCheck');
const nuevoFormulario = document.querySelector('#nuevo');
const diasDeClase = document.querySelector('#diasDeClase');
const copiarBtn = document.querySelector('.copiar-boton');
const infoCurso = document.querySelector('#infoCurso');
const mostrarFeriados = document.querySelector('.mostrar-feriados');
const checkBoxes = document.querySelectorAll('.seleccionar-dias input[type=checkbox]:not(#lunVieCheck)');

const excluirDias = document.querySelector('#excDias');
const datePicker = new Datepicker('#datepicker', {
    multiple: true,
    min: (function () {
        return new Date();
    })()
});
const datePickerInput = document.querySelector('.excluir')
const orderedList = document.querySelector('#vago')

// Conexión con la base de datos para crear array de dias feriados

const feriados = [];
async function fetchDates() {
    const response = await fetch('http://localhost/manolo_api/');
    const dates = await response.json();
    for (let i = 0; i < dates.length; i++) {
        feriados.push(moment(dates[i].dia_festivo).format('MM-DD-YYYY'))
    }
}

fetchDates();

// Validar que no se pongan datos menores o menores de los permitidos

const MINIMO_TOTAL_HORAS = 15;
const MAXIMO_TOTAL_HORAS = 1000;

const MINIMO_HORAS_DIA = 1;
const MAXIMO_HORAS_DIA = 12;

btnProcesar.addEventListener('click', () => {
    // Validar que los campos tengan datos correctos
    if (inputTotalHoras.value === '') {
        alert('El campo total de horas no puede estar vacio');
        inputTotalHoras.focus()
        return;
    }
    if (inputTotalHoras.value < MINIMO_TOTAL_HORAS) {
        alert(`El total de horas no puede ser menor que ${MINIMO_TOTAL_HORAS}`);
        inputTotalHoras.focus();
        return;
    } else if (inputTotalHoras.value > MAXIMO_TOTAL_HORAS) {
        alert(`El total de horas no puede ser mayor que ${MAXIMO_TOTAL_HORAS}`);
        inputTotalHoras.focus();
        return;
    }

    if (inputHorasDia.value === '') {
        alert('El campo horas por dia no puede estar vacio');
        inputHorasDia.focus()
        return;
    }
    if (inputHorasDia.value < MINIMO_HORAS_DIA) {
        alert(`El campo horas por dia no puede ser menor que ${MINIMO_HORAS_DIA}`);
        inputHorasDia.focus()
        return;
    } else if (inputHorasDia.value > MAXIMO_HORAS_DIA) {
        alert(`El campo horas por dia no puede ser mayor que ${MAXIMO_HORAS_DIA}`);
        inputHorasDia.focus()
        return;
    }

    var now = moment().format('YYYY-MM-DD')
    var inicio = (inputFechaInicio.value)
    if (inicio < now) {
        alert('La fecha no puede ser una anterior a la actual');
        return;
    }


    // Procesar dias en los que el facilitador no dará clases

    let diasExcluir = datePicker.getValue().split(',')
    let diasExcluidos = [];

    for (i = 0; i < diasExcluir.length; i++) {
        let diaExcluido = moment(diasExcluir[i]).format('MM-DD-YYYY');
        diasExcluidos.push(diaExcluido)
    }

    if (!excluirDias.checked) {
        diasExcluidos = [];
    }

    const inputTotalHorasDia = document.querySelectorAll('.seleccionar-dias input[type=number]');

    const checkTotalHorasDia = document.querySelectorAll('.seleccionar-dias input[type=checkbox]:not(#lunVieCheck):checked')

    const fechaInicio = moment(inputFechaInicio.value);

    diasSeleccionados = {}

    actualizarDiasSeleccionados();

    isDateOnSelectedDays(fechaInicio, diasSeleccionados)

    let feriadosExcluidos = [...new Set([...feriados, ...diasExcluidos])]

    let totalHorasProcesadas = 0;
    let cantidadDiasLaborar = 0;

    if (checkTotalHorasDia.length > 0) {

        if (!isDateOnSelectedDays(fechaInicio, diasSeleccionados)) {
            alert("La fecha de inicio no esta marcada en los dias")
            return;
        }

        orderedList.innerHTML = '';

        // procesar
        let nextDate = moment(fechaInicio); // fechaInicio
        let diasNoLabora = []
        let noLabora = -1;

        while (totalHorasProcesadas < +inputTotalHoras.value) {

            if (isDateOnSelectedDays(nextDate, diasSeleccionados)) {

                if (!feriadosExcluidos.includes(nextDate.format('MM-DD-YYYY'))) {
                    cantidadDiasLaborar++;
                    totalHorasProcesadas += getValueFromSelectedDate(nextDate, diasSeleccionados);
                    showDayInList(totalHorasProcesadas, moment(nextDate).format('MM-DD-YYYY dddd'))
                }

                // Proceso de dias feriados 
                else {
                    noLabora += 1;
                    diasNoLabora.push(nextDate.format('MM-DD-YYYY'))
                }

            }
            nextDate = nextDate.add(1, 'days')
        }

        let infoFinalCurso = '';
        let ultimoDia = 0;

        inputFechaFinal.value = nextDate.subtract(1, 'days').format('MM-DD-YYYY');

        if (totalHorasProcesadas > +inputTotalHoras.value) {

            // Experimento para arreglar bug de cuando solo se selecciona un dia

            if (nextDate.day() in diasSeleccionados) {

            } else {

                nextDate = nextDate.subtract(1, 'days')

                let horasSobran = totalHorasProcesadas - (+inputTotalHoras.value);

                ultimoDia = (getValueFromSelectedDate(nextDate, diasSeleccionados) - horasSobran);
            }

            let horasSobran = totalHorasProcesadas - (+inputTotalHoras.value);

            ultimoDia = (getValueFromSelectedDate(nextDate, diasSeleccionados) - horasSobran);

            if (ultimoDia > 0) {
                
                infoFinalCurso = `El ultimo dia de clase se impartirán: ${ultimoDia} horas. `;
            }
        }

        if (diasNoLabora.length != 0) {
            infoFinalCurso += `No se laborará el ${diasNoLabora.join(', ')}`
        }

        if (ultimoDia > 0 || diasNoLabora.length != 0) {
            if (!infoCurso.classList.contains('activos')) {
                infoCurso.classList.toggle('activos');
            }
        }

        infoCurso.textContent = infoFinalCurso;

        inputDiasLaborar.value = cantidadDiasLaborar;
        // inputFechaFinal.value = nextDate.subtract(1, 'days').format('MM-DD-YYYY');

    } else {
        alert('Debe seleccionar al menos un dia');
    }

    // Inyectandole al parrafo los dias que se seleccionaron para dar clases

    const diasFinales = []

    if (!diasDeClase.classList.contains('activos')) {
        diasDeClase.classList.toggle('activos')
    }

    if (!copiarBtn.classList.contains('activos')) {
        copiarBtn.classList.toggle('activos')
    }

    dia_id: if (inputLunVieCheck.checked) {
        diasDeClase.textContent = 'Lunes a viernes';
        break dia_id
    } else {
        checkBoxes.forEach(element => {
            let dia = element.nextElementSibling.textContent;
            if (element.checked) {
                diasFinales.push(dia)
                diasDeClase.textContent = diasFinales.join(', ')
            }
        })
    }
})

function actualizarDiasSeleccionados() {
    const inputsDiasSeleccionados = document.querySelectorAll('.seleccionar-dias input[type=number]:not(:disabled)');

    inputsDiasSeleccionados.forEach(element => {
        diasSeleccionados[element.dataset.index] = element.value;
    });
}

function isDateOnSelectedDays(date, diasSeleccionados) {
    // obtener indice del dia de la semana de la fecha
    return moment(date).day() in diasSeleccionados;
}
function getValueFromSelectedDate(date, diasSeleccionados) {
    // obtener valor del input correspondiente al dia seleccionado
    return +diasSeleccionados[moment(date).day()];
}
function showDayInList(totalHorasProcesadas, nextDate) {
    let listItem =
        `<li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
            ${nextDate}
        </div>
        <span class="badge bg-primary rounded-pill horas">${totalHorasProcesadas}</span>
    </li>`
    orderedList.innerHTML += listItem;
}

inputFechaInicio.addEventListener('change', () => {
    let dia = moment(inputFechaInicio.value).format('dddd');
    diaFechaInicio.value = dia;
})

// Haciendo que cuando se actualicen las horas por dia se actualicen los campos seleccionados

const listCheckboxes = document.querySelectorAll('.seleccionar-dias input[type=checkbox]:not(#lunVieCheck)');

inputHorasDia.addEventListener('keyup', () => {

    listCheckboxes.forEach((checkbox) => {
        checkbox.nextElementSibling.nextElementSibling.disabled = !checkbox.checked;
        if (checkbox.checked) {
            checkbox.nextElementSibling.nextElementSibling.value = inputHorasDia.value;
        }
        if (!checkbox.checked) {
            checkbox.nextElementSibling.nextElementSibling.value = null;
        }
    });
})

const listWeekdaysCheckboxes = document.querySelectorAll('.seleccionar-dias input[type=checkbox]:not(#lunVieCheck,#sabCheck,#domCheck)');
inputLunVieCheck.addEventListener('change', (e) => {

    listWeekdaysCheckboxes.forEach(element => {
        if (inputLunVieCheck.checked) {
            element.checked = true;
            element.nextElementSibling.nextElementSibling.disabled = !element.checked;
            if (!element.checked == false) {
                element.nextElementSibling.nextElementSibling.value = inputHorasDia.value;
            }
        }

        if (!inputLunVieCheck.checked) {
            element.checked = false;
            element.nextElementSibling.nextElementSibling.disabled = !element.checked;
            if (!element.checked == true) {
                element.nextElementSibling.nextElementSibling.value = null;
            }
        }
    })
    sabDom.forEach(element => {
        if (element.checked) {
            element.checked = false;
            element.nextElementSibling.nextElementSibling.disabled = !element.checked
            if (!element.checked == true) {
                element.nextElementSibling.nextElementSibling.value = null;
            }
        }
    })
});

// Haciendo que si el sabado o domingo están seleccionados no se pueda elegir Lunes/Viernes

const sabDom = document.querySelectorAll('.seleccionar-dias input[type=checkbox]:not(#lunVieCheck,#lunCheck,#marCheck,#mieCheck,#jueCheck,#vieCheck');
sabDom.forEach(e => {
    e.addEventListener('change', () => {
        if (inputLunVieCheck.checked) {
            inputLunVieCheck.checked = false;
        }
    })
});


const weekdays = Array.from(listCheckboxes).filter((ele) => {
    return ele.id != 'sabCheck' && ele.id != 'domCheck';
});


listCheckboxes.forEach((checkbox) => {

    checkbox.addEventListener('change', ({ target }) => {
        elInput = !target.checked;
        target.nextElementSibling.nextElementSibling.disabled = !target.checked;
        if (target.checked) {
            target.nextElementSibling.nextElementSibling.value = inputHorasDia.value;
        }
        if (!target.checked) {
            target.nextElementSibling.nextElementSibling.value = null;
        }
    })
});

window.onload = function () {
    var now = moment();
    inputFechaInicio.value = now.format('YYYY-MM-DD');
}

// Resetear los valores del formulario para empezar uno nuevo

nuevoFormulario.addEventListener('click', () => {
    inputTotalHoras.value = '';
    inputHorasDia.value = '';
    var now = moment();
    inputFechaInicio.value = now.format('YYYY-MM-DD');
    diaFechaInicio.value = '';
    inputFechaFinal.value = '';
    inputDiasLaborar.value = '';
    diasDeClase.textContent = '';
        diasDeClase.classList.remove('activos');
    infoCurso.textContent = '';
        infoCurso.classList.remove('activos');
    copiarBtn.classList.remove('activos')
    orderedList.textContent = '';

    const fullWeekCheckBoxes = document.querySelectorAll('.seleccionar-dias input[type=checkbox]')
    fullWeekCheckBoxes.forEach(diaCheckBox => {
        diaCheckBox.checked = false;
    })

    const fullWeekInputs = document.querySelectorAll('.seleccionar-dias input[type=number]')
    fullWeekInputs.forEach(input => {
        input.disabled = true;
    })

    const fullWeek = document.querySelectorAll('.dia');
    fullWeek.forEach(dia => {
        dia.value = '';
    });
})

copiarBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(infoCurso.textContent)
})

// Mostrar dias feriados

mostrarFeriados.addEventListener('click', () => {
    alert('Los dias feriados son: ' + feriados.join(', '))
})

// excluir dias se activa y desactiva

excluirDias.addEventListener('change', () => {
    datePickerInput.classList.toggle('activo');
    if (!excluirDias.checked) {
        datePickerInput.value = ''
    }
})