// reactElement

import {REACT_ELEMENT_TYPE} from 'shared/ReactSymbols';
import type {
  Type,
  Props,
  IReactElement,
  Key,
  Ref,
  ElementType,
} from 'shared/ReactTypes';

const ReactElement = function (
  type: Type,
  props: Props,
  key: Key,
  ref: Ref
): IReactElement {
  const element: IReactElement = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: 'react-element',
  };

  return element;
};

export const jsx = function (
  type: ElementType,
  config: any,
  ...maybeChildren: any[]
) {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};

  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    // if (prop === null) {
    //   continue;
    // }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }

    const maybeChildrenLength = maybeChildren.length;
    // [children]  [children, children]
    if (maybeChildrenLength) {
      props.children = maybeChildren[0];
    } else {
      //@ts-ignore
      props.children = maybeChildren;
    }

    return ReactElement(type, props, key, ref);
  }
};

export const jsxDev = function (type: ElementType, config: any) {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};

  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    // if (prop === null) {
    //   continue;
    // }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
    return ReactElement(type, props, key, ref);
  }
};
