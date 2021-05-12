import * as LobbyTypes from "../types/lobby-types";

export const action_lobby_set_loading = (
    isLoading: boolean
): LobbyTypes.LobbySetLoadingActionType => ({
    type: LobbyTypes.ACTION_TYPE_LOBBY_SET_LOADING,
    payload: isLoading
});

export const action_lobby_set_servers = (
    servers: LobbyTypes.LobbyServerType[]
): LobbyTypes.LobbySetServersActionType => ({
    type: LobbyTypes.ACTION_TYPE_LOBBY_SET_SERVERS,
    payload: servers
});
