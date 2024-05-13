// 递归 递

import {IReactElement} from 'shared/ReactTypes';
import {FiberNode} from './fiber';
import {UpdateQueue, processUpdateQueue} from './updateQueue';
import {HostComponent, HostRoot, HostText} from './workTags';
import {mountChildFibers, reconcileChildFibers} from './childFiber';

export const beginWork = (workInProgress: FiberNode): FiberNode => {
  // 比较 返回 子 fiberNode
  // 父 fiberNode
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(workInProgress);
    case HostComponent:
      return updateHostComponent(workInProgress);
    case HostText:
      return;
    default:
      if (__DEV__) {
        console.warn('未实现的 beginWork 类型');
      }
      break;
  }

  return;
};

function updateHostRoot(workInProgress: FiberNode) {
  const baseState = workInProgress.memoizedState;
  const updateQueue = workInProgress.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;

  const {memoizedState} = processUpdateQueue(baseState, pending);

  workInProgress.memoizedState = memoizedState;

  const newChildren = workInProgress.memoizedState;

  reconcileChildren(workInProgress, newChildren);
  return workInProgress.child;
}

function updateHostComponent(workInProgress: FiberNode) {
  const nextProps = workInProgress.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(workInProgress, nextChildren);
  return workInProgress.child;
}

function reconcileChildren(
  workInProgress: FiberNode,
  children?: IReactElement
) {
  const current = workInProgress.alternate;
  if (current !== null) {
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current?.child,
      children
    );
  } else {
    workInProgress.child = mountChildFibers(workInProgress, null, children);
  }
}
