// Oi Antony do futuro, lembre-se de abrir o servidor utilizando "node server.js" no terminal
const http = require('http');
const fs = require('fs');
const path = require('path');

// Função para ler e enviar arquivos estáticos para o cliente
function serveStaticFile(res, filePath, contentType, responseCode = 200) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Error');
        } else {
            res.writeHead(responseCode, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// Função para salvar dados no arquivo JSON, evitando duplicações de Nome completo e CPF
function saveData(data, callback) {
    const filePath = path.join(__dirname, 'data.json');

    fs.readFile(filePath, (err, fileData) => {
        if (err && err.code !== 'ENOENT') {
            // Se ocorrer um erro diferente de arquivo não encontrado, retorna o erro
            return callback(err);
        }

        let json = [];
        if (!err) {
            // Se o arquivo existir, converte os dados do arquivo para JSON
            json = JSON.parse(fileData);
        }

        // Verifica se os dados já existem no arquivo
        const exists = json.some(existingData => {
            // Verifica se Nome completo e CPF são iguais
            return existingData.nomeCompleto === data.nomeCompleto && existingData.cpf === data.cpf;
        });

        if (exists) {
            // Se os dados já existirem, chamamos o callback com uma mensagem informativa
            return callback(null, 'Dados já existem e não foram salvos novamente.');
        }

        // Se os dados não existirem, adicionamos ao array e salvamos no arquivo
        json.push(data);
        fs.writeFile(filePath, JSON.stringify(json, null, 2), callback);
    });
}

// Criar o servidor HTTP
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // Rotas para arquivos estáticos
        if (req.url === '/') {
            serveStaticFile(res, path.join(__dirname, 'index.html'), 'text/html');
        } else if (req.url === '/style.css') {
            serveStaticFile(res, path.join(__dirname, 'style.css'), 'text/css');
        } else if (req.url === '/script.js') {
            serveStaticFile(res, path.join(__dirname, 'script.js'), 'application/javascript');
        } else if (req.url === '/consultas') {
            serveStaticFile(res, path.join(__dirname, 'consultas.html'), 'text/html');
        } else if (req.url === '/sobre') {
            serveStaticFile(res, path.join(__dirname, 'sobre.html'), 'text/html');
        } else if (req.url === '/profissionais') {
            serveStaticFile(res, path.join(__dirname, 'profissionais.html'), 'text/html');
        } else if (req.url === '/login') {
            serveStaticFile(res, path.join(__dirname, 'login.html'), 'text/html');
        } else if (req.url.endsWith('.jpg')) {
            serveStaticFile(res, path.join(__dirname, req.url), 'image/jpeg');
        } else {
            // Rota não encontrada
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Não encontrado');
        }
    } else if (req.method === 'POST' && req.url === '/submit') {
        // Receber dados POST e salvar
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const parsedData = JSON.parse(body);
                saveData(parsedData, (err, message) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('500 - Erro interno');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end(message || 'Dados salvos com sucesso');
                    }
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('400 - Requisição inválida');
            }
        });
    } else {
        // Método não suportado ou rota não encontrada
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Não encontrado');
    }
});

// Iniciar o servidor na porta 3000
server.listen(3000, () => {
    console.log('O servidor está rodando, acesse o link: http://localhost:3000/');
});
