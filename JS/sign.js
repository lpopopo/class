const fs = require('fs')
const readLine = require('readline')

const timeA = new Date().getTime()

function readFileAsLine(fileName){
    let file = fs.createReadStream(fileName)
    let objReadLine = readLine.createInterface({
        input:file
    })

    objReadLine.on('line' , function(chunk){
        console.log('data is : ' + chunk)
    })
    objReadLine.on('close' , function(){
        console.log('file read close')
        const timeB = new Date().getTime()
        console.log(timeB - timeA)
    })
    
}

function readFileAll(filename){
    let options = {encoding:'utf-8' , flag : 'r'}
    let file = fs.createReadStream(filename , options)
    let allFile = ''
    file.on('data' , function(chunk){
        allFile += chunk
    })
    file.on('close' , function(){
        console.log('file read over')
        let arr = allFile.split(/\s/)
        let n = 0
        for(let i = 0 ; i < arr.length ; i++){
            if(arr[i]){
               n++
            }
        }
        console.log(n)
        const timeB = new Date().getTime()
        console.log(timeB - timeA)
    })
}

/* readFileAsLine('./a.txt') */

readFileAll('./a.txt')
