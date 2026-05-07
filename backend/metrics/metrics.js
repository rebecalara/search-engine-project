const client = require("prom-client");

const register = new client.Registry();

client.collectDefaultMetrics({
  register,
});

const searchDuration = new client.Histogram({
  name: "search_duration_ms",
  help: "Tempo de execução das buscas",
  labelNames: ["algorithm"],

  buckets: [1, 5, 10, 50, 100, 500],
});

const searchRequests = new client.Counter({
  name: "search_requests_total",
  help: "Número total de buscas",
  labelNames: ["algorithm"],
});

register.registerMetric(searchDuration);
register.registerMetric(searchRequests);

module.exports = {
  register,
  searchDuration,
  searchRequests,
};