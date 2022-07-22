import {isEnvBrowser} from "./misc";

interface DebugEvent<T = any> {
  action: string;
  data: T;
}

/**
 * Emulates dispatching an event using SendNuiMessage in the lua scripts.
 * This is used when developing in browser
 *
 * @param events - The event you want to cover
 * @param timer - How long until it should trigger (ms)
 */
export const debugData = <P>(events: DebugEvent<P>[], timer = 1000): void => {
  if (process.env.NODE_ENV === "development" && isEnvBrowser()) {
    for (const event of events) {
      setTimeout(() => {
        window.dispatchEvent(
          new MessageEvent("message", {
            data: {
              action: event.action,
              data: event.data,
            },
          })
        );
      }, timer);
    }
  }
};

export const DebugTabInterior = [
  {
    action: 'setIntData',
    data: {
      interiorId: 12345678910,
      roomCount: 10,
      portalCount: 15,
      rooms: [
        {
          roomId: 1,
          name: "room_name_01",
          flag: 96,
          timecycle: 'v_recycle',
          isCurrent: null
        },
        {
          roomId: 2,
          name: "room_name_02",
          flag: 92,
          timecycle: 'policestation',
          isCurrent: true
        },
      ],
      portals: [
        {
          flag: 8192,
          roomFrom: 1,
          roomTo: 2
        },
        {
          flag: 8192,
          roomFrom: 2,
          roomTo: 0
        }
      ],
      currentRoom: {
        currentRoomId: 5,
        currentRoomName: "Room name test",
        currentRoomFlag: 96,
        currentRoomTimecycle: "v_recycle"
      },
      currentRoomName: "Room name test"
    },
  }
]