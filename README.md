# Wrap Component With Valour

``wrapComponentWithValour`` is a function that takes a React component and returns a component with added
 client side validation using the [valour](https://github.com/stevematney/valour) library.


## Props

Passing a component definition to ``wrapComponentWithValour`` will provide additional props to the newly defined component function:

* ``formName`` * _required_

  The name of the form that is registered with valour. If the ``formName`` already exists, the rules and ``valueName`` will be added to the
  current form definition within valour.

* ``valueName`` * _required_

  The name of the value being registered within the valour form

* ``rules`` * _required_

  An object that defines the rules for a given value within a form.

* ``shouldRenderValidationState`` - **Defaults to _true_**

  Should the component render validation state. This is useful for allowing parent components to control validation
  for each of it's child components.

* ``onValidationStateChanged`` - **Defaults to _noop_**

  A function that will get run after validation has been run. It takes three parameters: ``valueName``, ``value``, and ``isValid``.

## Usage

### SimpleText.js

 ````javascript
import React from 'react';
import wrapComponentWithValour from 'wrap-component-with-valour';

function SimpleText({
  isValid = true,
  shouldRenderAsInvalid = true,
  valueName,
  value,
  labelText,
  onValueUpdated
}) {
  function handleTextChanged(event) {
    const newText = event.target.value;
    onValueUpdated(valueName, newText);
  }

  const labelClass = !isValid && shouldRenderAsInvalid ? 'error' : '';
  return (
    <label className={labelClass}>
      {labelText}
      <input
        type="text"
        onChange={handleTextChanged}
        defaultValue={value}
        name={valueName}
      />
    </label>
  );
}

export const ValidatedText = wrapComponentWithValour(SimpleText);
````

### MyApp.js

````javascript
import React from 'react';
import valour from 'valour';
import { ValidatedSimpleText } from './SimpleText';

function MyApp() {
  const rules = {
    firstName: valour.rules.isRequired().validatedBy(x => x.length > 3)
  };

  function handleValidationStateChange(valueName, value, isValid) {
    console.log(`${value} is a valid value for ${valueName}? ${isValid}`);
  }

  return (
    <ValidatedText
      formName="MyForm"
      valueName="firstName"
      rules={rules}
      labelText="First Name"
      onValidationStateChanged={handleValidationStateChange}
    />
  );
}
````

