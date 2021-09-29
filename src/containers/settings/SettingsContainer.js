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
import {
  CRISIS_PROFILE_REPORT_THRESHOLD,
  INTEGRATED_RMS,
  MONTHS,
  THRESHOLD,
  V1,
  V2
} from './constants';

import { useAppSettings } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper, Header } from '../../components/layout';

const SettingsContainer = () => {
  const dispatch = useDispatch();
  const [settings, settingsEKID] = useAppSettings();
  const v1 = settings.get(V1) || false;
  const v2 = settings.get(V2) || false;
  const integratedRMS = settings.get(INTEGRATED_RMS) || false;
  const threshold = settings.getIn([CRISIS_PROFILE_REPORT_THRESHOLD, THRESHOLD], 6);
  const months = settings.getIn([CRISIS_PROFILE_REPORT_THRESHOLD, MONTHS], 6);
  const privacyThreshold = settings.has(CRISIS_PROFILE_REPORT_THRESHOLD);

  const handleV1Change = (e :SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    let newSettings = settings.set(V1, checked);
    if (checked) {
      newSettings = newSettings.delete(V2);
    }
    dispatch(updateAppSettings({
      id: settingsEKID,
      settings: newSettings,
    }));
  };

  const handleV2Change = (e :SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    let newSettings = settings.set(V2, checked);
    if (checked) {
      newSettings = newSettings.delete(V1);
    }
    dispatch(updateAppSettings({
      id: settingsEKID,
      settings: newSettings,
    }));
  };

  const handleIntegratedRMS = (e :SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    // setIntegratedRMS(checked);
    const newSettings = settings.set(INTEGRATED_RMS, checked);
    dispatch(updateAppSettings({
      id: settingsEKID,
      settings: newSettings,
    }));
  };

  const handlePrivacyThreshold = (e :SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    // setPrivacyThreshold(checked);
    let newSettings = settings;
    if (checked) {
      newSettings = settings
        .setIn([CRISIS_PROFILE_REPORT_THRESHOLD, THRESHOLD], threshold)
        .setIn([CRISIS_PROFILE_REPORT_THRESHOLD, MONTHS], months);
    }
    else {
      newSettings = settings.delete(CRISIS_PROFILE_REPORT_THRESHOLD);
    }
    dispatch(updateAppSettings({
      id: settingsEKID,
      settings: newSettings,
    }));
  };

  const handleOpenThreshold = (e :SyntheticEvent<HTMLInputElement>) => {

  };

  const handleOpenMonths = (e :SyntheticEvent<HTMLInputElement>) => {

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
              <Switch
                  checked={v1}
                  name={V1}
                  onChange={handleV1Change} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="V2" secondary="Requires migration. Contact support" />
            <ListItemSecondaryAction>
              <Switch
                  checked={v2}
                  name={V2}
                  onChange={handleV2Change} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListSubheader>Integration Settings</ListSubheader>
          <ListItem>
            <ListItemText
                primary="Integrated RMS"
                secondary="Enabling this setting hides search results for people without reports" />
            <ListItemSecondaryAction>
              <Switch checked={integratedRMS} name={INTEGRATED_RMS} onChange={handleIntegratedRMS} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListSubheader>Crisis Profile Privacy</ListSubheader>
          <ListItem>
            <ListItemText
                primary="Crisis Report Privacy Threshold"
                secondary="Hide profiles that do not meet a report count threshold" />
            <ListItemSecondaryAction>
              <Switch
                  checked={privacyThreshold}
                  name={CRISIS_PROFILE_REPORT_THRESHOLD}
                  onChange={handlePrivacyThreshold} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button disabled={!privacyThreshold} name={THRESHOLD}>
            <ListItemText
                primary="Report Count"
                secondary={threshold} />
          </ListItem>
          <ListItem button disabled={!privacyThreshold} name={MONTHS}>
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
