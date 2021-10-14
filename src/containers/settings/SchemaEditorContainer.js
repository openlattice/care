// @flow
import React, { useEffect } from 'react';

import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fromJS } from 'immutable';
import {
  Breadcrumbs,
  CardStack,
  IconSplash,
  Spinner,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';

import SchemaEditor from './SchemaEditor';

import { BreadcrumbItem, BreadcrumbLink, BreadcrumbsWrapper } from '../../components/breadcrumbs';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { resetRequestStates } from '../../core/redux/actions';
import { FORM_SCHEMAS, REQUEST_STATE } from '../../core/redux/constants';
import { selectFormSchemas } from '../../core/redux/selectors';
import { SETTINGS_PATH } from '../../core/router/Routes';
import { GET_FORM_SCHEMA, getFormSchema } from '../reports/FormSchemasActions';
import { CRISIS_REPORT_TYPE } from '../reports/crisis/schemas/constants';

const { isFailure, isPending, isSuccess } = ReduxUtils;

const EMPTY_SCHEMAS = fromJS({
  schemas: [{}],
  uiSchemas: [{}]
});

const FailureIcon = (size) => <FontAwesomeIcon icon={faExclamationTriangle} size={size} />;

const SchemaEditorContainer = () => {
  const dispatch = useDispatch();
  const jsonSchemas = useSelector(selectFormSchemas(CRISIS_REPORT_TYPE)) || EMPTY_SCHEMAS;
  const schemaRS = useSelector((store) => store.getIn([FORM_SCHEMAS, GET_FORM_SCHEMA, REQUEST_STATE]));

  useEffect(() => {
    dispatch(getFormSchema(CRISIS_REPORT_TYPE));

    return () => dispatch(resetRequestStates([GET_FORM_SCHEMA]));
  }, [dispatch]);

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
          {
            isPending(schemaRS) && <Spinner size="3x" />
          }
          {
            isFailure(schemaRS) && (
              <IconSplash
                  icon={FailureIcon}
                  caption="An unexpected error occurred. Please try again or contact support." />
            )
          }
          {
            isSuccess(schemaRS) && <SchemaEditor jsonSchemas={jsonSchemas} />
          }
        </CardStack>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default SchemaEditorContainer;
