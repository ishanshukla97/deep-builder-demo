const UPDATE_LINK_LABELS = "UPDATE_LINK_LABELS";

export const ACTION_TYPES = {
    UPDATE_LINK_LABELS
}

export interface IModelBuilderState {
    nodes: {
        id: string;
        outLinkLabel: string; 
    }[];
    isLoading: {
        label?: string;
    }
}

export const modelBuilderReducer = (state: any, action: any) => {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_LINK_LABELS:
            return { ...state };
    }
} 