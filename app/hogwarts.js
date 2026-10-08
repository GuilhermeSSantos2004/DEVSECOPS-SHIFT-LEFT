const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// API de demonstracao sem sessao/cookies, sem estado persistido e sem autenticacao por cookie.
// A regra CSRF pressupoe autenticacao ambiente; aqui as respostas sao JSON e o token e explicito.
// nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
const app = express();
app.use(express.json({ limit: "16kb" }));

app.get("/feitiço", (req, res) => {
  res.json({ nome: String(req.query.nome || "") });
});

app.post("/senha", (req, res) => {
  const senha = req.body && req.body.senha;
  if (typeof senha !== "string" || senha.length < 8 || senha.length > 256) {
    return res.status(400).json({ erro: "Senha deve ter de 8 a 256 caracteres" });
  }
  const salt = crypto.randomBytes(16).toString("hex");
  crypto.scrypt(senha, salt, 64, (erro, hash) => {
    if (erro) return res.status(500).json({ erro: "Falha ao calcular hash" });
    res.json({ algoritmo: "scrypt", salt, hash: hash.toString("hex") });
  });
});

app.get("/mapa", (req, res) => {
  const chave = process.env.SEGREDO_JWT;
  if (!chave || Buffer.byteLength(chave, "utf8") < 32) {
    return res.status(503).json({ erro: "Chave JWT ausente ou muito curta" });
  }
  try {
    const dados = jwt.verify(String(req.query.token || ""), chave, { algorithms: ["HS256"] });
    res.json(dados);
  } catch (erro) {
    res.status(401).json({ erro: "Token inválido" });
  }
});

app.listen(3000, "127.0.0.1");
