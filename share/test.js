const obj = {
  a: 'aaa',
  b:undefined,
  c:Symbol('c'),
  d:()=>{console.log('1')}
}


// const arr = ['aaa' , undefined , Symbol('c') , ()=>{console.log('d')}]

// console.log(JSON.stringify(obj))
// console.log(JSON.stringify(arr))

const test = {
  a: 'a',
  b:'b',
  c:'c',
  d:'d'
}


console.log(JSON.stringify(test , ['a' , 'b']))