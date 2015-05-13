/*
* @Author: Reinaldo Antonio Camargo Rauch
* @Date:   2014-08-26 16:06:54
* @Last Modified by:   Reinaldo Antonio Camargo Rauch
* @Last Modified time: 2014-09-03 11:06:58
*/

/**
 * Gerador do xlsx
 * @type {xlsx}
 */
var xlsx = require('xlsx');

/**
 * Classe para a criação de um Excel
 * @param {Array} wsa Array com as planilhas a serem geradas
 */
function Workbook (wsa) {
    if(!(this instanceof Workbook))
        return new Workbook(wsa);

    // Array com a lista dos nomes das tabelas
    this.SheetNames = [];
    // Os dados das tabelas em si
    this.Sheets = {};

    // Itera sobre o array que veio como argumento e monta as variáveis
    for (var i = 0; i < wsa.length; i++) {
        var n = wsa[i].name;
        delete wsa[i].name;
        this.SheetNames.push(n);
        this.Sheets[n] = wsa[i];
    }
}

/**
 * Recebe o JSON vindo do socket e compila no objeto que a biblioteca xlsx
 * escreva o arquivo xlsx
 * @param  {Object}   buffer Objeto JSON deserializado
 * @param  {Function} cb     Callback
 */
function generateExcel (buffer, cb) {

    // Numero máximo de colunas
    var maxCols = buffer.maxCols,
        // Array de planílhas
        wsa = [],
        // Objeto de configuração do writer
        wbo = {
            bookType: 'xlsx',
            type: 'buffer'
        },
        buffer;

    // Remove do buffer a chave de número máximo de colunas
    delete buffer.maxCols;

    // Itera sobre as planílhas
    for(var sheet in buffer) {

        // Objeto inicial da planílha
        var ws = {
                name: sheet
            },
            // Objeto de range total da planílha
            range = {
                s: {
                    c: 10000000,
                    r: 10000000
                },
                e: {
                    c: 0,
                    r: 0
                }
            };

        // Referência para a planílha atual
        var s = buffer[sheet];

        // itera sobre as linhas
        for (var R = 0; R < s.length; R++) {
            // Itera sobre as colunas
            for (var C = 0; C <= maxCols; C++) {
                // avança a chave da coluna de acordo com o código ASCIIs
                var c = String.fromCharCode('A'.charCodeAt(0) + C);

                // Determinação dos ranges máximos da planílha
                if(range.s.r > R)
                    range.s.r = R;

                if(range.s.c > C)
                    range.s.c = C;

                if(range.e.r < R)
                    range.e.r = R;

                if(range.e.c < C)
                    range.e.c = C;


                // Se a célula for vazia, ignora
                if(typeof s[R][c] === 'undefined' || s[R][c] === null)
                    continue;

                // Construção do objeto da célula
                var v = String(s[R][c]),
                    cell = { v: v, t: 's' },
                    cellRef = xlsx.utils.encode_cell({c: C, r: R});

                // Adiciona a célula na planílha
                ws[cellRef] = cell;

            }
        }

        // Gera o range final da planílha
        if(range.s.c < 10000000)
            ws['!ref'] = xlsx.utils.encode_range(range);

        // Adiciona a planílha ao array de planílhas
        wsa.push(ws);
    }

    try {
        buffer = xlsx.write(new Workbook(wsa), wbo);
    } catch (e) {
        return cb(e);
    }

    // Escreve o workbook
    return cb(null, buffer);

}

// Buffer para o arquivo a ser enviado.
var buffer = [];

// Handler para o envio de dados no socket
process.stdin.on('data', function onData (data) {
    buffer.push(new Buffer(data));
});

// Handler de erros no socket
process.stdin.on('error', function onError (err) {
    process.stderr.write(err.message);
    process.exit(1);
});

// Handler para o fim da conexão
process.stdin.on('end', function onEnd () {
    // Concatena os buffers no array
    buffer = Buffer.concat(buffer);
    try {
        // Parseia o JSON
        buffer = JSON.parse(buffer);
    } catch(e) {
        process.stderr.write('Invalid JSON');
        return process.end(1);
    }

    return generateExcel(buffer, function (err, data) {
        if(err) {
            process.stderr.write(err.message);
            return process.exit(1);
        }

        process.stdout.write(data);
    });
});
