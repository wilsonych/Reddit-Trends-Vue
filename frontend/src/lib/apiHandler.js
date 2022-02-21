import axios from "axios";
import store from "@/store"
import errorHandler from "./errorHandler"
import verifier from "@/lib/verifier"

function spaceFill(string,quantity=10){
    string=String(string)
    return (quantity - string.length)>0?string+' '.repeat(quantity - string.length) : string
}

// [ { "from": "start", "to": "entry", "time": 707, "method": "GET", "api": "/count/post_trend" }]
function timeUsageFormatter(timeObj){
    const longest = Math.max(...timeObj.timeUsage.map(x=>x.target.length))
    let s = `${timeObj.method} ${timeObj.api}\n`
    s+=timeObj.timeUsage.map(x=>`${spaceFill(x.target,longest)} : ${spaceFill(x.time/1000,5)}s`).join("\n")
    return s
}

async function apiHandler(option,callback){
    try{
        verifier.atLeast(["url"],option)  
        const url = `${store.state.endpoint}${option.url}`
        
        if(!option.method)option.method="get"
        
        if(store.state.timeMeasure) option.headers={timeusage:Date.now()}
        
        const response = await axios({...option,url:url})
        
        if(response.data){
            if(store.state.timeMeasure){
                const timeLog = timeUsageFormatter(response.data.timeusage)
                store.commit("setMessage", { type: "", message: timeLog })
                callback(response.data.data)
            }else{
                callback(response.data)
            }
        }

    }catch(err){
        errorHandler(err)        
    }       
}

export default apiHandler