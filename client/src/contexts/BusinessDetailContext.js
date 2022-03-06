/**
 * The context of a business detail dialog
 */

import React, { createContext, useEffect, useReducer } from 'react';
// ----------------------------------------------------------------------

const initialState = {
  isOpened: false,
  business: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    return {
      ...state,
      isOpened: false,
      business: null
    };
  },
  SET_IS_OPENED: (state, action) => {
    return {
      ...state,
      isOpened: action.payload
    };
  },
  SET_BUSINESS: (state, action) => {
    return {
      ...state,
      business: action.payload
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

//  Context
const BusinessDetailContext = createContext({
  ...initialState,
  openDialog: () => Promise.resolve(),
  closeDialog: () => Promise.resolve()
});

//  Provider
function BusinessDetailProvider({ children }) {
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

  const openDialog = (business) => {
    dispatch({
      type: 'SET_IS_OPENED',
      payload: true
    });
    dispatch({
      type: 'SET_BUSINESS',
      payload: business
    });
  };

  const closeDialog = () => {
    dispatch({
      type: 'INITIALIZE',
      payload: null
    });
  };

  return (
    <BusinessDetailContext.Provider
      value={{
        ...state,
        openDialog,
        closeDialog
      }}
    >
      {children}
    </BusinessDetailContext.Provider>
  );
}

export { BusinessDetailContext, BusinessDetailProvider };
