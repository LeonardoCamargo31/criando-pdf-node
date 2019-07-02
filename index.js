const PdfPrinter = require('pdfmake')

//definimos as fontes
const fonts = {
    Roboto: {
        light: 'fonts/Roboto-Light.ttf',
        normal: 'fonts/Roboto-Regular.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bold: 'fonts/Roboto-Bold.ttf',
    }
}
const printer = new PdfPrinter(fonts)

const lines = []
lines.push([
    { text: 'Nome', style: 'header' },
    { text: 'E-mail', style: 'header' },
    { text: 'Situação', style: 'header' }
])
for (let i = 0; i < 300; i++) {
    let ativo = 'Ativo'
    if (i % 2 == 0) {//todos os pares serão inativos com um estilo
        ativo = { text: 'Inativo', style: 'inativo' }
    }
    lines.push(['Leonardo Camargo', 'leonardo_camargo31@hotmail.com', ativo])
}
//definimos o conteudo do documento
const docDefinition = {
    content: [
        { text: 'Fullstack Master' },
        {
            table: {
                widths: ['*', '*', 100],//'*' => quanto tiver, 100 = > 100px fixos
                body: lines
            }
        }
    ],
    styles: {
        header: {
            fontSize: 15,
            bold: true
        },
        inativo: {
            color: 'red',
        }
    }
}

const pdf = printer.createPdfKitDocument(docDefinition)
//fazer a gravação do pdf em disco
const fs = require('fs')
//pipe esta conectando, está injetando um ReadStream(manda dados) neste WriteStream(recebe dados),
//WriteStream manda os dados para um arquivo, no caso doc.pdf
pdf.pipe(fs.createWriteStream('doc.pdf'))
pdf.end()