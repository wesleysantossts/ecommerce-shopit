import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // permite escrever funções com lógica interna que podem interagir com os métodos dispatch e getState de uma loja Redux
import { composeWithDevTools } from 'redux-devtools-extension'; // usado para facilitar o uso da extensão Redux Devtools do Chrome

import { productsReducer, productDetails } from './modules/produtos/reducer';

const reducer = combineReducers({
  products: productsReducer,
  productDetails
} ); // usado para juntar todos os reducers

let initialState = [];

const middleware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;

