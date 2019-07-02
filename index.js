const PdfPrinter = require('pdfmake')
const express = require('express')
const app = express()

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
        {
            image: 'images/logo.png',
            //width:100,
            //height:100 ou fazer ela encaixar em 100 por 100
            fit: [100, 100]
        },
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
    },
    footer: (page, pages) => {
        return {
            columns: [
                'Esta documento é apenas para teste',
                {
                    alignment: 'right',//quero alinhar a direita
                    text: [
                        { text: page.toString(), italics: true },
                        { text: ' de ', italics: true },
                        { text: pages.toString(), italics: true }
                    ]
                }
            ],
            margin: [40, 0]
        }
    }
}

// const pdf = printer.createPdfKitDocument(docDefinition)
// //fazer a gravação do pdf em disco
// const fs = require('fs')
// //pipe esta conectando, está injetando um ReadStream(manda dados) neste WriteStream(recebe dados),
// //WriteStream manda os dados para um arquivo, no caso doc.pdf
// pdf.pipe(fs.createWriteStream('doc.pdf'))
// pdf.end()


app.get('/get/:name', (req, res) => {
    const pdf = printer.createPdfKitDocument({
        content: 'Olá ' + req.params.name
    })
    //só uma configuração quero mostrar inline, e nome do arquivo com nome da pessoa
    //res.header('Content-disposition', 'inline;filename=' + req.params.name)
    res.header('Content-disposition', 'attachment;filename=' + req.params.name+'.pdf')//attachment para já baixar o arquivo
    res.header('Content-type','application/pdf')//esse arquivo é um pdf
    pdf.pipe(res)//consigo fazer um pipe no res, res não deixa de ser um WriteStream, ele recebe dados
    pdf.end()
})

app.listen(3000, () => {
    console.log('Running...')
})