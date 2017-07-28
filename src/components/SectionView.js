/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { injectGlobal } from 'styled-components';

const SectionWrapper = styled.div`
	margin-bottom: 60px;
`;

const Header = styled.div`
	font-size: 24px;
	margin-bottom: 20px;
`;

const SectionView = ({header, ...props}) => {
	return (
		<SectionWrapper>
			<Header>
				{header}
			</Header>
			<div>
				{props.children}
			</div>
		</SectionWrapper>
	);
}

SectionView.propTypes = {
  header: PropTypes.string.isRequired
};

export default SectionView;
