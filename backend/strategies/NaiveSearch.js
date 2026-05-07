const SearchResult = require("./SearchResult");

class NaiveSearch {
  search(texto, padrao) {
    const inicio = Date.now();

    let posicoes = [];

    for (let i = 0; i <= texto.length - padrao.length; i++) {
      let match = true;

      for (let j = 0; j < padrao.length; j++) {
        if (texto[i + j] !== padrao[j]) {
          match = false;
          break;
        }
      }

      if (match) {
        posicoes.push(i);
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

module.exports = NaiveSearch;