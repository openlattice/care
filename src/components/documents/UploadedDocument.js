/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileAudio,
  faFilePdf,
  faFileVideo,
  faFileWord,
} from '@fortawesome/pro-regular-svg-icons';

import RoundButton from '../buttons/RoundButton';
import {
  VIDEO_TYPE_PREFIX,
  AUDIO_TYPE_PREFIX,
  PDF_MIME_TYPE,
  DOCX_MIME_TYPE,
} from '../../utils/constants/FileTypeConstants';

const MIME_TYPES_TO_ICONS = {
  [PDF_MIME_TYPE]: faFilePdf,
  [DOCX_MIME_TYPE]: faFileWord,
  [AUDIO_TYPE_PREFIX]: faFileAudio,
  [VIDEO_TYPE_PREFIX]: faFileVideo,
};

type Props = {
  file :{
    name :string;
    type :string;
    base64 :string;
  };
  onDelete :Function
}

const FileRow = styled.div`
  width: 100%;
  padding: 15px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eaeaf0;
`;

const RowSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
`;

const ImageWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImagePreview = styled.img`
  max-height: 80px;
  max-width: 80px;
`;

const UploadedDocument = ({ file, onDelete } :Props) => {

  const { name, type, base64 } = file;

  let icon;
  Object.entries(MIME_TYPES_TO_ICONS).forEach(([prefix, fileTypeIcon]) => {
    if (type.startsWith(prefix)) {
      icon = fileTypeIcon;
    }
  });
  const imagePreview = icon ? <FontAwesomeIcon icon={icon} /> : <ImagePreview src={base64} />;

  return (
    <FileRow>
      <RowSection>
        <ImageWrapper>
          {imagePreview}
        </ImageWrapper>
        {name}
      </RowSection>

      <RowSection>
        <RoundButton type="delete" onClick={onDelete} />
      </RowSection>
    </FileRow>
  );
};

export default UploadedDocument;
