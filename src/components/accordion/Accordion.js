/*
 * @flow
 */

import React, { Component } from 'react';
import { Card } from 'lattice-ui-kit';
import type { ComponentType, ElementProps, Node } from 'react';

import AccordionSection from './AccordionSection';
import { isDefined } from '../../utils/LangUtils';

type ChildProps = {
  defaultOpen :boolean;
  children ?:Node;
  props :ElementProps<any>;
  titleComponent :ComponentType<any>;
}

type Props = {
  children :Node;
  className ?:string;
};

type State = {
  openSections :Object
};

class Accordion extends Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      openSections: this.setDefaultOpenSections()
    };
  }

  setDefaultOpenSections = () => {
    const { children } = this.props;
    const openSections = {};
    React.Children.forEach(children, (child :ChildProps, index :number) => {
      if (isDefined(child)) {
        const { props = {} } = child;
        openSections[index] = props.defaultOpen || props.alwaysOpen || false;
      }
      else {
        openSections[index] = false;
      }
    });
    return openSections;
  }

  onClick = (index :number) => {
    const { openSections } = this.state;
    const isOpen = !!openSections[index];

    this.setState({
      openSections: {
        ...openSections,
        [index]: !isOpen
      }
    });
  };

  renderAccordionSections = () => {
    const { children } = this.props;
    const { openSections } = this.state;
    const sections = React.Children.map(children, (child :ChildProps, index :number) => {
      if (!isDefined(child)) {
        return null;
      }
      const { children: innerChildren, titleComponent, ...rest } = child.props;
      return (
        <AccordionSection
            isOpen={!!openSections[index]}
            onClick={this.onClick}
            titleComponent={titleComponent}
            index={index}
            {...rest}>
          {innerChildren}
        </AccordionSection>
      );
    });

    return sections;
  }

  render() {
    const { className } = this.props;
    return (
      <Card className={className}>
        { this.renderAccordionSections() }
      </Card>
    );
  }
}

export default Accordion;
