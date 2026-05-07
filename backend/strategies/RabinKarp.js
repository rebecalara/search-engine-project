const SearchResult = require("./SearchResult");

class RabinKarp {
  search(texto, padrao) {
    const inicio = Date.now();

    const d = 256;
    const q = 101;

    const n = texto.length;
    const m = padrao.length;

    let p = 0;
    let t = 0;
    let h = 1;

    let posicoes = [];

    for (let i = 0; i < m - 1; i++) {
      h = (h * d) % q;
    }

    for (let i = 0; i < m; i++) {
      p = (d * p + padrao.charCodeAt(i)) % q;
      t = (d * t + texto.charCodeAt(i)) % q;
    }

    for (let i = 0; i <= n - m; i++) {
      if (p === t) {
        let match = true;

        for (let j = 0; j < m; j++) {
          if (texto[i + j] !== padrao[j]) {
            match = false;
            break;
          }
        }

        if (match) {
          posicoes.push(i);
        }
      }

      if (i < n - m) {
        t =
          (d * (t - texto.charCodeAt(i) * h) +
            texto.charCodeAt(i + m)) %
          q;

        if (t < 0) {
          t += q;
        }
      }
    }

    const fim = Date.now();

    return new SearchResult(
      posicoes,
      fim - inicio,
      texto.length,
      padrao.length
    );
  }
}

module.exports = RabinKarp;