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
  app :Map<*, *>,
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

  constructor(props) {
    super(props);
    this.state = {
      startDate: '',
      endDate: ''
    };
  }

  download = () => {
    const { app, actions } = this.props;
    const { startDate, endDate } = this.state;

    actions.downloadForms({ app, startDate, endDate });
  }

  onDateChange = (field, newDate) => {
    const formattedDate = newDate.endsWith('T')
      ? moment(newDate.slice(0, newDate.length - 1)).toISOString(true)
      : newDate;
    this.setState({ [field]: formattedDate });
  }

  render() {
    const { downloading } = this.props;
    const { startDate, endDate } = this.state;

    return (
      <DownloadsWrapper>
        <FormWrapper>
          <DateTimeRange
              label="BHR Downloads"
              startDate={startDate}
              endDate={endDate}
              onStartChange={date => this.onDateChange('startDate', date)}
              onEndChange={date => this.onDateChange('endDate', date)} />
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

function mapStateToProps(state :Immutable.Map<*, *>) :Object {

  return {
    app: state.get('app', Map()),
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

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsContainer);
