import { Comment } from "@/components/comment";

export interface State {
  recipient: Comment | null;
  comments: Comment[];
}

export interface Action {
  type: string;
  preload?: any;
}

export interface Reducer {
  (state: State, action: Action): State;
}

export const InitialState: State = {
  recipient: null,
  comments: []
};

export const Reducer: Reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "reply":
      return Object.assign({}, state, {
        recipient: action.preload
      });
    case "clearReplt":
      return Object.assign({}, state, {
        recipient: false
      });
    case "getComments":
      return Object.assign({}, state, {
        comments: [...state.comments, ...action.preload]
      });
    case "updateComments":
      return Object.assign({}, state);
    case "addRootComment":
      return Object.assign({}, state, {
        comments: [action.preload, ...state.comments]
      });
    default:
      return state;
  }
};
