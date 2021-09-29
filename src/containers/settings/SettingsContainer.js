// @flow

import React, { useState } from 'react';

import {
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Switch,
} from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

import { updateAppSettings } from './actions';

import { useAppSettings } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper, Header } from '../../components/layout';

const SettingsContainer = () => {
  const dispatch = useDispatch();
  const [settings, settingsEKID] = useAppSettings();
  const [v1, setV1] = useState(settings.get('v1') || false);
  const [v2, setV2] = useState(settings.get('v2') || false);
  const [integratedRMS, setIntegratedRMS] = useState(settings.get('integratedRMS') || false);
  const [threshold, setThreshold] = useState(settings.getIn(['crisisProfileReportThreshold', 'threshold'], 6));
  const [months, setMonths] = useState(settings.getIn(['crisisProfileReportThreshold', 'months'], 6));
  const [privacyThreshold, setPrivacyThreshold] = useState(settings.has('crisisProfileReportThreshold'));

  const handleV1Change = (e :SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    let newSettings = settings.set('v1', checked);
    setV1(checked);
    if (checked) {
      newSettings = newSettings.delete('v2');
      setV2(false);
    }
    dispatch(updateAppSettings({
      entityKeyId: settingsEKID,
      settings: newSettings,
    }));
  };

  const handleV2Change = (e :SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    setV2(checked);
    if (e.currentTarget.checked) {
      setV1(false);
    }
  };

  const handleIntegratedRMS = (e :SyntheticEvent<HTMLInputElement>) => {
    setIntegratedRMS(e.currentTarget.checked);
  };

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <Header>
          Settings
        </Header>
        <List>
          <ListSubheader>Crisis Report Version</ListSubheader>
          <ListItem>
            <ListItemText primary="V1" />
            <ListItemSecondaryAction>
              <Switch checked={v1} name="v1" onChange={handleV1Change} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="V2" secondary="Requires migration. Contact support" />
            <ListItemSecondaryAction>
              <Switch checked={v2} name="v2" onChange={handleV2Change} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListSubheader>Integration Settings</ListSubheader>
          <ListItem>
            <ListItemText
                primary="Integrated RMS"
                secondary="Enabling this setting hides search results for people without reports" />
            <ListItemSecondaryAction>
              <Switch checked={integratedRMS} name="integratedRMS" onChange={handleIntegratedRMS} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListSubheader>Crisis Profile Privacy</ListSubheader>
          <ListItem>
            <ListItemText
                primary="Crisis Report Privacy Threshold"
                secondary="Hide profiles that do not meet a report count threshold" />
            <ListItemSecondaryAction>
              <Switch checked={privacyThreshold} name="privacyThreshold" />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button disabled={!privacyThreshold}>
            <ListItemText
                primary="Report Count"
                secondary={threshold} />
          </ListItem>
          <ListItem button disabled={!privacyThreshold}>
            <ListItemText
                primary="Threshold Window"
                secondary={months} />
          </ListItem>
        </List>
      </ContentWrapper>
    </ContentOuterWrapper>
  );
};

export default SettingsContainer;
