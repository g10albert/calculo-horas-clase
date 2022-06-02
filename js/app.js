// const moment = require("moment");

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
const mes = document.querySelector("#lista-mes")

const excluirDias = document.querySelector('#excDias');
const datePicker = new Datepicker('#datepicker', {
    multiple: true,
    min: (function () {
        return new Date();
    })()
});
const datePickerInput = document.querySelector('.excluir')
const orderedList = document.querySelector('#lista')

// Conexión con la base de datos para crear array de dias feriados

const feriados = [];
// async function fetchDates() {
//     const response = await fetch('http://localhost/manolo_api/');
//     const dates = await response.json();
//     for (let i = 0; i < dates.length; i++) {
//         feriados.push(moment(dates[i].dia_festivo).format('MM-DD-YYYY'))
//     }
// }

// fetchDates();

// Validar que no se pongan datos menores o menores de los permitidos

const MINIMO_TOTAL_HORAS = 15;
const MAXIMO_TOTAL_HORAS = 1000;

const MINIMO_HORAS_DIA = 1;
const MAXIMO_HORAS_DIA = 12;

let arrayAgrupar = [];

let contadorTotalHoras = 0

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

    horasPorDiaArray = [];

    arrayAgrupar = [];

    contadorTotalHoras = 0

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

    let totalHorasProcesadas = +inputTotalHoras.value;
    let cantidadDiasLaborar = 0;

    // Procesar informacion dependiendo en los dias seleccionados y horas a impartir

    if (checkTotalHorasDia.length > 0) {

        if (!isDateOnSelectedDays(fechaInicio, diasSeleccionados)) {
            alert("La fecha de inicio no esta marcada en los dias")
            return;
        }

        orderedList.innerHTML = '';

        let nextDate = moment(fechaInicio);
        let diasNoLabora = []
        let noLabora = -1;

        let horasMesArray = []
        let mesInicial = moment(inicio);
        let totalHorasProcesadasMes = 0;
        let newMonth = 0;

        let horasPorMesAntes = [];

        let mesHoras = [];
        let horasPorMes = [];

        // Obtener datos para luego organizarlos y mostrarlos en pantalla

        let showMonthInListArray = [];

        let showHoursInListArray = [];

        let totalHorasProcesadasArray = [];

        let horasPorDiaArray = [];

        let nextDateArray = [];

        let nextDateArrayMes = [];

        let horaPorDia = 0

        while (totalHorasProcesadas > 0) {

            if (isDateOnSelectedDays(nextDate, diasSeleccionados)) {

                if (!feriadosExcluidos.includes(nextDate.format('MM-DD-YYYY'))) {
                    cantidadDiasLaborar++;
                    horaPorDia = getValueFromSelectedDate(nextDate, diasSeleccionados);
                    totalHorasProcesadas -= horaPorDia;

                    horasPorDiaArray.push(horaPorDia)

                    // contar horas que se dan por mes

                    let horasMes = 0;
                    totalHorasProcesadasMes += getValueFromSelectedDateMonth(nextDate, diasSeleccionados);
                    newMonth = getValueFromSelectedDateMonth(nextDate, diasSeleccionados);

                    if (mesInicial.format('MMMM') == nextDate.format('MMMM')) {

                        horasMes += totalHorasProcesadasMes;
                        horasMesArray.push(horasMes);

                        horasPorMesAntes.push(horasMesArray[horasMesArray.length - 1])

                    } else {

                        horasPorMes.push(horasMesArray[horasMesArray.length - 1]);

                        totalHorasProcesadasMes = newMonth;
                        horasMesArray = [];
                        mesInicial.add(1, 'M');

                    }

                    // Incluir meses en array para mostrarlo en el programa

                    if (!mesHoras.includes(mesInicial.format('MMMM'))) {

                        mesHoras.push(mesInicial.format('MMMM'));

                    }

                    // Insertar mes cuando cambia

                    if (mes.textContent.trim() != nextDate.format('MMMM')) {

                        showMonthInListArray.push(moment(nextDate))

                    }

                    mes.textContent = nextDate.format('MMMM');

                    totalHorasProcesadasArray.push(totalHorasProcesadas)

                    nextDateArray.push(moment(nextDate).format('MM-DD-YYYY dddd'))

                    nextDateArrayMes.push(moment(nextDate).format('MM'))

                }

                // Proceso de dias feriados 

                else {
                    noLabora += 1;
                    diasNoLabora.push(nextDate.format('MM-DD-YYYY'))
                }

            }
            nextDate = nextDate.add(1, 'days')

        }

        horasPorMes.push(horasPorMesAntes[horasPorMesAntes.length - 1]);


        for (let i = 0; i < horasPorMes.length; i++) {
            showHoursInListArray.push(horasPorMes[i])
        }

        // Crear nuevos arrays con la informacion organizada y lista para mostrar

        let showMonthInListArrayProcesado = [];

        for (let i = 0; i < showMonthInListArray.length; i++) {
            showMonthInListArrayProcesado.push(showMonthInListArray[i].format('MMMM'))
        }

        let showHoursInListArrayProcesado = [];

        for (let i = 0; i < showHoursInListArray.length; i++) {
            showHoursInListArrayProcesado.push(showHoursInListArray[i])
        }

        let totalHorasProcesadasArrayProcesado = [];

        for (let i = 0; i < totalHorasProcesadasArray.length; i++) {
            totalHorasProcesadasArrayProcesado.push(totalHorasProcesadasArray[i])
        }

        let nextDateArrayProcesado = [];

        for (let i = 0; i < nextDateArray.length; i++) {
            nextDateArrayProcesado.push(nextDateArray[i])
        }

        let nextDateArrayMesProcesado = [];

        for (let i = 0; i < nextDateArrayMes.length; i++) {
            nextDateArrayMesProcesado.push(nextDateArrayMes[i])
        }

        // Crear while loop que va a controlar cuando se muestra cada informacion al usuario

        let siguienteFecha = moment(nextDateArrayMesProcesado[0]).format('MM')

        let mostrarMes = 0;

        for (let i = 0; i < nextDateArrayProcesado.length; i++) {

            if (nextDateArrayMesProcesado[i] != nextDateArrayMesProcesado[i - 1]) {

                // showMonthInList(moment(siguienteFecha), showHoursInListArray[mostrarMes])

                siguienteFecha = moment(nextDateArrayMesProcesado[0]).add(mostrarMes + 1, 'M').format('MM');

                mostrarMes = mostrarMes + 1
            }

            showDayInList(totalHorasProcesadasArrayProcesado[i], nextDateArrayProcesado[i], moment(siguienteFecha), horasPorDiaArray[i])

        }

        let mesesOrganizados = arrayAgrupar.reduce((group, item) => {
            const { mes } = item;
            group[mes] = group[mes] ?? [];
            group[mes].push(item);
            return group;
        }, {})

        mostrarInformacionOrganizada(mesesOrganizados)




















        let infoFinalCurso = '';
        let ultimoDia = 0;

        inputFechaFinal.value = nextDate.subtract(1, 'days').format('MM-DD-YYYY');

        // Proceso cuando las horas procesadas son mas que el total de horas del curso

        if (totalHorasProcesadasArrayProcesado[totalHorasProcesadasArrayProcesado.length - 1] < 0) {

            if (nextDate.day() in diasSeleccionados) {
            } else {
                nextDate = nextDate.subtract(1, 'days')
                let horasSobran = totalHorasProcesadas - (+inputTotalHoras.value);
                ultimoDia = (getValueFromSelectedDate(nextDate, diasSeleccionados) - horasSobran);
            }

            let horasTotalesDadas = totalHorasProcesadas - (+inputTotalHoras.value);

            let horasSobran = Math.abs(-(horasTotalesDadas + (+inputTotalHoras.value)));

            ultimoDia = (getValueFromSelectedDate(nextDate, diasSeleccionados) - horasSobran);

            if (ultimoDia > 0) {
                infoFinalCurso = `El ultimo dia de clase se impartirán: ${horasSobran} horas. `;
            }
        }

        if (diasNoLabora.length != 0) {
            infoFinalCurso += `No se laborará el ${diasNoLabora.join(', ')}. `
        }

        for (let i = 0; i < mesHoras.length; i++) {
            infoFinalCurso += `En ${mesHoras[i]} se impartirán ${horasPorMes[i]} horas. `
        }

        if (ultimoDia > 0 || diasNoLabora.length != 0) {
            if (!infoCurso.classList.contains('activos')) {
                infoCurso.classList.toggle('activos');
            }
            if (!copiarBtn.classList.contains('activos')) {
                copiarBtn.classList.toggle('activos')
            }
        }

        if (diasDeClase != '') {
            if (!diasDeClase.classList.contains('activos')) {
                diasDeClase.classList.toggle('activos')
            }
        }

        infoCurso.textContent = infoFinalCurso;

        inputDiasLaborar.value = cantidadDiasLaborar;

    } else {
        alert('Debe seleccionar al menos un dia');
    }

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

function actualizarDiasSeleccionados() {
    const inputsDiasSeleccionados = document.querySelectorAll('.seleccionar-dias input[type=number]:not(:disabled)');
    // Obtener los dias seleccionados
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

function getValueFromSelectedDateMonth(date, diasSeleccionados) {
    // obtener valor del input correspondiente al dia seleccionado para contrar las horas por mes
    return +diasSeleccionados[moment(date).day()];
}

// Mostrar mes en la caja de fechas


let totalHorasMostrar = 0

function mostrarInformacionOrganizada(datos) {

    let mesItem = ''

    let horasTotalMesFinal = 0

    

    for (let key in datos) {

        let horasTotalMes = 0

        for (let item2 of datos[key]) {
            horasTotalMes += item2.horaDia;
        }

        horasTotalMesFinal += horasTotalMes;


        let horasRestan = horasTotalMesFinal - (+inputTotalHoras.value);

        if (horasTotalMesFinal > +inputTotalHoras.value) {
            horasTotalMes -= horasRestan;
        }

        mesItem +=
            `<div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button" id="lista-mes" type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapse-${key}" aria-expanded="true">
                    ${key} <div class="">${horasTotalMes}</div>
                </button>
                
            </h2>
            <div id="panelsStayOpen-collapse-${key}"
                class="accordion-collapse collapse show">
                <div class="accordion-body">
                   `;
        
        for (let item of datos[key]) {
            
            contadorTotalHoras += item.horaDia

            if (contadorTotalHoras > +inputTotalHoras.value) {
                item.horaDia = horasRestan;
            }

            mesItem +=
                `<li class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="ms-2 me-auto">
                        ${item.fecha}
                    </div>
                    <span class="badge bg-primary rounded-pill horas">${item.horaDia}</span>
                </li>`;
        }

        mesItem += `
                </div>
            </div>
        </div>`;
    }


    orderedList.innerHTML = mesItem
    totalHorasMostrar += 1
}

function addObjectToArray(objeto, array) {
    array.push(objeto)
}


// Mostrar la fecha y horas de clases que se han dado hasta el momento

function showDayInList(totalHorasProcesadas, nextDate, month, horaDia) {

    let mesActual = month.subtract(1, 'M').format('MMMM');

    let horasSobran = totalHorasProcesadas - (+inputTotalHoras.value);

    if (totalHorasProcesadas > inputTotalHoras.value) {
        totalHorasProcesadas -= horasSobran;
    }

    addObjectToArray(
        { fecha: nextDate, hora: totalHorasProcesadas, mes: mesActual, horaDia: horaDia }, arrayAgrupar
    )

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

// Controlando la seleccion de diferentes dias

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

// Activar y desactivar los inputs de selección con los checkboxes y labels

listCheckboxes.forEach((checkbox) => {

    checkbox.addEventListener('change', ({ target }) => {
        target.nextElementSibling.nextElementSibling.disabled = !target.checked;
        if (target.checked) {
            target.nextElementSibling.nextElementSibling.value = inputHorasDia.value;
        }
        if (!target.checked) {
            target.nextElementSibling.nextElementSibling.value = null;
        }
    })

});

// Haciendo que la fecha de inicio sea la de este momento al cargar la pagina

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
    infoCurso.textContent = '';
    diasDeClase.classList.remove('activos');
    infoCurso.classList.remove('activos');
    copiarBtn.classList.remove('activos');
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

// Boton para copiar informacion del curso

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