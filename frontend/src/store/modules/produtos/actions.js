import axios from 'axios';
import { ALL_PRODUCTS_REQUEST, ALL_PRODUCTS_SUCCESS, ALL_PRODUCTS_FAIL, CLEAR_ERRORS } from '../action.types';

// dispatch - usado para disparar a action
export async function getProducts (dispatch) {
  dispatch({ type: ALL_PRODUCTS_REQUEST })
  // tem que mudar o proxy no package.json para apontar para o localhost OU servidor para funcionar (ver "package.json"). Sempre que alterar o package.json tem que reiniciar a aplicação (app) 
  const { data } = await axios.get('/v1/produtos') 
    .catch(error => {
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        payload: error.response.data.message
      })
    });

  dispatch({
    type: ALL_PRODUCTS_SUCCESS,
    payload: data
  }); // quando chamado, vai mandar o payload para o reducer
};

// Limpar erros
export async function clearErrors (dispatch) {
  dispatch({
    type: CLEAR_ERRORS
  });
};