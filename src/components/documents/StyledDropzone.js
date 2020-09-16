import React from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import {
  ALL_IMAGE_MIME_TYPE,
  ALL_VIDEO_MIME_TYPE,
  ALL_AUDIO_MIME_TYPE,
  PDF_MIME_TYPE,
  DOCX_MIME_TYPE,
} from '../../utils/constants/FileTypeConstants';

const ACCEPTED_MIME_TYPES = [
  ALL_IMAGE_MIME_TYPE,
  ALL_VIDEO_MIME_TYPE,
  ALL_AUDIO_MIME_TYPE,
  PDF_MIME_TYPE,
  DOCX_MIME_TYPE,
];

const getColor = (props) => {
  if (props.isDragAccept) {
    return '#6124e2';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

const StyledDropzone = (props) => {
  const { onDrop } = props;
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: ACCEPTED_MIME_TYPES.join(','),
    onDrop
  });

  return (
    <div className="container">
      <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        <p>Drop a file here, or click to select a file to upload.</p>
      </Container>
    </div>
  );
};

export default StyledDropzone;
