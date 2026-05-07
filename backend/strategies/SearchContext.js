class SearchContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  execute(texto, padrao) {
    return this.strategy.search(texto, padrao);
  }
}

module.exports = SearchContext;