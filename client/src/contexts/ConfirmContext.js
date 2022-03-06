/**
 * The context of a confirm dialog
 */

import React, { createContext, useEffect, useReducer } from 'react';
// ----------------------------------------------------------------------
const initialState = {
  isOpened: false,
  _id: '',
  message: ''
};

const handlers = {
  INITIALIZE: (state, action) => {
    return {
      ...state,
      isOpened: false,
      _id: '',
      message: ''
    };
  },
  SET_IS_OPENED: (state, action) => {
    const { isOpened, _id, message } = action.payload;
    return {
      ...state,
      isOpened,
      _id,
      message
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

//  Context
const ConfirmContext = createContext({
  ...initialState,
  openConfirmDialog: () => Promise.resolve(),
  closeConfirmDialog: () => Promise.resolve()
});

//  Provider
function ConfirmProvider({ children }) {
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

  const openConfirmDialog = (_id, message) => {
    dispatch({
      type: 'SET_IS_OPENED',
      payload: {
        isOpened: true,
        _id,
        message
      }
    });
  };

  const closeConfirmDialog = () => {
    dispatch({
      type: 'INITIALIZE',
      payload: null
    });
  };

  return (
    <ConfirmContext.Provider
      value={{
        ...state,
        openConfirmDialog,
        closeConfirmDialog
      }}
    >
      {children}
    </ConfirmContext.Provider>
  );
}

export { ConfirmContext, ConfirmProvider };
