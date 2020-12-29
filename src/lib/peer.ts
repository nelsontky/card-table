import Peer from "peerjs";

import store from "../store";
import { add, remove, update, flip, rotate } from "../slices/gameSlice";
import { transformCoords } from "./utils";

let peer: Peer;
let conn: Peer.DataConnection;

export function getPeer(id?: string) {
  if (!peer || id) {
    peer = new Peer(id, {
      host: "cardtable.cf",
      port: 9000,
      path: "/myapp",
    });
  }

  return peer;
}

export async function getConn(destId?: string) {
  if (!conn) {
    conn = await waitForConnection(destId);
  }

  return conn;
}

function waitForConnection(destId?: string): Promise<Peer.DataConnection> {
  return new Promise((res, rej) => {
    if (!destId) {
      peer.on("connection", (conn) => {
        res(conn);
      });
    } else {
      const conn = peer.connect(destId);
      conn.on("open", () => {
        res(conn);
      });
    }
  });
}

export function handleData(data: string) {
  const peerData = transformCoords(JSON.parse(data));
  const { action, ...actionRemoved } = peerData;
  switch (action) {
    case "add":
      store.dispatch(add(actionRemoved));
      break;
    case "update":
      store.dispatch(update(actionRemoved));
      break;
    case "remove":
      store.dispatch(remove(actionRemoved));
      break;
    case "flip":
      store.dispatch(flip(actionRemoved.playerId, actionRemoved.card));
      break;
    case "rotate":
      store.dispatch(
        rotate(actionRemoved.playerId, actionRemoved.card, actionRemoved.angle)
      );
      break;
    default:
    // TODO throw an error
  }
}
