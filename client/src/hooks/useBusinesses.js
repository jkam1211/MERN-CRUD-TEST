/**
 * The hook to handle the businessesContext
 * Created at 2021/11/14
 * Created by Alex.M
 */

import { useContext } from 'react';
import { BusinessesContext } from '../contexts/BusinessesContext';

const useBusinesses = () => useContext(BusinessesContext);

export default useBusinesses;
