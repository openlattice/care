// @flow
import React from 'react';

import styled from 'styled-components';
import { Form, Paged } from 'lattice-fabricate';
import { Button } from 'lattice-ui-kit';

import { generateReviewSchema } from '../../utils/SchemaUtils';

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px 30px 30px;
`;

type Props = {
  pageRef :{ current :HTMLDivElement | null };
  schemas :Object[];
  uiSchemas :Object[];
}
const SchemaPreview = ({
  schemas,
  uiSchemas,
  pageRef,
} :Props) => {

  const reviewSchemas = generateReviewSchema(schemas, uiSchemas, true);

  return (
    <Paged
        render={({
          formRef,
          pagedData,
          page,
          onBack,
          onNext,
          validateAndSubmit,
        }) => {
          const totalPages = schemas.length + 1;
          const isReviewPage = page === totalPages - 1;

          const validate = isReviewPage
            ? () => console.log(pagedData)
            : validateAndSubmit;

          const scrollToContentTop = () => {
            if (pageRef.current) {
              pageRef.current.scrollIntoView({
                behavior: 'smooth'
              });
            }
          };

          const handleNext = () => {
            scrollToContentTop();
            onNext();
          };

          const handleBack = () => {
            scrollToContentTop();
            onBack();
          };

          return (
            <>
              <Form
                  disabled={isReviewPage}
                  formData={pagedData}
                  hideSubmit
                  onSubmit={handleNext}
                  ref={formRef}
                  schema={isReviewPage ? reviewSchemas.schema : schemas[page]}
                  uiSchema={isReviewPage ? reviewSchemas.uiSchema : uiSchemas[page]} />
              <ActionRow>
                <Button
                    disabled={!(page > 0)}
                    onClick={handleBack}>
                  Back
                </Button>
                <span>{`${page + 1} of ${totalPages}`}</span>
                <Button
                    color="primary"
                    onClick={validate}>
                  { isReviewPage ? 'Submit' : 'Next' }
                </Button>
              </ActionRow>
            </>
          );
        }} />
  );
};

SchemaPreview.defaultProps = {
  schemas: [{}],
  uiSchemas: [{}],
};

export default SchemaPreview;
