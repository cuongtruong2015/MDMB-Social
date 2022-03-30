import { listRelationShipActionTypes } from 'app/actions/types/listRelationshipTypes';

const initialState = {
    isFetching: false,
    error: false,
    success: false,
    message: null,
    listRelastionship: []
};
const listRelationshipReducer = (state = initialState, action) => {
    switch (action.type) {
        case listRelationShipActionTypes.GET_LIST_RELATIONSHIP_START:
            return {
                ...state,
                isFetching: true,
                error: false,
                success: false,
                message: null,
            };
        case listRelationShipActionTypes.GET_LIST_RELATIONSHIP_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: null,
                listRelastionship: action.payload,
            };
        case listRelationShipActionTypes.GET_LIST_RELATIONSHIP_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                success: false,
                message: action.payload.message,
            };
        default:
            return state;
    }
};

export default listRelationshipReducer;
