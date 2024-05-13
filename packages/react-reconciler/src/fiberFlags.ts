export type Flags = number;

export const NoFlags = 0b0000001;
export const Placement = 0b0000010;
export const Update = 0b0000100;
export const ChildDeletion = 0b0001000;

export const MutationMask = Placement | Update | ChildDeletion;

export const PassiveMask = 0b0010000;

export const HostComponent = 0b0000000;
export const HostText = 0b0000001;
export const HostRoot = 0b0000010;
export const HostPortal = 0b0000100;

export const Incomplete = 0b0001000;

export const Alone = 0b0010000;

export const Deletion = 0b0100000;

export const ContextProvider = 0b1000000;
export const ContextConsumer = 0b1100000;

export const Passive = 0b0000001;

export const ConcurrentMode = 0b10000000;

export const ProfileMode = 0b0000010;

export const StrictMode = 0b0000100;

export const SuspenseComponent = 0b0001000;

export const SuspenseListComponent = 0b0010000;

export const OffscreenComponent = 0b0100000;

export const LegacyHidden = 0b10000000;

export const EventComponent = 0b0000001;

export const EventPriority = 0b0000010;

export const Hydrating = 0b0000100;

export const BackendRoot = 0b0001000;

export const RootWithPendingPassiveEffects = 0b0010000;

export const BeforeMutationMask = Placement | Update | ChildDeletion;
