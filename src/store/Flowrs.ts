import Utils from "../Utils";

const setAuthorizationToken = 'SET_TOKEN';
const clearAuthorizationToken = 'CLEAR_TOKEN';
const loadingFlowers = 'LOADING_FLOWERS';
const setFlowers = 'SET_FLOWERS';
const setUser = 'SET_USER';
const setQuery = 'SET_QUERY';

const loadingStopWithTimeout = (dispatch:any) => {
    setTimeout(()=>dispatch(actionCreators.loadingFlowers(false)),1000);
}

// async actions

const listFlowers = (page:number, forceFetch:boolean) => (dispatch:any, getState:any) => {
    dispatch(actionCreators.loadingFlowers(true));
    const state = getState().flowrs;
    // fetch if last fetched > 1 minute
    let goFetch = true;
    if (!forceFetch && state.flowers && state.flowers.length>0 && state.cachedTimestamp) {
        const cachedMS:number = process.env.REACT_APP_CACHE_MS ? parseInt(process.env.REACT_APP_CACHE_MS) : 0;
        if (new Date().getTime() - state.cachedTimestamp < cachedMS) {
            goFetch = false;
            //dispatch(actionCreators.loadingFlowers(false));
            loadingStopWithTimeout(dispatch);
        }
    }
    if (goFetch) {
        console.log('go fetch!');        
        const url = '/flowers/random?page=' + page;
        Utils.getData<any>(url).then((data:any) => {
            if (data.flowers) {
                dispatch(actionCreators.setFlowers(data.flowers));
                //dispatch(actionCreators.loadingFlowers(false));
                loadingStopWithTimeout(dispatch);
            }
        });
    }
}
const searchFlowers = (query:string) => (dispatch:any) => {
    dispatch(actionCreators.loadingFlowers(true));
    const url = '/flowers/search?query=' + query;
    Utils.getData<any>(url).then((data:any) => {
        if (data.flowers) {
            dispatch(actionCreators.setFlowers(data.flowers));
            //dispatch(actionCreators.loadingFlowers(false));
            loadingStopWithTimeout(dispatch);
        }
    });
}

// action creators

export const actionCreatorsAsync = { 
    listFlowers,
    searchFlowers
};

export const actionCreators = {
  
    setAuthorizationToken: (token:string) => ({ type:setAuthorizationToken, token }),
    clearAuthorizationToken: () => ({ type:clearAuthorizationToken }),

    loadingFlowers: (loading:boolean) => ({ type:loadingFlowers, loading }),
    setFlowers: (flowers:any[]) => ({ type:setFlowers, flowers }),
    setQuery: (query:string) => ({ type:setQuery, query }),

    setUser: (user?:IUser) => ({ type:setUser, user }),

    ...actionCreatorsAsync
};


// reducers

export const reducer = (state:IGlobalState, action:any) => {

    state = state || initialState;

    if (action.type === setAuthorizationToken) {
        return { ...state, authToken: action.token };
    }
    if (action.type === clearAuthorizationToken) {
        return { ...state, authToken: null };
    }
    if (action.type === loadingFlowers) {
        return { ...state, loading: action.loading };
    }
    if (action.type === setFlowers) {
        return { ...state, flowers: action.flowers, cachedTimestamp: new Date().getTime() };
    }
    if (action.type === setUser) {
        return { ...state, user: action.user };
    }
    if (action.type === setQuery) {
        return { ...state, query: action.query };
    }
    return state;

};

// global state interfaces

export interface IUser {
    firstName: string,
    lastName: string,
}
export interface IGlobalState {
    authToken: string | null,
    flowers: any[],
    loading: boolean,
    user: IUser | null,
    cachedTimestamp: number | null,
    query: string,
}

// initial state

export const initialState:IGlobalState = { 
    authToken: null,
    flowers: [],
    loading: false,
    user: null,
    cachedTimestamp: null,
    query: ''
};
