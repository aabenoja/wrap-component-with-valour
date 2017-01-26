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
      <span className="label-text">{labelText}</span>
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