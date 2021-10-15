// @flow
import React, { useReducer } from 'react';

import MonacoEditor from 'react-monaco-editor';
import { Card, CardHeader, Typography } from 'lattice-ui-kit';

const VALID = 'valid';
const INVALID = 'invalid';

const jsonEditorReducer = (state, action) => {
  switch (action.type) {
    case VALID: {
      return {
        ownValid: true,
        ownCode: action.value
      };
    }
    case INVALID: {
      return {
        ownValid: false,
        ownCode: action.value
      };
    }
    default:
      return state;
  }
};

const monacoEditorOptions = {
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
};

type Props = {
  code :string;
  valid :boolean;
  label :string;
  onChange :(parsedCode :Object) => void;
  onError :(valid :boolean) => void;
};
const JSONEditor = ({
  code,
  valid,
  label,
  onChange,
  onError,
} :Props) => {

  const [state, setState] = useReducer(jsonEditorReducer, {
    ownCode: code,
    ownValid: valid,
  });

  const onCodeChange = (newCode) => {
    try {
      const parsedCode = JSON.parse(newCode);
      setState({ type: VALID, value: newCode });
      onChange(parsedCode);
    }
    catch (error) {
      setState({ type: INVALID, value: newCode });
      onError(true);
    }
  };

  return (
    <Card>
      <CardHeader mode={state.ownValid ? 'default' : 'danger'} padding="sm">
        <Typography variant="subtitle2">{label}</Typography>
      </CardHeader>
      <MonacoEditor
          height={400}
          language="json"
          onChange={onCodeChange}
          options={monacoEditorOptions}
          value={state.ownCode} />
    </Card>
  );
};

JSONEditor.defaultProps = {
  code: '',
  label: '',
  onChange: () => {},
  onError: () => {},
  valid: true,
};

export default JSONEditor;
