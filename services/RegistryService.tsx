import axios from "axios";

export const axiosInstance = axios.create({ baseURL: "http://localhost:8080" })

export class RegistryService {
    findall(){
        return axiosInstance.get("/registries")
    }

    findOne(id : number){
        return axiosInstance.get("/registries/" + id)
    }

    create(registry : Projeto.Registry){
        return axiosInstance.post("/registries", registry)
    }

    delete(id : number){
        return axiosInstance.delete("registries/" + id)
    }
}