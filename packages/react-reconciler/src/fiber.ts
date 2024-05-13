import type {Props, Key, Type, Ref, IReactElement} from 'shared/ReactTypes';
import {FunctionComponent, HostComponent, WorkTag} from './workTags';
import {Flags, NoFlags} from './fiberFlags';
import {Container} from 'hostConfig';

export class FiberNode {
  // 作为静态属性
  static type: string = 'FiberNode';
  // 作为实例属性
  // props：Props //组件的属性。
  stateNode: unknown; //对于类组件，这是组件实例。对于原生 DOM 元素，这是实际的 DOM 节点。
  tag: WorkTag;
  key: Key; //组件的唯一标识符，用于在组件树中区分兄弟节点。
  pendingProps: Props;
  type: Type; //组件的类型，可以是函数组件、类组件或原生 DOM 元素。
  ref: Ref;

  return: FiberNode | null; //指向父 Fiber 节点的指针。
  sibling: FiberNode | null; //指向兄弟 Fiber 节点的指针。
  child: FiberNode | null; //指向第一个子 Fiber 节点的指针。
  index: number;

  memoizedProps: Props | null;
  memoizedState: unknown;

  // Effect
  flags: Flags; //描述 Fiber 节点需要执行的副作用类型（如插入、更新或删除）。

  alternate: FiberNode | null; //指向当前 Fiber 节点的替代 Fiber 节点，这是双缓存技术的关键部分。

  updateQueue: unknown; //用于存储更新队列的指针。

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.tag = tag;
    this.key = key;
    this.stateNode = null;
    this.type = null;

    // fiber 树结构
    this.return = null;
    this.sibling = null;
    this.child = null;
    // ul -> li
    this.index = 0;

    this.ref = null;

    //工作单元
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.memoizedState = null;
    this.updateQueue = null;

    //Effect
    this.flags = NoFlags;
    // this.subtreeFlags = NoFlags;
    // this.deletions = null;

    this.alternate = null;
  }
}

// exp：
// const fiberNode = {
//   type: App, // 函数组
//   key: null, // 没有 key
//   props: {}, // 没有传入任何属性
//   stateNode: null, // 函数组件没有实例
//   return: null, // 根 Fiber 节点没有父节点
//   child: {/* 指向第一个子节点的指针 */},
//   sibling: null, // 没有兄弟节点
//   flags: /* ... */, // 描述需要执行的副作用类型
//   alternate: null // 没有替代节点
// };

export class FiberRootNode {
  current: FiberNode;
  containerInfo: Container;
  // pendingChildren: FiberNode[] | null;
  // pingedLanes: Set<Lane>;
  // finishedLane: Lane;
  finishedWork: FiberNode | null;
  constructor(containerInfo: Container, hostRootFiber: FiberNode) {
    this.containerInfo = containerInfo;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
  }
}

export const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props
): FiberNode => {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = new FiberNode(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    //update
    workInProgress.pendingProps = pendingProps;
    workInProgress.flags = NoFlags;
  }
  workInProgress.type = current.type;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  // 复用 current 节点中的 stateNode 和 alternate 节点中的 stateNode
  return workInProgress;
};

export const createFiberFromElement = (element: IReactElement): FiberNode => {
  const {type, key, props} = element;
  let fiberTag: WorkTag = FunctionComponent;
  if (typeof type === 'string') {
    fiberTag = HostComponent;
  } else if (typeof type !== 'function' && __DEV__) {
    console.warn('未定义的type', element);
  }

  const fiber = new FiberNode(fiberTag, props, key);
  fiber.type = type;
  return fiber;
};
