import * as Shared from "./../idnex";

const { PlayerColors, EntityNumbers } = Shared.Enums;

/**
 * Определяет в какой ячейке на карте находится игрок.
 * 
 * @param player - игрок
 * @returns [ряд ячейки, колонка ячейки]
 */
export const calculatePlayerCellPosition = (
    player: Shared.Interfaces.IGameStatePlayer
): [number, number] => {
    const { GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

    return [
        Math.floor((player.y + (GAME_RESOLUTION_TILE_SIZE / 2)) / GAME_RESOLUTION_TILE_SIZE),
        Math.floor((player.x + (GAME_RESOLUTION_TILE_SIZE / 2)) / GAME_RESOLUTION_TILE_SIZE)
    ];
};

/**
 * Высчитывает количество пикселей, на которые
 * спрайт игрока пересёк ячейку на карте.
 * 
 * @param playerPoint - позиция игрока (верхний левый край) по X или Y
 * @param cellPoint - позиция ячейки (верхний левый край) на карте по X или Y
 * @returns количество пикселей
 */
export const calculateOverlapDistance = (playerPoint: number, cellPoint: number): number => {
    return Math.abs(playerPoint - cellPoint);
};

/**
 * Перемножет количество тайлов в ширину
 * на размер тайла в пикселях.
 * 
 * @returns ширина канваса в пикселях
 */
export const calculateCanvasWidth = (): number => {
    return Shared.Constants.GAME_RESOLUTION_TILE_LENGTH_X * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
};

/**
 * Перемножет количество тайлов в высоту
 * на размер тайла в пикселях.
 * 
 * @returns высота канваса в пикселях
 */
export const calculateCanvasHeight = (): number => {
    return Shared.Constants.GAME_RESOLUTION_TILE_LENGTH_Y * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
};

/**
 * Делаем копию объекта, включая все вложенные объекты.
 * 
 * @param object - объект, который нужно скопировать
 * @returns копия объекта
 */
export const makeCopyObject = <T>(object: T): T => {
    return JSON.parse(JSON.stringify(object));
};

/**
 * Получает индентификатор бомбы по цвету игрока.
 * 
 * @param color - цвет игрока
 * @returns индентификатор игровй сущности бомбы
 */
export const getBombIdByPlayerColor = (color: number): Shared.Enums.EntityNumbers => {
    switch (color) {
        case PlayerColors.BLUE:
            return EntityNumbers.BOMB_BLUE;
        case PlayerColors.PURPLE:
            return EntityNumbers.BOMB_PURPLE;
        case PlayerColors.RED:
            return EntityNumbers.BOMB_RED;
        case PlayerColors.YELLOW:
            return EntityNumbers.BOMB_YELLOW;
    }
};

/**
 * Получает список идентификаторов бомб всех цветов.
 * 
 * @returns массив всех идентификаторов бомб
 */
export const getAllBombsIds = (): Shared.Enums.EntityNumbers[] => {
    return [
        EntityNumbers.BOMB_YELLOW,
        EntityNumbers.BOMB_RED,
        EntityNumbers.BOMB_PURPLE,
        EntityNumbers.BOMB_BLUE
    ];
};

/**
 * Получает список игровых сущностей на карте в определенной ячейке.
 * 
 * @param map - игровая карта
 * @param row - ряд ячейки
 * @param col - колонка ячейки
 * @returns идентификаторы игровых сущностей
 */
export const getAllEntitiesInCell = (map: number[][][], row: number, col: number): number[] => {
    return [ ...map[row][col] ];
};
