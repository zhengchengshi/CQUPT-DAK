const arr = [1,2,3,4,5];
const res = arr.map(item=>{
    return item*5
})
console.log (res);
const obj = {
    name:"sunwuk",
    age:18
}
const dest = {
    dest:'dest'
}
Object.assign(obj,dest);
console.log (obj);