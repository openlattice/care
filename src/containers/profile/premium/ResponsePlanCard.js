// @flow
import React from 'react';

import styled from 'styled-components';
import {
  faBan,
  faCheckCircle,
  faCircle,
  faExclamationTriangle
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List } from 'immutable';
import {
  Card,
  CardSegment,
  Colors,
  IconSplash,
} from 'lattice-ui-kit';
import type { UUID } from 'lattice';

import Accordion from '../../../components/accordion';
import * as FQN from '../../../edm/DataModelFqns';
import { Header } from '../../../components/layout';
import { CardSkeleton } from '../../../components/skeletons';

const {
  GREEN,
  NEUTRAL,
  RED,
  YELLOW,
} = Colors;

const StyledSplash = styled(IconSplash)`
  margin: 0 0 15px;
`;

const ListHeader = styled.h2`
  margin: 15px 0;
  font-size: 1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
`;

const ListWrapper = styled.ul`
  list-style-type: none;
  padding-inline-start: 70px;
  margin: 0;
  margin-top: -1rem;

  > li {
    border-bottom: 1px solid ${NEUTRAL.N100};
    padding: 1rem 0;
  }
`;

const StyledAccordion = styled(Accordion)`
  padding: 0;
`;

const Headline = styled.div`
  padding: 1rem 0;
`;

const Description = styled.div`
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const AccordionTitle = ({ headline }) => <Headline>{headline}</Headline>;

const IconLayer = styled.span`
  font-size: 2.5rem;
  margin-right: 30px;

  svg:last-of-type {
    font-size: 1rem;
  }
`;

type Props = {
  interactionStrategies :List;
  isLoading :boolean;
  officerSafety :List;
  triggers :List;
};

const ResponsePlanCard = (props :Props) => {
  const {
    interactionStrategies,
    isLoading,
    officerSafety,
    triggers,
  } = props;

  if (isLoading) return <CardSkeleton />;

  return (
    <Card>
      <CardSegment vertical>
        <Header>Response Plan</Header>
        <ListHeader>
          <IconLayer className="fa-layers">
            <FontAwesomeIcon icon={faCircle} color={RED.R00} />
            <FontAwesomeIcon icon={faExclamationTriangle} color={RED.R400} />
          </IconLayer>
          Officer Safety
        </ListHeader>
        { !officerSafety.count() && <StyledSplash caption="No curated safety concerns." /> }
        <ListWrapper>
          {
            officerSafety.map((concern) => {
              const category = concern.getIn([FQN.CATEGORY_FQN, 0], '');
              const entityKeyId = concern.getIn([FQN.OPENLATTICE_ID_FQN, 0]);
              return (
                <li key={entityKeyId}>{category}</li>
              );
            })
          }
        </ListWrapper>
        <ListHeader>
          <IconLayer className="fa-layers">
            <FontAwesomeIcon icon={faCircle} color={YELLOW.Y00} />
            <FontAwesomeIcon icon={faBan} color={YELLOW.Y400} />
          </IconLayer>
          Triggers
        </ListHeader>
        { !triggers.count() && <StyledSplash caption="No curated triggers." /> }
        <ListWrapper>
          {
            triggers.map((trigger) => {
              const value :string = trigger.getIn([FQN.TRIGGER_FQN, 0], '');
              const triggerEKID :UUID = trigger.getIn([FQN.OPENLATTICE_ID_FQN, 0]);
              return <li key={triggerEKID}>{value}</li>;
            })
          }
        </ListWrapper>
        <ListHeader>
          <IconLayer className="fa-layers">
            <FontAwesomeIcon icon={faCircle} color={GREEN.G00} />
            <FontAwesomeIcon icon={faCheckCircle} color={GREEN.G400} />
          </IconLayer>
          Interaction Strategies
        </ListHeader>
        { !interactionStrategies.count() && <StyledSplash caption="No curated strategies." /> }
        <ListWrapper>
          <StyledAccordion>
            {
              interactionStrategies.map((strat, index) => {
                const title = strat.getIn([FQN.TITLE_FQN, 0]) || '';
                const description = strat.getIn([FQN.DESCRIPTION_FQN, 0]) || '';
                const entityKeyId :UUID = strat.getIn([FQN.OPENLATTICE_ID_FQN, 0]);
                return (
                  <div
                      key={entityKeyId}
                      headline={`${index + 1}. ${title}`}
                      titleComponent={AccordionTitle}>
                    <Description>{description}</Description>
                  </div>
                );
              })
            }
          </StyledAccordion>
        </ListWrapper>
      </CardSegment>
    </Card>
  );
};

export default ResponsePlanCard;
