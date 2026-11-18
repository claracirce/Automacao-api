export type json = Record<string, unknown>

export class ApiError extends Error {
    readonly status: number;
    readonly body: any; //any aceita qualquer dado (string, number etc)

    constructor(method: string, path: string, status: number, body: any) {
        super(`${method} ${path} -> ${status}: ${body?.error ?? 'error'}`)
            this.status = status
            this.body = body
    }
}

export class ApiBase {
    readonly baseUrl: string
    token?: string

    constructor(baseUrl: string, token?: string){
        this.baseUrl = baseUrl.replace(/\/$/, "")
        this.token = token
    }
    protected async request<T = any> (method: string, path: string, json?: json): Promise<T> {
        const headers: Record<string, string> = {}
        if(this.token) headers['Autorization'] = `Bearer ${this.token}`
        if(json !== undefined) headers['Content-Type'] = 'application/json'

        const response = await fetch(`${this.baseUrl}${path}`, {
             method, 
            headers, 
            body: json !== undefined ? JSON.stringify(json) : undefined,
        })  
        const text = await response.text()
        const body = text ? JSON.parse(text) : null
        if(!response.ok) throw new ApiError(method, path, response.status, body)
            return body as T 
    }

    get<T = any>(path: string){
        return this.request<T>('GET', path)
    }

    post<T = any>(path: string, json?: json){
        return this.request<T>('POST', path, json)
    }
     put<T = any>(path: string, json?: json){
        return this.request<T>('PUT', path, json)
    }
     delet<T = any>(path: string, json?: json){
        return this.request<T>('DELET', path, json)
    }
}
