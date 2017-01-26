import React, { Component } from 'react';
import valour from 'valour';

import './App.css';
import { ValidatedText } from './SimpleText';

class App extends Component {
  render() {
    const rules = {
      firstName: valour.rule.isRequired().isValidatedBy(x => x.length >= 3)
    };

    function handleValidationStateChange(valueName, value, isValid) {
      console.log(`${value} is a valid value for ${valueName}? ${isValid}`);
    }

    return (
      <div className="App">
        <p>Try entering a name with at least 3 characters.</p>
        <ValidatedText
          formName="MyForm"
          valueName="firstName"
          rules={rules}
          labelText="First Name"
          onValidationStateChanged={handleValidationStateChange}
        />

        <p>Check the console to see the validation state changes over time.</p>
      </div>
    );
  }
}

export default App;
