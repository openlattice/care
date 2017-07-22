/*
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

const SectionView = ({header, ...props}) => {
	return (
		<div>
			<div>
				{header}
			</div>
			<div>
				{props.children}
			</div>

		</div>
	);
}

SectionView.propTypes = {
  header: PropTypes.string.isRequired
};

export default SectionView;
