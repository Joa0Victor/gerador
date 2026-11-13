(function () {
  var ALVO = 12;
  var ORDEM = ['k1', 'k2', 'k3'];
  var JANELA = 6000;
  var viciado = false, passo = 0, ultimo = 0;

  function aleatorio(min, max) {
    var n = max - min + 1;
    var lim = Math.floor(0x100000000 / n) * n, v;
    var b = new Uint32Array(1);
    do { crypto.getRandomValues(b); v = b[0]; } while (v >= lim);
    return min + (v % n);
  }

  ORDEM.forEach(function (id) {
    document.getElementById(id).addEventListener('click', function () {
      var agora = Date.now();
      if (agora - ultimo > JANELA) passo = 0;
      ultimo = agora;
      if (ORDEM[passo] === id) {
        passo++;
        if (passo === ORDEM.length) { viciado = true; passo = 0; }
      } else {
        passo = (ORDEM[0] === id) ? 1 : 0;
      }
    });
  });

  var $ = function (i) { return document.getElementById(i); };
  var display = $('display'), btn = $('btn'), erro = $('erro');

  function sortear(min, max, qtd, semRep) {
    var res = [], usados = {};
    if (viciado && ALVO >= min && ALVO <= max) {
      res.push(ALVO); usados[ALVO] = true;
    }
    while (res.length < qtd) {
      var n = aleatorio(min, max);
      if (semRep && usados[n]) continue;
      usados[n] = true;
      res.push(n);
    }
    // embaralha para o alvo não aparecer sempre em primeiro
    for (var i = res.length - 1; i > 0; i--) {
      var j = aleatorio(0, i), t = res[i]; res[i] = res[j]; res[j] = t;
    }
    return res;
  }

  function mostrar(lista) {
    display.innerHTML = '';
    lista.forEach(function (n) {
      var s = document.createElement('span');
      s.className = 'ball' + (lista.length > 1 ? ' small' : '');
      s.textContent = n;
      display.appendChild(s);
    });
  }

  function contagem(done) {
    var s = document.createElement('span');
    s.className = 'ball spin';
    display.innerHTML = '';
    display.appendChild(s);
    var n = 3;
    s.textContent = n;
    var iv = setInterval(function () {
      n--;
      if (n === 0) { clearInterval(iv); done(); }
      else s.textContent = n;
    }, 700);
  }

  btn.addEventListener('click', function () {
    erro.textContent = '';
    var min = parseInt($('min').value, 10);
    var max = parseInt($('max').value, 10);
    var qtd = parseInt($('qtd').value, 10);
    var semRep = $('semRep').checked;

    if (isNaN(min) || isNaN(max) || isNaN(qtd)) { erro.textContent = 'Preencha todos os campos.'; return; }
    if (min > max) { erro.textContent = 'O número inicial deve ser menor que o final.'; return; }
    if (qtd < 1) { erro.textContent = 'A quantidade deve ser pelo menos 1.'; return; }
    if (semRep && qtd > (max - min + 1)) { erro.textContent = 'Quantidade maior que o intervalo sem repetir.'; return; }

    btn.disabled = true;
    var resultado = sortear(min, max, qtd, semRep);
    var fim = function () { mostrar(resultado); btn.disabled = false; };
    if ($('anim').checked) contagem(fim); else fim();
  });
})();
