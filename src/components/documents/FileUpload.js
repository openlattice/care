/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

import StyledDropzone from './StyledDropzone';
import { extractDocumentText } from '../../utils/DocumentUtils';

type Props = {
  onUpload :Function
}

type State = {
  dropzoneActive :boolean;
  mediaIndex :number;
}

const DropzoneWrapper = styled.div`
  margin: 30px 0;
`;

export default class FileUpload extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      dropzoneActive: false,
      mediaIndex: -1
    };
  }

  dropzoneStyle = () => {
    const { dropzoneActive } = this.state;
    return {
      width: '100%',
      height: '500px',
      textAlign: 'center',
      border: `2px dashed ${dropzoneActive ? '#6124e2' : '#361876'}`,
      padding: '70px 30px',
      color: '#8e929b',
      fontWeight: '300'
    };
  }

  onDrop = (files) => {
    const { mediaIndex } = this.state;
    const { onUpload } = this.props;

    this.setState({
      dropzoneActive: false,
      mediaIndex: -1
    });

    files.forEach((file) => {
      const { name, type } = file;
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64 = event.target.result;

        extractDocumentText(type, base64).then((text) => {
          onUpload({
            index: mediaIndex,
            file: {
              base64,
              name,
              text,
              type
            }
          });
        });

      };
      reader.readAsDataURL(file);
    });
  }

  render() {

    return (
      <DropzoneWrapper>
        <StyledDropzone onDrop={this.onDrop} />
      </DropzoneWrapper>
    );
  }

}
