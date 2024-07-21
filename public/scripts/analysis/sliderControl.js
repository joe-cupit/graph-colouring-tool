// https://medium.com/@predragdavidovic10/native-dual-range-slider-html-css-javascript-91e778134816
function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
}

function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
}

function controlToSlider(fromSlider, toSlider, toInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, toSlider);
  setToggleAccessible(toSlider);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
    toSlider.value = from;
  }
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

function fillSlider(from, to, controlSlider) {
    sliderCol = '#7a6bb5';
    otherCol = '#C6C6C6';
    if (controlSlider.disabled) {
        sliderCol = '#d1d1d1';
        otherCol = '#e8e7e7';
    }

    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${otherCol} 0%,
      ${otherCol} ${(fromPosition)/(rangeDistance)*100}%,
      ${sliderCol} ${((fromPosition)/(rangeDistance))*100}%,
      ${sliderCol} ${(toPosition)/(rangeDistance)*100}%, 
      ${otherCol} ${(toPosition)/(rangeDistance)*100}%, 
      ${otherCol} 100%)`;
}

function setToggleAccessible(currentTarget) {
  const toSlider = currentTarget;
  if (Number(currentTarget.value) <= 0 ) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
}

const fromSlider = document.querySelector('#fromSlider');
const toSlider = document.querySelector('#toSlider');
const fromSlider2 = document.querySelector('#fromSlider2');
const toSlider2 = document.querySelector('#toSlider2');

fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, nodesFrom);
toSlider.oninput = () => controlToSlider(fromSlider, toSlider, nodesTo);
nodesFrom.oninput = () => controlFromInput(fromSlider, nodesFrom, nodesTo, toSlider);
nodesTo.oninput = () => controlToInput(toSlider, nodesFrom, nodesTo, toSlider);
fillSlider(fromSlider, toSlider, toSlider);
setToggleAccessible(toSlider);

fromSlider2.oninput = () => controlFromSlider(fromSlider2, toSlider2, densityFrom);
toSlider2.oninput = () => controlToSlider(fromSlider2, toSlider2, densityTo);
densityFrom.oninput = () => controlFromInput(fromSlider2, densityFrom, densityTo, toSlider2);
densityTo.oninput = () => controlToInput(toSlider2, densityFrom, densityTo, toSlider2);
fillSlider(fromSlider2, toSlider2, toSlider2);
setToggleAccessible(toSlider2);
