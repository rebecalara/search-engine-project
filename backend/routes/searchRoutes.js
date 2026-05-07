const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const { trace } = require("@opentelemetry/api");

const { searchDuration, searchRequests } = require("../metrics/metrics");

const NaiveSearch = require("../strategies/NaiveSearch");
const KMP = require("../strategies/KMP");
const RabinKarp = require("../strategies/RabinKarp");
const SearchContext = require("../strategies/SearchContext");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  const tracer = trace.getTracer("search-tracer");

  const span = tracer.startSpan("search-request");

  console.log("Span iniciado:", span.spanContext().traceId);

  try {
    const termo = req.body.termo.toLowerCase();
    const algoritmo = req.body.algoritmo;

    let texto = "";

    const extensao = path.extname(req.file.originalname);

    if (extensao === ".txt") {
      texto = fs.readFileSync(req.file.path, "utf-8");
    } else if (extensao === ".pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);

      const pdfData = await pdfParse(dataBuffer);

      texto = pdfData.text;
    } else {
      return res.status(400).json({
        erro: "Formato não suportado",
      });
    }

    texto = texto.toLowerCase();

    console.log("===== NOVA BUSCA =====");
    console.log("Algoritmo:", algoritmo);
    console.log("Termo:", termo);
    console.log("Tamanho do Texto (N):", texto.length);
    console.log("Tamanho do Padrão (M):", termo.length);

    let strategy;

    switch (algoritmo) {
      case "naive":
        strategy = new NaiveSearch();
        break;

      case "kmp":
        strategy = new KMP();
        break;

      case "rabin":
        strategy = new RabinKarp();
        break;

      default:
        return res.status(400).json({
          erro: "Algoritmo inválido",
        });
    }

    const context = new SearchContext(strategy);

    const resultado = context.execute(texto, termo);

    searchDuration.labels(algoritmo).observe(resultado.tempo);

    searchRequests.labels(algoritmo).inc();

    console.log("Tempo:", resultado.tempo, "ms");
    console.log("Ocorrências:", resultado.ocorrencias);
    console.log("Encontrado:", resultado.encontrado);
    console.log("Posições:", resultado.posicoes);
    console.log("======================");

    span.setAttribute("algoritmo", algoritmo);
    span.setAttribute("ocorrencias", resultado.ocorrencias);
    span.setAttribute("tempo_ms", resultado.tempo);

    span.end();

    fs.unlinkSync(req.file.path);

    res.json(resultado);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      erro: "Erro na busca",
    });
  }
});

module.exports = router;
