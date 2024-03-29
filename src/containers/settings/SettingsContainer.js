// @flow

import React from 'react';

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
import { Link } from 'react-router-dom';

import { updateAppSettings } from './actions';
import {
  CLINICIAN_REPORTS,
  CRISIS_PROFILE_REPORT_THRESHOLD,
  INTEGRATED_RMS,
  MONTHS,
  THRESHOLD,
  V1,
  V2
} from './constants';

import { useAppSettings } from '../../components/hooks';
import { ContentOuterWrapper, ContentWrapper, Header } from '../../components/layout';
import { SETTINGS_EDITOR_PATH } from '../../core/router/Routes';

const SettingsContainer = () => {
  const dispatch = useDispatch();
  const [settings, settingsEKID] = useAppSettings();
  const v1 = settings.get(V1, false);
  const v2 = settings.get(V2, false);
  const clinicianReports = settings.get(CLINICIAN_REPORTS, true);
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
      newSettings = newSettings
        .delete(V1)
        .delete(CLINICIAN_REPORTS);
    }
    dispatch(updateAppSettings({
      id: settingsEKID,
      settings: newSettings,
    }));
  };

  const handleClinicianReportsChange = (e :SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    const newSettings = settings.set(CLINICIAN_REPORTS, checked);
    dispatch(updateAppSettings({
      id: settingsEKID,
      settings: newSettings,
    }));
  };

  const handleIntegratedRMS = (e :SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
    const newSettings = settings.set(INTEGRATED_RMS, checked);
    dispatch(updateAppSettings({
      id: settingsEKID,
      settings: newSettings,
    }));
  };

  const handlePrivacyThreshold = (e :SyntheticEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;
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

  return (
    <ContentOuterWrapper>
      <ContentWrapper>
        <Header>
          Application Settings
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
          {
            v2 && (
              <ListItem>
                <ListItemText primary="Clinician Reports" secondary="Requires V2" />
                <ListItemSecondaryAction>
                  <Switch
                      checked={clinicianReports}
                      name={CLINICIAN_REPORTS}
                      onChange={handleClinicianReportsChange} />
                </ListItemSecondaryAction>
              </ListItem>
            )
          }
          <ListItem button component={Link} to={SETTINGS_EDITOR_PATH}>
            <ListItemText>Form Schemas</ListItemText>
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
          <ListItem disabled={!privacyThreshold} name={THRESHOLD}>
            <ListItemText
                primary="Report Count"
                secondary={threshold} />
          </ListItem>
          <ListItem disabled={!privacyThreshold} name={MONTHS}>
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
