/**
 * React app
 * Created at 2021/11/14
 * Created by Alex.M
 */

import React, { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.css';
import { BusinessesProvider } from './contexts/BusinessesContext';
import { BusinessDetailProvider } from './contexts/BusinessDetailContext';
import { AlertMessageProvider } from './contexts/AlertMessageContext';
import { ConfirmProvider } from './contexts/ConfirmContext';
import Router from './router';

function App() {
  return (
    <BusinessesProvider>
      <BusinessDetailProvider>
        <AlertMessageProvider>
          <ConfirmProvider>
            <BrowserRouter>
              <Fragment>
                <Router />
              </Fragment>
            </BrowserRouter>
          </ConfirmProvider>
        </AlertMessageProvider>
      </BusinessDetailProvider>
    </BusinessesProvider>
  );
}

export default App;
