// @flow
import { useSelector } from 'react-redux';
import type { Map } from 'immutable';
import type { UUID } from 'lattice';

import { SETTINGS } from '../../core/redux/constants';

const useAppSettings = () => {
  const settings :Map = useSelector((state) => state
    .getIn([SETTINGS, SETTINGS]));

  const id :UUID = useSelector((state) => state.getIn([SETTINGS, 'id']));

  return [settings, id];
};

export default useAppSettings;
