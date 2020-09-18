/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { Map, OrderedMap, OrderedSet } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  Creatable,
  Label,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from 'lattice-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import type { Dispatch } from 'redux';

import PeopleSelection from './PeopleSelection';
import FileUpload from '../../components/documents/FileUpload';
import UploadedDocument from '../../components/documents/UploadedDocument';
import { uploadDocuments, loadUsedTags } from './DocumentsActionFactory';
import { DOCUMENTS } from '../../utils/constants/StateConstants';

type Props = {
  tags :Set<string>;
  actions :{
    loadUsedTags :Function;
    uploadDocuments :Function;
  };
};

type State = {
  tags :Set<string>;
  files :Object[];
  selectedPeople: Map<string, Map>;
};

const ExpansionWrapper = styled.div`
  margin: 15px 0;
`;

export const DownloadsWrapper = styled.div`
  display: flex;
  width: 100%;
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
    flex-direction: row;
    justify-content: center;
  }
`;

class DocumentsContainer extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      files: [],
      tags: OrderedSet(),
      selectedPeople: OrderedMap(),
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.loadUsedTags();
  }

  onDateChange = (field :string, newDate :string) => {
    this.setState({ [field]: newDate });
  }

  onUpload = ({ file }) => {
    const { files } = this.state;
    files.push(file);
    this.setState({ files });
  }

  renderUploadedFiles = () => {
    const { files } = this.state;
    return files.map((file, idx) => {
      const onDelete = () => {
        files.splice(idx, 1);
        this.setState({ files });
      };
      return <UploadedDocument file={file} key={idx} onDelete={onDelete} />;
    });
  }

  onTagChange = (tags) => {
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

    const onUpload = () => actions.uploadDocuments({ files, tags, personEntityKeyIds });

    return (
      <DocumentUploadSection>
        <article>
          <Button color="primary" onClick={onUpload}>Upload documents</Button>
        </article>
      </DocumentUploadSection>
    );
  }

  renderExpandableContent = (title, content) => {
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

  getLabelText = (label, collection) => {
    if (!collection.size) {
      return `Add ${label}`;
    }

    return `Selected ${label} (${collection.size})`;
  }

  render() {
    const { files, tags, selectedPeople } = this.state;
    const hasUploadedFiles = !!files.length;

    const tagText = this.getLabelText('tags', tags);
    const profileText = this.getLabelText('profiles', selectedPeople);

    return (
      <div>
        <h1>Upload documents</h1>
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
  downloading: state.getIn(['downloads', 'downloading']),
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
