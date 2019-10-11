/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';

import InfoButton from '../../components/buttons/InfoButton';
import DateTimeRange from '../../components/controls/DateTimeRange';
import * as DownloadsActionFactory from './DownloadsActionFactory';

type Props = {
  downloading :boolean,
  actions :{
    downloadForms :Function
  }
};

type State = {
  startDate :?string,
  endDate :?string
};

export const DownloadsWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 30px 0;
  width: 100%;
  background: #fff;
  align-items: center;
  width: 100%;
  border: solid 1px #e1e1eb;
`;

const InfoDownloadButton = styled(InfoButton)`
  margin: 0 6px;
  padding: 10px 46px;
`;

const ButtonRow = styled.div`
  margin-top: 30px;
  text-align: center;
`;

class DownloadsContainer extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: ''
    };
  }

  download = () => {
    const { actions } = this.props;
    const { endDate, startDate } = this.state;

    actions.downloadForms({ endDate, startDate });
  }

  onDateChange = (field, newDate) => {
    const formattedDate = newDate.endsWith('T')
      ? moment(newDate.slice(0, newDate.length - 1)).toISOString(true)
      : newDate;
    this.setState({ [field]: formattedDate });
  }

  render() {
    const { downloading } = this.props;
    const { endDate, startDate } = this.state;

    return (
      <DownloadsWrapper>
        <FormWrapper>
          <DateTimeRange
              label="BHR Downloads"
              startDate={startDate}
              endDate={endDate}
              onStartChange={(date) => this.onDateChange('startDate', date)}
              onEndChange={(date) => this.onDateChange('endDate', date)} />
          <ButtonRow>
            <InfoDownloadButton onClick={this.download} disabled={downloading || !startDate || !endDate}>
              Download BHR Reports
            </InfoDownloadButton>
          </ButtonRow>
        </FormWrapper>
      </DownloadsWrapper>
    );
  }
}

function mapStateToProps(state :Map) :Object {

  return {
    downloading: state.getIn(['downloads', 'downloading'])
  };
}

function mapDispatchToProps(dispatch :Function) :Object {
  const actions :{ [string] :Function } = {};

  Object.keys(DownloadsActionFactory).forEach((action :string) => {
    actions[action] = DownloadsActionFactory[action];
  });

  return {
    actions: {
      ...bindActionCreators(actions, dispatch)
    }
  };
}

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(DownloadsContainer);
