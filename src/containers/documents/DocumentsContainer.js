/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { Map, OrderedSet } from 'immutable';
import { Button, Creatable } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';

import PeopleSelection from './PeopleSelection';
import FileUpload from '../../components/documents/FileUpload';
import UploadedDocument from '../../components/documents/UploadedDocument';
import { uploadDocuments, loadUsedTags } from './DocumentsActionFactory';
import { DOCUMENTS } from '../../utils/constants/StateConstants';

type Props = {
  downloading :boolean,
  actions :{
    loadUsedTags :Function;
    uploadDocuments :Function;
  }
};

type State = {
  tags :Set<string>,
  files :Object[],
  selectedPeople: Set<string>
};

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
      selectedPeople: OrderedSet(),
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
    const values = tags.map(({ value }) => value);
    this.setState({ tags: OrderedSet(values) });
  }

  renderPeopleSelect = () => {
    const { selectedPeople } = this.state;

    const label = selectedPeople.size
      ? `Selected profiles (${selectedPeople.size})` : 'Select profiles';

    const onAdd = (person) => {
      this.setState({ selectedPeople: selectedPeople.add(person) });
    };

    const onRemove = (person) => {
      this.setState({ selectedPeople: selectedPeople.delete(person) });
    };

    return (
      <DocumentUploadSection>
        <h1>{label}</h1>
        <PeopleSelection selectedPeople={selectedPeople} onAdd={onAdd} onRemove={onRemove} />
      </DocumentUploadSection>
    );
  }

  renderTagSelect = () => {
    const { tags } = this.props;
    const { tags: selectedTags } = this.state;

    const label = selectedTags.size ? `Selected tags (${selectedTags.size})` : 'Select tags';

    const tagOptions = tags.map((tag) => ({
      label: tag,
      value: tag
    })).toJS();
    return (
      <DocumentUploadSection>
        <h1>{label}</h1>
        <article>
          <Creatable
              options={tagOptions}
              onChange={this.onTagChange}
              isMulti />
        </article>
      </DocumentUploadSection>
    );
  }

  renderUploadDocumentsButton = () => {
    const { actions } = this.props;
    const { files } = this.state;

    const onUpload = () => actions.uploadDocuments({ files });

    return (
      <DocumentUploadSection>
        <article>
          <Button color="primary" onClick={onUpload}>Upload documents</Button>
        </article>
      </DocumentUploadSection>
    );
  }

  render() {
    const { files } = this.state;
    const hasUploadedFiles = !!files.length;

    return (
      <div>
        <h1>Upload documents</h1>
        <FileUpload onUpload={this.onUpload} />
        {this.renderUploadedFiles()}
        {hasUploadedFiles && this.renderTagSelect()}
        {hasUploadedFiles && this.renderPeopleSelect()}
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
