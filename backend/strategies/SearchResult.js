class SearchResult {
  constructor(posicoes, tempo, N, M) {
    this.posicoes = posicoes;
    this.ocorrencias = posicoes.length;
    this.encontrado = posicoes.length > 0;
    this.tempo = tempo;
    this.N = N;
    this.M = M;
  }
}

module.exports = SearchResult;