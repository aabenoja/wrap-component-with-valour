import React from 'react';
import valour from 'valour';
import noop from 'lodash.noop';
import isEqual from 'lodash.isequal';
import first from 'lodash.first';

export default function wrapComponentWithValour(WrappedComponent) {
  return class ValidatedComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isValid: true };
      this.setValidationStateForValue = this.setValidationStateForValue.bind(this);
      this.setValidationResult = this.setValidationResult.bind(this);
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
      shouldRenderValidationState: React.PropTypes.bool,
      forceRevalidation: React.PropTypes.bool
    }

    static defaultProps = {
      onValidationStateChanged: noop,
      shouldRenderValidationState: true,
      forceRevalidation: false
    }

    componentWillMount() {
      valour.update(this.props.formName, this.props.rules);
    }

    componentDidMount() {
      this.setValidationStateForValue(this.props.valueName,
                                      this.props.value);

      valour.onUpdated(this.props.formName, results => {
        const { value } = this.state;
        const { valueName } = this.props;
        const result = results[valueName];

        this.setValidationResult(result, value);
      });
    }

    componentWillUnmount() {
      valour.disposeForm(this.props.formName);
    }

    setValidationResult(result, value) {
      const { valueName, onValidationStateChanged, forceRevalidation } = this.props;
      const { previousValidationResult, value: oldValue } = this.state;

      if (isEqual(previousValidationResult, result) && value === oldValue && !forceRevalidation) {
        return;
      }

      const isValid = result.isValid || false;
      const message = first(result.messages) || null;
      const nextState = { isValid, message, value, previousValidationResult: result };
      this.setState(nextState, () => onValidationStateChanged(valueName, value, isValid, message));
    }

    setValidationStateForValue(valueName, value) {
      const { formName, } = this.props;

      valour.runValidationSync(formName, {
        [valueName]: value
      });

      const validationResult = valour.getResult(formName)[valueName];
      this.setValidationResult(validationResult, value);
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