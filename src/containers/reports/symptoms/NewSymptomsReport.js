// @flow
import React, { useCallback } from 'react';
import { Map } from 'immutable';
import { Form } from 'lattice-fabricate';
import { useDispatch } from 'react-redux';

import { submitSymptomsReport } from './SymptomsReportActions';
import { schema, uiSchema } from './schemas';

type Props = {
  position :Position;
  selectedPerson :Map;
};

const NewCrisisReport = ({ position, selectedPerson } :Props, ref) => {
  const dispatch = useDispatch();

  const handleSubmit = useCallback((payload) => {
    dispatch(submitSymptomsReport({
      formData: payload.formData,
      selectedPerson,
      position
    }));
  }, [dispatch, position, selectedPerson]);

  return (
    <Form
        hideSubmit
        onSubmit={handleSubmit}
        ref={ref}
        schema={schema}
        uiSchema={uiSchema} />
  );
};

export default React.memo(
  React.forwardRef(NewCrisisReport)
);
