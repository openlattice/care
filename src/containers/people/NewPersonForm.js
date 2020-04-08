// @flow
import React from 'react';

import { Form } from 'lattice-fabricate';
import { useDispatch, useSelector } from 'react-redux';

import { getDefaultFormData } from './NewPersonUtils';
import { submitNewPerson } from './PeopleActions';
import { schema, uiSchema } from './schemas';

const NewPersonForm = (props :any, ref) => {
  const searchInputs = useSelector((store) => store.getIn(['people', 'searchInputs']));
  const dispatch = useDispatch();

  const defaultFormData = getDefaultFormData(searchInputs);

  const handleSubmit = (payload) => {
    dispatch(submitNewPerson({
      formData: payload.formData,
    }));
  };

  return (
    <Form
        formData={defaultFormData}
        hideSubmit
        onSubmit={handleSubmit}
        ref={ref}
        schema={schema}
        uiSchema={uiSchema} />
  );
};

export default React.memo<any, typeof Form>(
  React.forwardRef(NewPersonForm)
);
