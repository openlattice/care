// @flow
import React, { useEffect, useRef, useState } from 'react';

import {
  Breadcrumbs,
  Button,
  CardStack,
  Grid
} from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

import JSONEditor from './JSONEditor';
import SchemaPreview from './SchemaPreview';

import { BreadcrumbItem, BreadcrumbLink, BreadcrumbsWrapper } from '../../components/breadcrumbs';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { SETTINGS_PATH } from '../../core/router/Routes';
import { getFormSchema } from '../reports/FormSchemasActions';
import { clearCrisisReport } from '../reports/crisis/CrisisActions';
import { v2 } from '../reports/crisis/schemas';
import { CRISIS_REPORT_TYPE } from '../reports/crisis/schemas/constants';

const toJson = (code) => JSON.stringify(code, null, 2);

const SchemaEditorContainer = () => {
  const dispatch = useDispatch();
  const pageRef = useRef(null);
  const [schemas, setSchemas] = useState(v2.officer.schemas);
  const [uiSchemas, setUiSchemas] = useState(v2.officer.uiSchemas);
  const [invalidSchema, setInvalidSchema] = useState(false);
  const [invalidUiSchema, setInvalidUiSchema] = useState(false);

  useEffect(() => {
    dispatch(getFormSchema(CRISIS_REPORT_TYPE));

    return () => dispatch(clearCrisisReport());
  }, [dispatch]);

  const handleSchemaOnChange = (payload) => {
    setSchemas(payload);
    setInvalidSchema(false);
  };

  const handleUiSchemaOnChange = (payload) => {
    setUiSchemas(payload);
    setInvalidUiSchema(false);
  };

  const handleSaveSchemas = () => {
    console.log({ schemas, uiSchemas });
  };

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <CardStack>
          <BreadcrumbsWrapper>
            <Breadcrumbs>
              <BreadcrumbLink to={SETTINGS_PATH}>Application Settings</BreadcrumbLink>
              <BreadcrumbItem>Crisis Schema Editor</BreadcrumbItem>
            </Breadcrumbs>
          </BreadcrumbsWrapper>
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
                    color="primary"
                    disabled={invalidSchema || invalidUiSchema}
                    fullWidth
                    onClick={handleSaveSchemas}>
                  Save Schemas
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
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default SchemaEditorContainer;
