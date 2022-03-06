/**
 * The hook to handle the businessesContext
 * Created at 2021/11/14
 * Created by Alex.M
 */

import { useContext } from 'react';
import { BusinessDetailContext } from '../contexts/BusinessDetailContext';

const useBusinessDetail = () => useContext(BusinessDetailContext);

export default useBusinessDetail;
