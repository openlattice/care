/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { List, Map, fromJS } from 'immutable';
import { DatePicker } from '@atlaskit/datetime-picker';

import ButtonToolbar from '../buttons/ButtonToolbar';
import BasicButton from '../buttons/BasicButton';
import InfoButton from '../buttons/InfoButton';
import FieldHeader from '../text/styled/FieldHeader';
import TextField from '../text/TextField';
import SelfieWebCam, { DATA_URL_PREFIX } from '../SelfieWebCam';

import {
  FormGridWrapper,
  FullWidthItem,
  HalfWidthItem,
} from '../form/StyledFormComponents';

import {
  GENDERS,
  RACES
} from '../../utils/DataConstants';

import {
  PERSON_DOB_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  PERSON_ID_FQN,
  PERSON_PICTURE_FQN,
} from '../../edm/DataModelFqns';

type Props = {
  inputPerson :Map<*, *>,
  backToSearch :() => void,
  handleSubmit :(person :Map<*, *>) => void,
  isSavingChanges :boolean
}

type State = {
  person :Map<*, *>,
  isEditing :boolean,
  shouldTakePhoto :boolean
}

const FullWidthWrapper = styled.div`
  max-width: 100%;
`;

const PersonPicture = styled.img`
  max-width: 100%;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SaveButton = styled(InfoButton)`
  padding: 12px 35px;
  font-size: 14px;
`;

const DATE_DISPLAY_FORMAT = 'MM/DD/YYYY';

export default class EditPerson extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      person: this.setMultimapToMap(props.inputPerson),
      isEditing: false,
      shouldTakePhoto: false
    };
  }

  componentWillReceiveProps(nextProps :Props) {
    const { inputPerson, isSavingChanges } = this.props;
    if (nextProps.inputPerson !== inputPerson) {
      this.setState({ person: this.setMultimapToMap(nextProps.inputPerson) });
    }
    if (isSavingChanges && !nextProps.isSavingChanges) {
      this.setState({ isEditing: false });
    }
  }

  setMultimapToMap = (setMultimap) => {
    let map = Map();
    fromJS(setMultimap).entrySeq().forEach(([key, valueList]) => {
      map = map.set(key, valueList.join(', '));
    });

    return map;
  }

  renderConsumerPicture = () => {
    const { person } = this.state;

    if (!person.get(PERSON_PICTURE_FQN)) {
      return null;
    }

    const pictureDataUrl = this.getPictureDataUrl();
    return (
      <FullWidthItem>
        <FieldHeader>
          Consumer Picture
        </FieldHeader>
        <PersonPicture
            alt="Consumer"
            src={pictureDataUrl} />
      </FullWidthItem>
    );
  }

  handleOnSelfieCapture = (selfieDataAsBase64) => {
    const { person } = this.state;
    const pictureSrc = this.getPictureDataUrl(selfieDataAsBase64 || '');
    this.setState({ person: person.set(PERSON_PICTURE_FQN, pictureSrc) });
  }

  getPictureDataUrl = (optionalSrc) => {
    const { person } = this.state;

    let pictureDataUrl = optionalSrc || person.get(PERSON_PICTURE_FQN);
    if (pictureDataUrl && !pictureDataUrl.startsWith('data:image')) {
      pictureDataUrl = `${DATA_URL_PREFIX}${pictureDataUrl}`;
    }

    return pictureDataUrl;
  }

  handleOnSelectImage = (e) => {
    const { person } = this.state;
    const { files } = e.target;

    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const pictureDataAsBase64 = reader.result;
        const pictureSrc = this.getPictureDataUrl(pictureDataAsBase64 || '');
        this.setState({ person: person.set(PERSON_PICTURE_FQN, pictureSrc) });
      };
    }
  }

  renderPhotoSelection = () => {
    const { shouldTakePhoto } = this.state;

    const pictureOptions = [
      {
        label: 'Upload a Photo',
        value: false,
        onClick: () => {
          this.setState({ shouldTakePhoto: false });
          if (this.selfieWebCam) {
            this.selfieWebCam.closeMediaStream();
          }
        }
      },
      {
        label: 'Take a Photo',
        value: true,
        onClick: () => this.setState({ shouldTakePhoto: true })
      }
    ];

    const pictureDataUrl = this.getPictureDataUrl();

    return (
      <FullWidthItem>
        <FieldHeader>
          Consumer Picture
        </FieldHeader>
        <ButtonToolbar options={pictureOptions} value={shouldTakePhoto} isBasic />
        {
          shouldTakePhoto
            ? (
              <SelfieWebCam
                  onSelfieCapture={this.handleOnSelfieCapture}
                  ref={(element) => {
                    this.selfieWebCam = element;
                  }} />
            ) : (
            <>
              <label htmlFor="consumer-picture-file">
                <input
                    id="consumer-picture-file"
                    type="file"
                    onChange={this.handleOnSelectImage}
                    accept=".jpg, .png, .jpeg" />
              </label>
              {pictureDataUrl && pictureDataUrl.length
                ? <PersonPicture alt="Consumer" src={pictureDataUrl} />
                : null}
            </>
            )
        }

      </FullWidthItem>
    );
  }

  handleChange = (fqn, value) => {
    const { person } = this.state;

    this.setState({ person: person.set(fqn, value) });
  }

  renderInput = (label, fqn) => {
    const { person, isEditing } = this.state;

    return (
      <TextField
          disabled={!isEditing}
          header={label}
          onChange={value => this.handleChange(fqn, value)}
          value={person.get(fqn, '')} />
    );
  }

  handleChangeEvent = (event :SyntheticEvent) => {
    const { person } = this.state;
    const { name, value } = event.target;

    this.setState({ person: person.set(name, value) });
  }

  toggleEdit = () => {
    const { isEditing } = this.state;
    this.setState({ isEditing: !isEditing });
  }

  handleSubmit = () => {
    const { handleSubmit } = this.props;
    const { person } = this.state;
    let setMultimap = Map();
    person.entrySeq().forEach(([key, value]) => {
      const formattedValue = (key === PERSON_PICTURE_FQN) ? List.of(value) : value.split(',').map(val => val.trim());
      setMultimap = setMultimap.set(key, formattedValue);
    });

    handleSubmit(setMultimap);
  }

  render() {
    const { backToSearch, isSavingChanges } = this.props;
    const { person, isEditing } = this.state;

    return (
      <>
        <FormGridWrapper>
          <FullWidthItem>
            <h1>Consumer</h1>
            <ButtonRow>
              <BasicButton onClick={backToSearch}>Back to search</BasicButton>
              {
                isEditing
                  ? (
                    <SaveButton disabled={isSavingChanges} onClick={this.handleSubmit}>
                      {isSavingChanges ? 'Saving...' : 'Save changes'}
                    </SaveButton>
                  )
                  : <BasicButton onClick={this.toggleEdit}>Edit</BasicButton>
              }
            </ButtonRow>
          </FullWidthItem>
          {this.renderInput('Last Name', PERSON_LAST_NAME_FQN)}
          {this.renderInput('First Name', PERSON_FIRST_NAME_FQN)}
          {this.renderInput('Middle Name', PERSON_MIDDLE_NAME_FQN)}
          <TextField
              disabled
              header="Consumer Identification*"
              value={person.get(PERSON_ID_FQN, '')} />
          {isEditing ? this.renderPhotoSelection() : this.renderConsumerPicture()}
          <HalfWidthItem>
            <FieldHeader>Gender</FieldHeader>
            <select
                name={PERSON_SEX_FQN}
                disabled={!isEditing}
                onChange={this.handleChangeEvent}
                value={person.get(PERSON_SEX_FQN, '')}>
              <option value="">Select</option>
              {Object.values(GENDERS).map(gender => <option key={gender} value={gender}>{gender}</option>)}
            </select>
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Race</FieldHeader>
            <select
                name={PERSON_RACE_FQN}
                disabled={!isEditing}
                onChange={this.handleChangeEvent}
                value={person.get(PERSON_RACE_FQN, '')}>
              <option value="">Select</option>
              {Object.values(RACES).map(race => <option key={race} value={race}>{race}</option>)}
            </select>
          </HalfWidthItem>
          <HalfWidthItem>
            <FieldHeader>Date of Birth</FieldHeader>
            <FullWidthWrapper>
              <DatePicker
                  value={person.get(PERSON_DOB_FQN)}
                  isDisabled={!isEditing}
                  dateFormat={DATE_DISPLAY_FORMAT}
                  onChange={dob => this.setState({ person: person.set(PERSON_DOB_FQN, dob) })}
                  selectProps={{
                    placeholder: DATE_DISPLAY_FORMAT,
                  }} />
            </FullWidthWrapper>
          </HalfWidthItem>
        </FormGridWrapper>
      </>
    );
  }
}
