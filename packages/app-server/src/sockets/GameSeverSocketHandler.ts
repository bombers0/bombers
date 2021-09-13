import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import * as Shared from "@bombers/shared/src/idnex";
import { UserModel } from "../api/models";
import { debug } from "@bombers/shared/src/tools/debugger"; 

/**
 * Обрабатывает сообщения игрового сервера по веб-сокету.
 */
export default class GameServerSocketHandler {
    public static handle(
        socket: Socket, 
        manager: SocketManager, 
        server: string
    ) {
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
                            
                            manager.setUserToRoomConnection(token, server);
                        }

                        // отправляем данные обратно на игровой сервер
                        socket.emit(
                            String(Shared.Enums.SocketChannels.APP_ON_GAME_AUTH),
                            responseData
                        );
                    });
            }
        )

        // удаяем пользователя из комнаты на центральном сервере
        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_LEAVVE_ROOM),
            (token: string) => manager.removeUserFromRoomConnection(token) 
        );

        // заканчиваем игру
        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_END),
            async (
                battleResult: { [place: number]: string; }
            ): Promise<void> => {
                const result: any = [];
                
                for (let place in battleResult) {
                    const token = battleResult[place];
                    
                    // удаляем пользователя из списка подключенных
                    manager.removeUserFromRoomConnection(token);

                    try {
                        const user = await UserModel.findOne({ _id: token });
                        if (user) {
                            const points = place === "1" ? + 10 : -10;

                            // обновляем рейтинг в документе
                            user.rating += points;                           
                           
                            result.push({
                                rating: user.rating,
                                nickname: user.nickname,
                                points 
                            });
                            
                            // сохраняем изменения в документе
                            user.save();
                        }
                    } catch (error) {
                        debug("Error occured while trying update battle data", error);
                    }
                }
                
                // отправляем обновлённые данные обнатно на игровой сервер
                socket.emit(
                    String(Shared.Enums.SocketChannels.GAME_ON_END),
                    result
                );
            }
        );
    }
}
