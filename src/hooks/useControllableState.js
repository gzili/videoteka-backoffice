import { useState } from 'react';

export function useControllableState(props) {
  const {
    value,
    onChange,
    defaultValue,
  } = props;

  const [stateValue, setStateValue] = useState(defaultValue);

  const resolvedValue = value !== undefined ? value : stateValue;
  const setResolvedValue = typeof onChange === 'function' ? onChange : setStateValue;

  return [resolvedValue, setResolvedValue];
}