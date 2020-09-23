/*
 * @flow
 */

import React from 'react';
import type { Node } from 'react';

import styled from 'styled-components';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map, OrderedMap, OrderedSet } from 'immutable';
import {
  Button,
  Creatable,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Label,
  Spinner,
  Typography,
} from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

import PeopleSelection from './PeopleSelection';
import { loadUsedTags, uploadDocuments } from './DocumentsActionFactory';

import FileUpload from '../../components/documents/FileUpload';
import UploadedDocument from '../../components/documents/UploadedDocument';
import { DOCUMENTS } from '../../utils/constants/StateConstants';

type Props = {
  actions :{
    loadUsedTags :Function;
    uploadDocuments :Function;
  };
  isUploading :boolean;
  tags :OrderedSet<string>;
};

type State = {
  files :Object[];
  selectedPeople :Map<string, Map>;
  tags :OrderedSet<string>;
};

const SpinnerWrapper = styled.div`
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExpansionWrapper = styled.div`
  margin: 15px 0;
`;

export const FormWrapper = styled.div`
  align-items: center;
  background: #fff;
  border: solid 1px #e1e1eb;
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 30px 0;
  width: 100%;
`;

const DocumentUploadSection = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 16px;
  }

  article {
    display: flex;
    justify-content: center;
  }
`;

class DocumentsContainer extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = this.getInitialState();
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.loadUsedTags();
  }

  getInitialState = () => ({
    files: [],
    tags: OrderedSet(),
    selectedPeople: OrderedMap(),
  })

  onDateChange = (field :string, newDate :string) => {
    this.setState({ [field]: newDate });
  }

  onUpload = ({ file }) => {
    const { files } = this.state;
    this.setState({ files: [...files, file] });
  }

  renderUploadedFiles = () => {
    const { files } = this.state;
    return files.map((file, idx) => {
      const onDelete = () => {
        files.splice(idx, 1);
        this.setState({ files });
      };
      const fileKey = `${file.name}-${idx}`;
      return <UploadedDocument file={file} key={fileKey} onDelete={onDelete} />;
    });
  }

  onTagChange = (tags :OrderedSet) => {
    const values = tags ? tags.map(({ value }) => value) : [];
    this.setState({ tags: OrderedSet(values) });
  }

  renderPeopleSelect = () => {
    const { selectedPeople } = this.state;

    const onAdd = (entityKeyId, person) => {
      this.setState({ selectedPeople: selectedPeople.set(entityKeyId, person) });
    };

    const onRemove = (entityKeyId) => {
      this.setState({ selectedPeople: selectedPeople.delete(entityKeyId) });
    };

    return (
      <PeopleSelection selectedPeople={selectedPeople} onAdd={onAdd} onRemove={onRemove} />
    );
  }

  renderTagSelect = () => {
    const { tags } = this.props;

    const tagOptions = tags.map((tag) => ({
      label: tag,
      value: tag
    })).toJS();
    return (
      <Creatable
          options={tagOptions}
          onChange={this.onTagChange}
          isMulti />
    );
  }

  renderUploadDocumentsButton = () => {
    const { actions } = this.props;
    const { files, tags, selectedPeople } = this.state;

    const personEntityKeyIds = selectedPeople.keySeq();

    const onUpload = () => actions.uploadDocuments({
      files,
      tags,
      personEntityKeyIds,
      onSuccess: () => this.setState(this.getInitialState())
    });

    return (
      <DocumentUploadSection>
        <article>
          <Button color="primary" onClick={onUpload}>Upload documents</Button>
        </article>
      </DocumentUploadSection>
    );
  }

  renderExpandableContent = (title :string, content :Node) => {
    const expandIcon = <FontAwesomeIcon icon={faChevronDown} size="xs" />;
    return (
      <ExpansionWrapper>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={expandIcon}>
            <Label subtle>{title}</Label>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>{content}</ExpansionPanelDetails>
        </ExpansionPanel>
      </ExpansionWrapper>
    );
  }

  getLabelText = (label :string, collection :OrderedSet) => {
    if (!collection.size) {
      return `Add ${label}`;
    }

    return `Selected ${label} (${collection.size})`;
  }

  render() {
    const { isUploading } = this.props;
    const { files, tags, selectedPeople } = this.state;

    if (isUploading) {
      return (
        <SpinnerWrapper>
          <Spinner size="3x" />
        </SpinnerWrapper>
      );
    }

    const hasUploadedFiles = !!files.length;

    const tagText = this.getLabelText('tags', tags);
    const profileText = this.getLabelText('profiles', selectedPeople);

    return (
      <div>
        <Typography variant="h1" gutterBottom>Upload documents</Typography>
        <FileUpload onUpload={this.onUpload} />
        {this.renderUploadedFiles()}
        {hasUploadedFiles && this.renderExpandableContent(tagText, this.renderTagSelect())}
        {hasUploadedFiles && this.renderExpandableContent(profileText, this.renderPeopleSelect())}
        {hasUploadedFiles && this.renderUploadDocumentsButton()}
      </div>
    );
  }
}

const mapStateToProps = (state :Map) => ({
  isUploading: state.getIn(['documents', DOCUMENTS.IS_UPLOADING]),
  tags: state.getIn(['documents', DOCUMENTS.TAGS])
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    loadUsedTags,
    uploadDocuments,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(DocumentsContainer);
