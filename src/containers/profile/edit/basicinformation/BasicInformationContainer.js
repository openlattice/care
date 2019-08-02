import React from 'react';
import { CardStack } from 'lattice-ui-kit';
import BasicsForm from './BasicsForm';
import PhysicalAppearanceForm from './AppearanceForm';

const BasicInformationContainer = () => (
  <CardStack>
    <BasicsForm />
    <PhysicalAppearanceForm />
  </CardStack>
);

export default BasicInformationContainer;
