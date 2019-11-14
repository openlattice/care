// @flow
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Map, List } from 'immutable';
import { Modal, StyleUtils } from 'lattice-ui-kit';
import { Form } from 'lattice-fabricate';

import { schema, uiSchema } from './schemas/RequestChangeSchemas';
import { getResponsibleUserOptions } from '../../containers/staff/StaffActions';
import { hydrateSchemaWithStaff } from '../../containers/profile/edit/about/AboutUtils';
import { constructFormData } from './utils/RequestChangesUtils';

const { media } = StyleUtils;

const StyledForm = styled(Form)`
  width: 500px;
  ${media.phone`
    width: 300px;
  `}
`;

type Props = {
  isVisible :boolean;
  onClose :() => void;
  defaultComponent :any;
  defaultStaff :any;
};

const RequestChangeModal = (props :Props) => {
  const {
    defaultComponent,
    defaultStaff,
    isVisible,
    onClose
  } = props;
  const formRef = useRef<typeof StyledForm>(null);
  const [changeSchema, setSchema] = useState(schema);
  const [formData, setFormData] = useState();
  const dispatch = useDispatch();

  const responsibleUsers :List<Map> = useSelector((store :Map) => store
    .getIn(['staff', 'responsibleUsers', 'data']));

  const currentUser :Map = useSelector((store :Map) => store
    .getIn(['staff', 'currentUser', 'data']));

  useEffect(() => {
    if (isVisible) {
      dispatch(getResponsibleUserOptions());
    }
  }, [dispatch, isVisible]);

  useEffect(() => {
    const newSchema = hydrateSchemaWithStaff(schema, responsibleUsers);
    setSchema(newSchema);
  }, [responsibleUsers]);

  useEffect(() => {
    const newFormData = constructFormData(
      defaultStaff,
      defaultComponent,
    );

    console.log(currentUser, newFormData);
  }, [currentUser, defaultStaff, defaultComponent]);

  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        viewportScrolling
        textPrimary="Submit"
        textSecondary="Discard"
        textTitle="Request Changes">
      <StyledForm
          hideSubmit
          noPadding
          ref={formRef}
          formData={formData}
          schema={changeSchema}
          uiSchema={uiSchema} />
    </Modal>
  );
};

export default React.memo<Props>(RequestChangeModal);
