const SearchResult = require("./SearchResult");

class KMP {
  construirLPS(padrao) {
    let lps = Array(padrao.length).fill(0);

    let len = 0;
    let i = 1;

    while (i < padrao.length) {
      if (padrao[i] === padrao[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }

    return lps;
  }

  search(texto, padrao) {
    const inicio = Date.now();

    let posicoes = [];
    let lps = this.construirLPS(padrao);

    let i = 0;
    let j = 0;

    while (i < texto.length) {
      if (padrao[j] === texto[i]) {
        i++;
        j++;
      }

      if (j === padrao.length) {
        posicoes.push(i - j);
        j = lps[j - 1];
      } else if (i < texto.length && padrao[j] !== texto[i]) {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
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

module.exports = KMP;