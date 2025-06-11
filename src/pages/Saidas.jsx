import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

// Menu reutilizável
function Menu() {
  return (
    <nav>
      <Link to="/">Dashboard</Link> |{" "}
      <Link to="/entradas">Entradas</Link> |{" "}
      <Link to="/saidas">Saídas</Link>
    </nav>
  );
}

export default function Saidas() {
  const [saidas, setSaidas] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  // Detecta se está em ambiente local ou produção
  const baseURL = import.meta.env.DEV
    ? 'http://localhost:3000'
    : import.meta.env.VITE_API_URL;

  const carregarSaidas = () => {
    axios.get(`${baseURL}/api/transacoes`)
      .then((res) => {
        const saidasFiltradas = res.data.filter((t) => t.tipo === 'saida');
        setSaidas(saidasFiltradas);
      })
      .catch((err) => console.error("Erro ao carregar saídas:", err.message));
  };

  useEffect(() => {
    carregarSaidas();
  }, []);

  const adicionarSaida = () => {
    if (!descricao || !valor) return;

    const nova = {
      descricao,
      valor: parseFloat(valor),
      tipo: "saida",
      data: new Date().toISOString().slice(0, 10)
    };

    axios.post(`${baseURL}/api/transacoes`, nova)
      .then(() => {
        carregarSaidas();
        setDescricao("");
        setValor("");
      })
      .catch((err) => console.error("Erro ao adicionar saída:", err.message));
  };

  const removerSaida = (id) => {
    axios.delete(`${baseURL}/api/transacoes/${id}`)
      .then(() => carregarSaidas())
      .catch((err) => console.error("Erro ao remover saída:", err.message));
  };

  return (
    <div>
      <Menu />

      <h1>Saídas</h1>

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
        <button onClick={adicionarSaida}>Adicionar</button>
      </div>

      <div className="card">
        <ul>
          {saidas.map((s) => (
            <li key={s.id}>
              {s.descricao} - R$ {(parseFloat(s.valor) || 0).toFixed(2)}
              <button onClick={() => removerSaida(s.id)}>Remover</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
