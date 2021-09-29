// @flow
import { useSelector } from 'react-redux';
import type { Map } from 'immutable';
import type { UUID } from 'lattice';

import { selectAppSettings, selectAppSettingsId } from '../../core/redux/selectors';

const useAppSettings = () => {
  const settings :Map = useSelector(selectAppSettings());
  const id :UUID = useSelector(selectAppSettingsId());

  return [settings, id];
};

export default useAppSettings;
