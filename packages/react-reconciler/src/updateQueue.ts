import {Action} from 'shared/ReactTypes';

export interface Update<State> {
  action: Action<State>;
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null,
  };
}

// 初始化更新队列
export const initializeUpdateQueue = <State>() => {
  return {
    shared: {
      pending: [],
    },
  };
};

// export const UpdateQueue = [];

export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action,
  };
};

export const createUpdateQueue = <State>() => {
  return {
    shared: {
      pending: null,
    },
  } as UpdateQueue<State>;
};

export const enqueueUpdate = <State>(
  updateQueue: UpdateQueue<State>,
  update: Update<State>
) => {
  updateQueue.shared.pending = update;
};

export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null
): {memoizedState: State} => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
  };
  if (pendingUpdate !== null) {
    const action = pendingUpdate.action;
    if (action instanceof Function) {
      result.memoizedState = action(baseState);
    } else {
      result.memoizedState = action;
    }
    // 执行完更新队列中的更新，清空
    // updateQueue.shared.pending = null;
  }

  return result;
};
