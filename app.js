const inputTotalHoras = document.querySelector('#inputTotalHoras');
const inputHorasDia = document.querySelector('#inputHorasDia');
const btnProcesar = document.querySelector('#procesar');
const inputFechaInicio = document.querySelector('#inputFechaInicio');
const inputDiasLaborar = document.querySelector('#inputDiasLaborar');
const inputFechaFinal = document.querySelector('#inputFechaFinal');
const inputLunVieCheck = document.querySelector('#lunVieCheck');
const nuevoFormulario = document.querySelector('#nuevo');
const diasDeClase = document.querySelector('#diasDeClase');
const copiarBtn = document.querySelector('.copiar-boton');
const infoCurso = document.querySelector('#infoCurso');
const checkBoxes = document.querySelectorAll('.seleccionar-dias input[type=checkbox]:not(#lunVieCheck)')


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

    // Sumando el valor de todos los input fde horas XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    let horasPorDiaObj = {
        '0': 0,
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
    }

    const inputTotalHorasDia = document.querySelectorAll('.seleccionar-dias input[type=number]');

    inputTotalHorasDia.forEach(element => {
        if (element.previousElementSibling.previousElementSibling.checked) {
            let valorInput = element.value;
            let valorIndex = element.getAttribute(['data-index']);
            horasPorDiaObj[valorIndex] = valorInput;
        }
    })

    let totalhorasPorDia = Object.entries(horasPorDiaObj).map(num => +num[1]).reduce((p, c) => {
        return p + c;
    });

    console.log(totalhorasPorDia);

    let diasLaborar = calcDiasLaborar(inputTotalHoras.value, totalhorasPorDia);
    inputDiasLaborar.value = diasLaborar;

    var fechaInicio = moment(inputFechaInicio.value);

    inputFechaFinal.value = moment(fechaInicio).add(diasLaborar - 1, 'days').format('YYYY-MM-DD');

    // Inyectandole al parrafo los dias que se seleccionaron para dar clases

    const diasFinales = []

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

function calcDiasLaborar(totalHoras, horasDia) {
    let diasLaborar = totalHoras / horasDia;
    return diasLaborar;
}

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
    inputTotalHoras.value = 45;
    inputHorasDia.value = 10;
    var now = moment();
    inputFechaInicio.value = now.format('YYYY-MM-DD');
    inputFechaFinal.value = '';
    inputDiasLaborar.value = '';

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