import {IReactElement} from 'shared/ReactTypes';
import {FiberNode, createFiberFromElement} from './fiber';
import {REACT_ELEMENT_TYPE} from 'shared/ReactSymbols';
import {HostText} from './workTags';
import {Placement} from './fiberFlags';

function ChildReconciler(shouldTrackEffects: boolean) {
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: IReactElement
  ) {
    const fiber = createFiberFromElement(element);
    fiber.return = returnFiber;
    return fiber;
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    text: string | number
  ) {
    const fiber = new FiberNode(HostText, {content: text}, null);
    fiber.return = returnFiber;
    return fiber;
  }

  function placeSingeChild(newFiber: FiberNode) {
    // 单节点
    if (shouldTrackEffects && newFiber.alternate === null) {
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  return function reconcileChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: IReactElement
  ) {
    // 判断fiber 类型
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingeChild(
            reconcileSingleElement(returnFiber, currentFiber, newChild)
          );
        default:
          if (__DEV__) {
            console.warn('未实现的类型', newChild);
          }
          break;
      }
    }
    //多节点

    //文本节点 hosttext
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingeChild(
        reconcileSingleTextNode(returnFiber, currentFiber, '' + newChild)
      );
    }
    if (__DEV__) {
      console.warn('未实现的类型', newChild);
    }
    return null;
  };
}

export const reconcileChildFibers = ChildReconciler(true);

export const mountChildFibers = ChildReconciler(false);
