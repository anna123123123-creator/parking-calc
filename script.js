(function () {
  'use strict';

  var entryInput = document.getElementById('entryInput');
  var exitInput = document.getElementById('exitInput');
  var freeMinInput = document.getElementById('freeMinInput');
  var firstHourInput = document.getElementById('firstHourInput');
  var extraHourInput = document.getElementById('extraHourInput');
  var capInput = document.getElementById('capInput');

  var feeOut = document.getElementById('feeOut');
  var durationOut = document.getElementById('durationOut');
  var freeStatusOut = document.getElementById('freeStatusOut');
  var rawFeeOut = document.getElementById('rawFeeOut');

  function toLocalInputValue(date) {
    var pad = function (n) { return String(n).padStart(2, '0'); };
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  }

  function num(input) {
    var v = parseFloat(input.value);
    return isNaN(v) ? 0 : v;
  }

  function calc() {
    var entry = new Date(entryInput.value);
    var exit = new Date(exitInput.value);
    var freeMin = num(freeMinInput);
    var firstHour = num(firstHourInput);
    var extraHour = num(extraHourInput);
    var cap = num(capInput);

    if (!entryInput.value || !exitInput.value || isNaN(entry.getTime()) || isNaN(exit.getTime())) {
      feeOut.textContent = '--';
      durationOut.textContent = '';
      freeStatusOut.textContent = '';
      rawFeeOut.textContent = '';
      return;
    }

    var durationMin = (exit - entry) / 60000;
    if (durationMin < 0) {
      feeOut.textContent = '--';
      durationOut.textContent = '出场时间早于入场时间，请检查';
      freeStatusOut.textContent = '';
      rawFeeOut.textContent = '';
      return;
    }

    var h = Math.floor(durationMin / 60);
    var m = Math.round(durationMin % 60);
    durationOut.textContent = h + ' 小时 ' + m + ' 分钟';

    if (durationMin <= freeMin) {
      feeOut.textContent = '¥0.00';
      freeStatusOut.textContent = '是（免费时长内）';
      rawFeeOut.textContent = '¥0.00';
      return;
    }

    freeStatusOut.textContent = '否（已超出免费时长）';
    var billableHours = Math.max(1, Math.ceil(durationMin / 60));
    var rawFee = firstHour + Math.max(0, billableHours - 1) * extraHour;
    var days = Math.max(1, Math.ceil(durationMin / (24 * 60)));
    var capTotal = days * cap;
    var fee = cap > 0 ? Math.min(rawFee, capTotal) : rawFee;

    rawFeeOut.textContent = '¥' + rawFee.toFixed(2);
    feeOut.textContent = '¥' + fee.toFixed(2);
  }

  [entryInput, exitInput, freeMinInput, firstHourInput, extraHourInput, capInput].forEach(function (el) {
    el.addEventListener('input', calc);
  });

  var now = new Date();
  var twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  entryInput.value = toLocalInputValue(twoHoursAgo);
  exitInput.value = toLocalInputValue(now);
  calc();
})();
