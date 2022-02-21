import store from "@/store";
import router from "@/router";

function errorHandler(err) {  
    if (err.response) {
        if (err.response.status === 401) {
            store.commit("logout", {});
            store.commit("setMessage", { type: "error", message: "Unauthorized access" });
            return router.push({ name: "Login" });
        }
        if (err.response.status === 404) {
            return store.commit("setMessage", { type: "error", message: err });
        }
        if (err.response.status === 502) {
            return store.commit("setMessage", { type: "error", message: "502 Bad Gateway" });
        }
        if(err.response.data){
            return store.commit("setMessage", { type: "error", message: err.response.data.message });
        }
        
        return store.commit("setMessage", { type: "error", message: err.response });
    }
    store.commit("setMessage", { type: "error", message: err });    
}

export default errorHandler
