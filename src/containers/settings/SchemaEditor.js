// @flow
import React, { useRef, useState } from 'react';

import { Map } from 'immutable';
import {
  Button,
  Grid
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import JSONEditor from './JSONEditor';
import SchemaPreview from './SchemaPreview';

import { FORM_SCHEMAS, REQUEST_STATE } from '../../core/redux/constants';
import { getButtonColor } from '../../utils/StyleUtils';
import { SUBMIT_FORM_SCHEMA, submitFormSchema } from '../reports/FormSchemasActions';
import { CRISIS_REPORT, CRISIS_REPORT_TYPE } from '../reports/crisis/schemas/constants';

const { isPending } = ReduxUtils;

const toJson = (code) => JSON.stringify(code, null, 2);
type Props = {
  jsonSchemas :Map;
};

const SchemaEditor = ({ jsonSchemas } :Props) => {
  const dispatch = useDispatch();
  const pageRef = useRef(null);
  const submitSchemaRS = useSelector((store) => store.getIn([FORM_SCHEMAS, SUBMIT_FORM_SCHEMA, REQUEST_STATE]));
  const [schemas, setSchemas] = useState(jsonSchemas.toJS().schemas);
  const [uiSchemas, setUiSchemas] = useState(jsonSchemas.toJS().uiSchemas);
  const [invalidSchema, setInvalidSchema] = useState(false);
  const [invalidUiSchema, setInvalidUiSchema] = useState(false);

  const handleSchemaOnChange = (payload) => {
    setSchemas(payload);
    setInvalidSchema(false);
  };

  const handleUiSchemaOnChange = (payload) => {
    setUiSchemas(payload);
    setInvalidUiSchema(false);
  };

  const handleSaveSchemas = () => {
    dispatch(submitFormSchema({
      type: CRISIS_REPORT_TYPE,
      name: CRISIS_REPORT,
      jsonSchemas: {
        schemas,
        uiSchemas
      }
    }));
  };

  let buttonText;
  switch (submitSchemaRS) {
    case RequestStates.SUCCESS: {
      buttonText = 'Saved';
      break;
    }
    case RequestStates.FAILURE: {
      buttonText = 'Failed';
      break;
    }
    default: {
      buttonText = 'Save Schemas';
      break;
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid
          alignContent="flex-start"
          container
          item
          sm={6}
          spacing={2}
          xs={12}>
        <Grid item xs={12}>
          <JSONEditor
              code={toJson(schemas)}
              label="JSON Schema"
              onChange={handleSchemaOnChange}
              onError={setInvalidSchema} />
        </Grid>
        <Grid item xs={12}>
          <JSONEditor
              code={toJson(uiSchemas)}
              label="UI Schema"
              onChange={handleUiSchemaOnChange}
              onError={setInvalidUiSchema} />
        </Grid>
        <Grid item xs={12}>
          <Button
              color={getButtonColor(submitSchemaRS)}
              disabled={invalidSchema || invalidUiSchema}
              fullWidth
              isLoading={isPending(submitSchemaRS)}
              onClick={handleSaveSchemas}>
            {buttonText}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} ref={pageRef}>
        <SchemaPreview
            pageRef={pageRef}
            schemas={schemas}
            uiSchemas={uiSchemas} />
      </Grid>
    </Grid>
  );
};

export default SchemaEditor;
