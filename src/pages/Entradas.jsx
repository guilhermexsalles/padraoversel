import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../App.css';

// Menu de navegação estilizado
function Menu() {
  return (
    <nav>
      <Link to="/">Dashboard</Link> |{" "}
      <Link to="/entradas">Entradas</Link> |{" "}
      <Link to="/saidas">Saídas</Link>
    </nav>
  );
}

export default function Entradas() {
  const [entradas, setEntradas] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  // Detecta URL correta (local ou produção)
  const baseURL = import.meta.env.DEV
    ? 'http://localhost:3000'
    : import.meta.env.VITE_API_URL;

  // Carrega apenas as transações do tipo 'entrada'
  const carregarEntradas = () => {
    axios
      .get(`${baseURL}/api/transacoes`)
      .then((res) => {
        const entradasFiltradas = res.data.filter(
          (t) => t.tipo === "entrada"
        );
        setEntradas(entradasFiltradas);
      })
      .catch((err) =>
        console.error("Erro ao carregar entradas:", err.message)
      );
  };

  useEffect(() => {
    carregarEntradas();
  }, []);

  const adicionarEntrada = () => {
    if (!descricao || !valor) return;

    const nova = {
      descricao,
      valor: parseFloat(valor),
      tipo: "entrada",
      data: new Date().toISOString().slice(0, 10),
    };

    axios
      .post(`${baseURL}/api/transacoes`, nova)
      .then(() => {
        carregarEntradas();
        setDescricao("");
        setValor("");
      })
      .catch((err) =>
        console.error("Erro ao adicionar entrada:", err.message)
      );
  };

  const removerEntrada = (id) => {
    axios
      .delete(`${baseURL}/api/transacoes/${id}`)
      .then(() => carregarEntradas())
      .catch((err) =>
        console.error("Erro ao remover entrada:", err.message)
      );
  };

  return (
    <div>
      <Menu />

      <h1>Entradas</h1>

      <div className="card">
        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <input
          placeholder="Valor"
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <button onClick={adicionarEntrada}>Adicionar</button>
      </div>

      <div className="card">
        <ul>
          {entradas.map((e) => (
            <li key={e.id}>
              {e.descricao} – R$ {Number(e.valor).toFixed(2)}
              <button onClick={() => removerEntrada(e.id)}>Remover</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
