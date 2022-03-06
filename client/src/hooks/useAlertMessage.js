/**
 * The hook to handle the alert message
 * Created at 2021/11/14
 * Created by Alex.M
 */

import { useContext } from 'react';
import { AlertMessageContext } from '../contexts/AlertMessageContext';

const useAlertMessage = () => useContext(AlertMessageContext);

export default useAlertMessage;
