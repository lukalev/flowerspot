

import { store } from '.';

interface IUtils {
    getData<TResponse>(endpoint: string): Promise<TResponse>;
    postData<TResponse>(endpoint: string, body: string): Promise<TResponse>;
}

// helper functions

class Utils implements IUtils {
        
    public async getData<TResponse>(endpoint: string) {
        return Promise.reject(null);      
        try {
            let response = await fetch(process.env.REACT_APP_API_URL + endpoint, this.getOptions);
            let json: TResponse = await response.json();
            console.log(json);
            return json;
        }
        catch (error) {
            throw error;
        }
        
    }

    public async postData<TResponse>(endpoint: string, body: string) {
        return Promise.reject(null);
        try {
            let response = await fetch(process.env.REACT_APP_API_URL + endpoint, this.postOptions(body));
            let json: TResponse = await response.json();
            console.log(json);
            return json;
        }
        catch (error) {
            throw error;
        }
    }

    private get getOptions(): any {
        const globalState = store.getState();
        const authToken = globalState.flowrs.authToken;
        console.log(authToken);
        let headers = new Headers();
        headers.set('Accept', 'application/json; odata=verbose');
        if (authToken) {
            headers.set('Authorization', 'Bearer ' + authToken );
        }
        return {
            method: 'GET',
            headers: headers
        }
    }

    private postOptions(body: string): any {
        const globalState = store.getState();
        const authToken = globalState.flowrs.authToken;
        console.log(authToken);
        let headers = new Headers();
        headers.set('Accept', 'application/json; odata=verbose');
        headers.set('Content-Type', 'application/json');
        if (authToken) {
            headers.set('Authorization', 'Bearer ' + authToken );
        }
        return {
            method: 'POST',
            headers: headers,
            body: body  
        }
    }
    //blank image if missing (can be replaced by some no-photo flower)
    public addDefaultSrc(e:any){
        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
    }
    
}
export default new Utils();