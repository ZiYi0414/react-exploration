export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = {
  children?: IReactElement,
  [key: string]: any,
};
export type ElementType = any;

export interface IReactElement {
  $$typeof: symbol | number;
  type: ElementType;
  key: Key;
  ref: Ref;
  props: Props;
  __mark: 'react-element';
}

// 定义React.Component的类型
export type ReactComponent = {
  render(): IReactElement,
};

// 定义React.createElement的类型

export type Action<State> = State | ((prevState: State) => State);
