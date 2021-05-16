import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import * as Shared from "@bombers/shared/src/idnex";
import { UserModel } from "../api/models";

/**
 * Обрабатывает сообщения игрового сервера по веб-сокету.
 */
export default class GameServerSocketHandler {
    public static handle(socket: Socket, manager: SocketManager) {
        // аутентифицируем пользователя с игрового сервера
        socket.on(
            String(Shared.Enums.SocketChannels.APP_ON_GAME_AUTH),
            ({ token, socketId }) => {
                UserModel.findOne({ _id: token })
                    .then(user => {
                        let responseData: Shared.Interfaces.IRoomAuthResponseData = { socketId };
                       
                        // если пользователь найден в базе
                        if (user) {
                            responseData.success = true;
                            responseData.token = token;
                            responseData.userData = manager.parseUserData(user);
                        }

                        // отправляем данные обратно на игровой сервер
                        socket.emit(
                            String(Shared.Enums.SocketChannels.APP_ON_GAME_AUTH),
                            responseData
                        );
                    });
            }
        )
    }
}