/**
 * The context of businesses
 */

import React, { createContext, useEffect, useReducer } from 'react';
import api from '../utils/api';
import {
  ERROR,
  OCCURED_ERROR,
  SUCCESS,
  SUCCESS_CREATED,
  SUCCESS_DELETED,
  SUCCESS_UPDATED
} from '../utils/constants';

const initialState = {
  businesses: [],
  expectedBusinessesAmount: 0
};

const handlers = {
  INITIALIZE: (state, action) => {
    return {
      ...state,
      businesses: []
    };
  },
  SET_BUSINESSES: (state, action) => {
    return {
      ...state,
      businesses: action.payload
    };
  },
  APPEND_BUSINESSES: (state, action) => {
    state.businesses.push(...action.payload);
    return {
      ...state
    };
  },
  SET_EXPECTED_BUSINESSES_AMOUNT: (state, action) => {
    return {
      ...state,
      expectedBusinessesAmount: action.payload
    };
  },
  INCREASE_SET_EXPECTED_BUSINESSES_AMOUNT: (state, action) => {
    let newExpectedBusinessesAmount = state.expectedBusinessesAmount + 1;
    return {
      ...state,
      expectedBusinessesAmount: newExpectedBusinessesAmount
    };
  },
  DECREASE_SET_EXPECTED_BUSINESSES_AMOUNT: (state, action) => {
    let newExpectedBusinessesAmount = state.expectedBusinessesAmount - 1;
    return {
      ...state,
      expectedBusinessesAmount: newExpectedBusinessesAmount
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

//  Context
const BusinessesContext = createContext({
  ...initialState,
  createBusiness: () => Promise.resolve(),
  updateBusinessById: () => Promise.resolve(),
  getAllBusinesses: () => Promise.resolve(),
  searchBusinesses: () => Promise.resolve(),
  deleteBusinessById: () => Promise.resolve(),
  clearBusinesses: () => Promise.resolve()
});

//  Provider
function BusinessesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      dispatch({
        type: 'INITIALIZE',
        payload: null
      });
    };
    initialize();
  }, []);

  /**
   * Create a new business
   * @param {object} businessData
   * @param {object} pageData
   * @returns
   */
  const createBusiness = async (businessData) => {
    try {
      const response = await api.post('/business/create', businessData);
      const { data } = response;
      dispatch({
        type: 'INCREASE_SET_EXPECTED_BUSINESSES_AMOUNT',
        payload: null
      });
      dispatch({
        type: 'SET_BUSINESSES',
        payload: data
      });
      return { severity: SUCCESS, message: SUCCESS_CREATED };
    } catch (error) {
      return {
        severity: ERROR,
        message: error.response.data ? error.response.data : ERROR
      };
    }
  };

  /**
   * Update a business by object id
   * @param {string} _id
   * @param {object} businessData
   * @param {object} pageData
   * @returns
   */
  const updateBusinessById = async (_id, businessData) => {
    try {
      const response = await api.put(
        `/business/updateById/${_id}`,
        businessData
      );
      const { data } = response;
      dispatch({
        type: 'SET_BUSINESSES',
        payload: data
      });
      return { severity: SUCCESS, message: SUCCESS_UPDATED };
    } catch (error) {
      return {
        severity: ERROR,
        message: error.response.data ? error.response.data : ERROR
      };
    }
  };

  /**
   * Get all business by page size and page number
   * @param {object} pageData
   * @returns
   */
  const getAllBusinesses = async (pageData) => {
    try {
      const response = await api.post('/business/getAll', pageData);
      const { data } = response;
      if (data.expectedBusinessesAmount) {
        dispatch({
          type: 'SET_EXPECTED_BUSINESSES_AMOUNT',
          payload: data.expectedBusinessesAmount
        });
        dispatch({
          type: 'SET_BUSINESSES',
          payload: data.businesses
        });
      } else {
        dispatch({
          type: 'APPEND_BUSINESSES',
          payload: data.businesses
        });
      }
    } catch (error) {
      return {
        severity: ERROR,
        message: error.response.data ? error.response.data : ERROR
      };
    }
  };

  /**
   * Search businesses by page name regarding the page size and page number
   * @param {string} searchKey
   * @param {object} pageData
   * @returns
   */
  const searchBusinesses = async (searchKey, pageData) => {
    const response = await api.post('/business/search', {
      searchKey,
      pageData
    });
    const { status, data } = response;
    if (status === 200) {
      dispatch({
        type: 'APPEND_BUSINESSES',
        payload: data
      });
    } else {
      return { severity: ERROR, message: OCCURED_ERROR };
    }
  };

  /**
   * Delete a business by its object id
   * @param {string} _id
   * @param {object} pageData
   * @returns
   */
  const deleteBusinessById = async (_id) => {
    try {
      const response = await api.delete(`/business/deleteById/${_id}`);
      const { data } = response;
      dispatch({
        type: 'SET_BUSINESSES',
        payload: data
      });
      return { severity: SUCCESS, message: SUCCESS_DELETED };
    } catch (error) {
      return {
        severity: ERROR,
        message: error.response.data ? error.response.data : ERROR
      };
    }
  };

  /**
   * Clear businesses
   */
  const clearBusinesses = () => {
    dispatch({
      type: 'SET_BUSINESSES',
      payload: []
    });
  };

  return (
    <BusinessesContext.Provider
      value={{
        ...state,
        createBusiness,
        updateBusinessById,
        getAllBusinesses,
        searchBusinesses,
        deleteBusinessById,
        clearBusinesses
      }}
    >
      {children}
    </BusinessesContext.Provider>
  );
}

export { BusinessesContext, BusinessesProvider };
