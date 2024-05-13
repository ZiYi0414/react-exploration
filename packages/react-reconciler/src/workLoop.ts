import {beginWork} from './beginWork';
import {completeWork} from './completeWork';
import {FiberNode, FiberRootNode, createWorkInProgress} from './fiber';
import {HostRoot} from './workTags';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
  // 重置
  workInProgress = createWorkInProgress(root.current, {});
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;
  do {
    completeWork(node);
    // 检测兄弟节点是否存在
    const sibling = node.sibling;
    if (sibling !== null) {
      workInProgress = sibling;
      return;
    } else {
      // 不存在 往上
      node = node.return;
      workInProgress = node;
    }
  } while (node !== null);
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // 调度

  const root = markUpdateFromFiberToRoot(fiber);
  renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  if (node.type === HostRoot) {
    return node.stateNode;
  }
  return null;
}

function renderRoot(root: FiberNode) {
  prepareFreshStack(root);

  // 开始执行
  do {
    try {
      workLoop();
      break;
    } catch (e) {
      // 错误处理
      workInProgress = null;
      if (__DEV__) {
        console.warn('workLoop error', e);
      }
    }
  } while (true);
  // 开始调度
  // schedule();
}
