// @flow
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Map, List, removeIn } from 'immutable';
import { Constants } from 'lattice';
import { Form, DataProcessingUtils } from 'lattice-fabricate';

import { useFormData } from '../../../components/hooks';
import { schema, uiSchema } from './RequestChangeSchemas';
import { getResponsibleUserOptions } from '../../staff/StaffActions';
import { hydrateSchemaWithStaff } from '../../profile/edit/about/AboutUtils';
import { constructFormData, getRequestChangesAssociations } from './RequestChangesUtils';
import { submitRequestChanges } from './RequestChangesActions';
import { APP_TYPES_FQNS } from '../../../shared/Consts';

const { STAFF_FQN } = APP_TYPES_FQNS;
const { OPENLATTICE_ID_FQN } = Constants;
const {
  getEntityAddressKey,
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData
} = DataProcessingUtils;

const StyledForm = styled(Form)`
  max-width: 100%;
  width: 500px;
`;

type Props = {
  assignee :Map;
  currentUser :Map;
  defaultComponent :string;
  person :Map;
};

const RequestChangesForm = (props :Props, ref) => {
  const {
    assignee,
    currentUser,
    defaultComponent,
    person,
  } = props;

  const responsibleUsers :List<Map> = useSelector((store :Map) => store.getIn(['staff', 'responsibleUsers', 'data']));
  const entitySetIds :Map = useSelector((store :Map) => store.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
  const propertyTypeIds :Map = useSelector((store :Map) => store.getIn(['edm', 'fqnToIdMap'], Map()));

  const [changeSchema, setSchema] = useState(schema);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getResponsibleUserOptions());
  }, [dispatch]);

  useEffect(() => {
    const newSchema = hydrateSchemaWithStaff(schema, responsibleUsers);
    setSchema(newSchema);
  }, [responsibleUsers]);

  const defaultFormData = useMemo(() => constructFormData(
    assignee,
    defaultComponent,
  ), [assignee, defaultComponent]);

  const [formData] = useFormData(defaultFormData);

  const handleSubmit = useCallback((payload :any) => {
    const { formData: newFormData } = payload;

    const associationEntityData = processAssociationEntityData(
      getRequestChangesAssociations(newFormData, person, currentUser),
      entitySetIds,
      propertyTypeIds
    );

    const withoutAssignee = removeIn(
      newFormData,
      [getPageSectionKey(1, 1), getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN)]
    );

    const entityData = processEntityData(withoutAssignee, entitySetIds, propertyTypeIds);

    dispatch(submitRequestChanges({
      associationEntityData,
      entityData,
    }));
  }, [
    currentUser,
    dispatch,
    entitySetIds,
    person,
    propertyTypeIds
  ]);

  return (
    <StyledForm
        hideSubmit
        noPadding
        ref={ref}
        onSubmit={handleSubmit}
        formData={formData}
        schema={changeSchema}
        uiSchema={uiSchema} />
  );
};

export default React.forwardRef<Props, typeof StyledForm>(RequestChangesForm);
