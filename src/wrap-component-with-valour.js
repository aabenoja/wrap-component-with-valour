import React from 'react';
import valour from 'valour';
import noop from 'lodash.noop';

export default function wrapComponentWithValour(WrappedComponent) {
  return class ValidatedComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isValid: true };
      this.setValidationStateForValue = this.setValidationStateForValue.bind(this);
    }

    static propTypes = {
      formName: React.PropTypes.string.isRequired,
      valueName: React.PropTypes.string.isRequired,
      value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
        React.PropTypes.bool
      ]),
      rules: React.PropTypes.object.isRequired,
      onValidationStateChanged: React.PropTypes.func,
      shouldRenderValidationState: React.PropTypes.bool
    }

    static defaultProps = {
      onValidationStateChanged: noop,
      shouldRenderValidationState: true
    }

    componentWillMount() {
      valour.update(this.props.formName, this.props.rules);
    }

    componentDidMount() {
      this.setValidationStateForValue(this.props.valueName,
                                      this.props.value);
    }

    componentWillUnmount() {
      valour.disposeForm(this.props.formName);
    }

    setValidationStateForValue(valueName, value) {
      const {
        formName,
        onValidationStateChanged
      } = this.props;

      valour.runValidationSync(formName, {
        [`${valueName}`]: value
      });

      const validationResult = valour.getResult(formName)[valueName];
      const isValid = validationResult.valid !== undefined ? validationResult.valid : false;
      const message = validationResult.messages !== undefined ? validationResult.messages[0] : null;
      const newState = { isValid, message };
      this.setState(newState, () => onValidationStateChanged(valueName, value, isValid, message));
    }

    render() {
      const { formName, valueName } = this.props;
      const { isValid } = this.state;
      const identifier = `${formName}-${valueName}`;
      return (
        <WrappedComponent
          {...this.props}
          identifier={identifier}
          isValid={isValid}
          shouldRenderAsInvalid={this.props.shouldRenderValidationState}
          onValueUpdated={this.setValidationStateForValue}
        />
      );
    }
  };
}