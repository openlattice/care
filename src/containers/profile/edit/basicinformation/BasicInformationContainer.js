// @flow
import React, { useEffect } from 'react';

import { CardStack } from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import AddressForm from './AddressForm';
import AppearanceForm from './AppearanceForm';
import BasicsForm from './BasicsForm';
import ContactForm from './ContactForm';
import PhotosForm from './PhotosForm';
import ScarsMarksTattoosForm from './ScarsMarksTattoosForm';
import { getBasicInformation } from './actions/BasicInformationActions';

import { PROFILE_ID_PARAM } from '../../../../core/router/Routes';

const BasicInformationContainer = () => {
  const match = useRouteMatch();
  const personEKID = match.params[PROFILE_ID_PARAM];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBasicInformation(personEKID));
  }, [dispatch, personEKID]);

  return (
    <CardStack>
      <BasicsForm />
      <AppearanceForm personEKID={personEKID} />
      <ScarsMarksTattoosForm personEKID={personEKID} />
      <PhotosForm personEKID={personEKID} />
      <ContactForm personEKID={personEKID} />
      <AddressForm personEKID={personEKID} />
    </CardStack>
  );
};

export default BasicInformationContainer;
