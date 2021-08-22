var arr = [[1,2],[3,4],[4,5]]  //output -->[1,2,3,4,5]

function removeDuplicate(_arr){
    let res= []
    _arr.forEach(e =>{
        res = [...res,...e]
    })
    console.log(res)
    console.log(res.filter((e,i) => res.indexOf(e) == i ))
}

removeDuplicate(arr)