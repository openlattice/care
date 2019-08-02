import React from 'react';
import { CardStack } from 'lattice-ui-kit';
import BasicInformationForm from './BasicInformationForm';
import PhysicalAppearanceForm from './AppearanceForm';

const BasicInformationContainer = () => (
  <CardStack>
    <BasicInformationForm />
    <PhysicalAppearanceForm />
  </CardStack>
);

export default BasicInformationContainer;
