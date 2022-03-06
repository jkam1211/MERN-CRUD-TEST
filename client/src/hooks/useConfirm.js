/**
 * The hook to handle confirm dialog
 * Created at 2021/11/14
 * Created by Alex.M
 */

import { useContext } from 'react';
import { ConfirmContext } from '../contexts/ConfirmContext';

const useConfrim = () => useContext(ConfirmContext);

export default useConfrim;
