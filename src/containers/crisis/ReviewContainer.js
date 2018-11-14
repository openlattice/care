/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { STATE } from '../../utils/constants/StateConstants';
import { BLACK, TAG_GRAY } from '../../shared/Colors';
import {
  OTHER,
  SUBJECT_INFORMATION,
  OBSERVED_BEHAVIORS,
  CRISIS_NATURE,
  OFFICER_SAFETY,
  DISPOSITION
} from '../../utils/constants/CrisisTemplateConstants';
import { DISPOSITIONS as DISP_VALUES } from '../pages/disposition/Constants';
import { MEDIA_QUERY_MD } from '../../core/style/Sizes';
import { FormWrapper } from '../../components/crisis/FormComponents';


type Props = {
  subjectInformation :Map<*, *>,
  observedBehaviors :Map<*, *>,
  natureOfCrisis :Map<*, *>,
  officerSafety :Map<*, *>,
  disposition :Map<*, *>
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: ${BLACK};
`;

const Name = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: bold;
  margin: 10px 0 20px 0;

  span:first-child {
    font-size: 20px;
    text-transform: uppercase;
  }

  span:last-child {
    font-size: 16px;
    margin-top: 10px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0;

  h1 {
    font-weight: bold;
    font-size: 18px;
  }

  div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    span {
      padding: 7px 10px;
      background-color: ${TAG_GRAY};
      margin: 10px 10px 10px 0;

      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

const ReviewHeader = styled.div`
  font-size: 16px;
  color: ${BLACK};

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    font-size: 18px;
  }
`;

class ReviewContainer extends React.Component<Props> {

  getValueList = (values, field, otherField) => {
    let list = values.get(field, List());
    if (otherField && list.includes(OTHER)) {
      list = list.splice(list.indexOf(OTHER), 1, values.get(otherField, ''));
    }

    return list.map(val => <span key={val}>{val}</span>);
  }

  renderName = () => {
    const { subjectInformation } = this.props;
    const {
      FIRST,
      LAST,
      MIDDLE,
      DOB
    } = SUBJECT_INFORMATION;

    const first = subjectInformation.get(FIRST, '');
    const last = subjectInformation.get(LAST, '');
    const middle = subjectInformation.get(MIDDLE, '');

    const dobMoment = moment(subjectInformation.get(DOB, ''));
    const dob = dobMoment.isValid() ? dobMoment.format('MM-DD-YYYY') : '';

    return (
      <Name>
        <span>{`${last}, ${first} ${middle}`}</span>
        <span>{dob}</span>
      </Name>
    );
  }

  renderBehaviors = () => {
    const { observedBehaviors } = this.props;
    const {
      BEHAVIORS,
      OTHER_BEHAVIOR,
      DEMEANORS
    } = OBSERVED_BEHAVIORS;

    return (
      <>
        <Section>
          <h1>Subject Behaviors</h1>
          <div>{this.getValueList(observedBehaviors, BEHAVIORS, OTHER_BEHAVIOR)}</div>
        </Section>
        <Section>
          <h1>Demeanors Observed Around Law Enforcement</h1>
          <div>{this.getValueList(observedBehaviors, DEMEANORS)}</div>
        </Section>
      </>
    );
  }

  renderNatureOfCrisis = () => {
    const { natureOfCrisis } = this.props;
    const {
      NATURE_OF_CRISIS,
      ASSISTANCE,
      OTHER_ASSISTANCE,
      HOUSING
    } = CRISIS_NATURE;

    return (
      <>
        <Section>
          <h1>Nature of Crisis</h1>
          <div>{this.getValueList(natureOfCrisis, NATURE_OF_CRISIS)}</div>
        </Section>
        <Section>
          <h1>Assistance on Scene for Subject</h1>
          <div>{this.getValueList(natureOfCrisis, ASSISTANCE, OTHER_ASSISTANCE)}</div>
        </Section>
        <Section>
          <h1>Current Housing Situation</h1>
          <div>{this.getValueList(natureOfCrisis, HOUSING)}</div>
        </Section>
      </>
    );
  }

  renderOfficerSafety = () => {
    const { officerSafety } = this.props;
    const {
      TECHNIQUES,
      HAD_WEAPON,
      WEAPONS,
      OTHER_WEAPON,
      THREATENED_VIOLENCE,
      THREATENED_PERSON_RELATIONSHIP,
      HAD_INJURIES,
      INJURY_TYPE,
      INJURED_PARTIES,
      OTHER_INJURED_PERSON,
      OTHER_INJURY_TYPE
    } = OFFICER_SAFETY;

    let violenceList = List();

    if (officerSafety.get(HAD_WEAPON)) {
      let weapons = officerSafety.get(WEAPONS);
      if (weapons.includes(OTHER)) {
        weapons = weapons.splice(weapons.indexOf(OTHER), 1, officerSafety.get(OTHER_WEAPON, ''));
      }

      violenceList = violenceList.concat(weapons.map(val => `Brandished weapon: ${val}`));
    }

    if (officerSafety.get(THREATENED_VIOLENCE)) {
      violenceList = violenceList.concat(officerSafety.get(THREATENED_PERSON_RELATIONSHIP, List()).map(val => (
        `Threatened violence against: ${val}`
      )));
    }

    if (officerSafety.get(HAD_INJURIES)) {
      let injuredParties = officerSafety.get(INJURED_PARTIES, List());
      if (injuredParties.includes(OTHER)) {
        injuredParties = injuredParties.splice(
          injuredParties.indexOf(OTHER),
          1,
          officerSafety.get(OTHER_INJURED_PERSON, '')
        );
      }
      violenceList = violenceList.concat(injuredParties.map(val => `Injured party: ${val}`));

      let injuryTypes = officerSafety.get(INJURY_TYPE, List());
      if (injuryTypes.includes(OTHER)) {
        injuryTypes = injuryTypes.splice(injuryTypes.indexOf(OTHER), 1, officerSafety.get(OTHER_INJURY_TYPE, ''));
      }

      violenceList = violenceList.concat(injuryTypes.map(val => `Injury type: ${val}`));
    }

    return (
      <>
        <Section>
          <h1>Techniques</h1>
          <div>{this.getValueList(officerSafety, TECHNIQUES)}</div>
        </Section>
        {
          violenceList.size ? (
            <Section>
              <h1>Threats / Violence / Weapons</h1>
              <div>{violenceList.map(val => <span key={val}>{val}</span>)}</div>
            </Section>
          ) : null
        }
      </>
    );
  }

  renderDisposition = () => {
    const { disposition } = this.props;
    const {
      SPECIALISTS,
      DISPOSITIONS,
      PEOPLE_NOTIFIED,
      OTHER_PEOPLE_NOTIFIED,
      VERBAL_REFERRALS,
      OTHER_VERBAL_REFERRAL,
      COURTESY_TRANSPORTS,
      WAS_VOLUNTARY_TRANSPORT,
      ARRESTABLE_OFFENSES,
      NO_ACTION_VALUES
    } = DISPOSITION;

    let dispositionValues = disposition.get(DISPOSITIONS, List());

    const updateValues = (list, fieldName) => {
      dispositionValues = dispositionValues.splice(
        dispositionValues.indexOf(fieldName),
        1,
        ...list.map(val => `${fieldName}: ${val}`).toJS()
      );
    };

    if (dispositionValues.includes(DISP_VALUES.NOTIFIED_SOMEONE)) {
      let notifiedPeople = disposition.get(PEOPLE_NOTIFIED, List());
      if (notifiedPeople.includes(OTHER)) {
        notifiedPeople = notifiedPeople.splice(
          notifiedPeople.indexOf(OTHER),
          1,
          disposition.get(OTHER_PEOPLE_NOTIFIED, '')
        );
      }

      updateValues(notifiedPeople, DISP_VALUES.NOTIFIED_SOMEONE);
    }

    if (dispositionValues.includes(DISP_VALUES.VERBAL_REFERRAL)) {
      let referrals = disposition.get(VERBAL_REFERRALS, List());
      if (referrals.includes(OTHER)) {
        referrals = referrals.splice(referrals.indexOf(OTHER), 1, disposition.get(OTHER_VERBAL_REFERRAL, ''));
      }

      updateValues(referrals, DISP_VALUES.VERBAL_REFERRAL);
    }

    if (dispositionValues.includes(DISP_VALUES.COURTESY_TRANPORT)) {
      updateValues(disposition.get(COURTESY_TRANSPORTS, List()), DISP_VALUES.COURTESY_TRANPORT);
    }

    if (dispositionValues.includes(DISP_VALUES.HOSPITAL)) {
      const type = disposition.get(WAS_VOLUNTARY_TRANSPORT) ? 'Voluntary' : 'Involuntary';
      updateValues(List.of(`${DISP_VALUES.HOSPITAL}: ${type} Committal`), DISP_VALUES.HOSPITAL);
    }

    if (dispositionValues.includes(DISP_VALUES.ARRESTABLE_OFFENSE)) {
      updateValues(disposition.get(ARRESTABLE_OFFENSES, List()), DISP_VALUES.ARRESTABLE_OFFENSE);
    }

    if (dispositionValues.includes(DISP_VALUES.NO_ACTION_POSSIBLE)) {
      updateValues(disposition.get(NO_ACTION_VALUES, List()), DISP_VALUES.NO_ACTION_POSSIBLE);
    }

    return (
      <>
        {
          disposition.get(SPECIALISTS, List()).size ? (
            <Section>
              <h1>Specialists on Scene</h1>
              <div>{this.getValueList(disposition, SPECIALISTS)}</div>
            </Section>
          ) : null
        }
        <Section>
          <h1>Disposition</h1>
          <div>{dispositionValues.map(val => <span key={val}>{val}</span>)}</div>
        </Section>
      </>
    );
  }

  render() {
    return (
      <FormWrapper>
        <ReviewHeader>{`Crisis Template Narrative: ${moment().format('MM-DD-YYYY')}`}</ReviewHeader>
        <Wrapper>
          {this.renderName()}
          {this.renderBehaviors()}
          {this.renderNatureOfCrisis()}
          {this.renderOfficerSafety()}
          {this.renderDisposition()}
        </Wrapper>
      </FormWrapper>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    subjectInformation: state.get(STATE.SUBJECT_INFORMATION),
    observedBehaviors: state.get(STATE.OBSERVED_BEHAVIORS),
    natureOfCrisis: state.get(STATE.NATURE_OF_CRISIS),
    officerSafety: state.get(STATE.OFFICER_SAFETY),
    disposition: state.get(STATE.DISPOSITION)
  };
}

export default withRouter(
  connect(mapStateToProps, null)(ReviewContainer)
);
