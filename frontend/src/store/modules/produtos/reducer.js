import { 
  ALL_PRODUCTS_REQUEST, ALL_PRODUCTS_SUCCESS, ALL_PRODUCTS_FAIL, CLEAR_ERRORS,
  PRODUCTS_DETAILS_REQUEST, PRODUCTS_DETAILS_SUCCESS, PRODUCTS_DETAILS_FAIL 
} from '../action.types';

export const productsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case ALL_PRODUCTS_REQUEST: 
      return {
        loading: true,
        products: []
      }
    
    case ALL_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload.produtos,
        productsCount: action.payload.quantidade
      }

    case ALL_PRODUCTS_FAIL:
      return {
        loading: false,
        error: action.payload,
        products: []
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      }

    default:
      return state;
  }
}

export const productDetails = (state = { productDetails: [] }, action) => {
  switch (action.type) {
    case PRODUCTS_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case PRODUCTS_DETAILS_SUCCESS:
      return {
        loading: false,
        product: action.payload
      }
    case PRODUCTS_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
        product: []
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      }
    default:
      return state;
  }
}