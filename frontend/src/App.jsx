import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [termo, setTermo] = useState("");
  const [algoritmo, setAlgoritmo] = useState("naive");
  const [resultado, setResultado] = useState(null);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSearch = async () => {
    if (!file) {
      setErro("Selecione um arquivo TXT.");
      return;
    }

    if (!termo) {
      setErro("Digite um termo para pesquisa.");
      return;
    }

    setErro("");
    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("termo", termo);
    formData.append("algoritmo", algoritmo);

    try {
      const response = await fetch("http://localhost:3000/search", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setResultado(data);
    } catch (error) {
      console.log(error);
      setErro("Erro ao realizar busca.");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Motor de Busca</h1>

      <div>
        <input
          type="file"
          accept=".txt,.pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <br />

      <div>
        <input
          type="text"
          placeholder="Digite o termo"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />
      </div>

      <br />

      <div>
        <select
          value={algoritmo}
          onChange={(e) => setAlgoritmo(e.target.value)}
        >
          <option value="naive">Naive</option>
          <option value="kmp">KMP</option>
          <option value="rabin">Rabin-Karp</option>
        </select>
      </div>

      <br />

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <button onClick={handleSearch}>
        {loading ? "Pesquisando..." : "Pesquisar"}
      </button>

      <hr />

      {resultado && (
        <div className="resultado">
          <h2>Resultado</h2>

          <p>
            <strong>Encontrado:</strong> {resultado.encontrado ? "Sim" : "Não"}
          </p>

          <p>
            <strong>Ocorrências:</strong> {resultado.ocorrencias}
          </p>

          <p>
            <strong>Posições:</strong> {resultado.posicoes.join(", ")}
          </p>

          <p>
            <strong>Tempo:</strong> {resultado.tempo} ms
          </p>

          <p>
            <strong>N:</strong> {resultado.N}
          </p>

          <p>
            <strong>M:</strong> {resultado.M}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
