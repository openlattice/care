// @flow
import React, {
  useCallback,
  useMemo,
} from 'react';

import { Map } from 'immutable';
import { Form } from 'lattice-fabricate';
import { useDispatch } from 'react-redux';

import { submitRecentInteraction } from './RecentInteractionActions';

import { schema, uiSchema, getDefaultFormData } from './schemas';
import { useFormData } from '../../../components/hooks';

type Props = {
  selectedPerson :Map;
};

const TrackContactReport = ({ selectedPerson } :Props, ref) => {
  const dispatch = useDispatch();

  const defaultFormData = useMemo(() => getDefaultFormData(), []);
  const [formData] = useFormData(defaultFormData);

  const handleSubmit = useCallback((payload) => {
    dispatch(submitRecentInteraction({
      formData: payload.formData,
      selectedPerson,
    }));
  }, [dispatch, selectedPerson]);

  return (
    <Form
        formData={formData}
        hideSubmit
        onSubmit={handleSubmit}
        ref={ref}
        schema={schema}
        uiSchema={uiSchema} />
  );
};

export default React.memo<Props, typeof Form>(
  React.forwardRef(TrackContactReport)
);
