/* let node = function(){
    this.next = null
    this.weight = null
    this.name = null
    this.push = function(node){
         if(this.next){
             let change = this.next
             this.next = node 
             node.next = change
         }else{
             this.next = node
         }
    }
    this.init = function(name , weight){
        this.name = name 
        this.weight = weight
    }
} */

class node{
    constructor(name , weight){
        this.name = name 
        this.weight = weight
        this.next = null
    }
    push(node){
        if(this.next){
            let next = this.next
            while(next.next){
                next = next.next
            }
            next.next = node
        }else{
            this.next = node
        }
    }
}

module.exports = node

let test = new node('yy' , 800)