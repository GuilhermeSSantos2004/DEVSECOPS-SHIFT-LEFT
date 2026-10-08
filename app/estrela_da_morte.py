import sqlite3
import platform
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
import requests
from flask import Flask, request

app = Flask(__name__)

@app.route("/porta-termica")
def porta_termica():
    alvo = request.args.get("alvo", "")
    with sqlite3.connect("rebeldes.db") as conn:
        return str(conn.execute("SELECT * FROM pilotos WHERE nome = ?", (alvo,)).fetchall())

@app.route("/holocron")
def holocron():
    acao = request.args.get("cmd", "")
    if acao == "data":
        return datetime.now(timezone.utc).isoformat()
    if acao == "sistema":
        return platform.system()
    return "Ação inválida", 400

@app.route("/forca")
def forca():
    # A rota aceita somente um numero decimal; nenhum codigo e executado.
    expressao = request.args.get("exp", "")
    if len(expressao) > 100:
        return "Entrada muito longa", 400
    try:
        valor = Decimal(expressao)
    except InvalidOperation:
        return "Informe um número decimal", 400
    if not valor.is_finite():
        return "Número inválido", 400
    return str(valor)

@app.route("/aliados")
def aliados():
    try:
        resposta = requests.get("https://aliados.rebeldes.org/lista", timeout=5)
        resposta.raise_for_status()
        return resposta.text
    except requests.RequestException:
        return "Serviço indisponível", 502

if __name__ == "__main__":
    app.run(debug=False, host="127.0.0.1")
