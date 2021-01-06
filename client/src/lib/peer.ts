import Peer from "peerjs";

import store from "../store";
import { add, remove, update, flip, rotate } from "../slices/gameSlice";
import { transformCoords } from "./utils";

export let peer: Peer;
export let conn: Peer.DataConnection | null;

export function initialize({
  roomId,
  onOpen,
  onConnect,
  onData,
}: {
  roomId?: string;
  deckId?: string;
  onOpen?: () => void;
  onConnect?: () => (peer: Peer, conn: Peer.DataConnection) => void;
  onData?: (data: any) => void;
}) {
  const isHost = !!roomId;
  peer = new Peer(roomId, {
    host: "cardtable.cf",
    secure: true,
    port: 443,
    path: "/myapp",
  });

  peer.on("open", () => {
    if (onOpen) {
      onOpen();
    }
  });

  peer.on("connection", (c) => {
    if (!isHost) {
      // Disallow incoming connections
      c.on("open", () => {
        setTimeout(() => {
          c.close();
        }, 500);
      });
      return;
    }

    if (isHost && conn && conn.open) {
      // Prevent > 1 connection
      c.on("open", () => {
        setTimeout(() => {
          c.close();
        }, 500);
      });
      return;
    }

    if (isHost) {
      conn = c;
      console.log("Connected to: " + conn.peer);

      hostReady({ onConnect, onData });
    }
  });

  peer.on("disconnected", function () {
    console.log("Connection lost. Please reconnect");
  });

  peer.on("close", function () {
    conn = null;
    console.log("Connection destroyed");
  });

  peer.on("error", function (err) {
    console.log(err);
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

export function join({
  roomId,
  onConnect,
  onData,
}: {
  roomId: string;
  onConnect?: () => (peer: Peer, conn: Peer.DataConnection) => void;
  onData?: (data: any) => void;
}) {
  if (conn) {
    conn.close();
  }

  conn = peer.connect(roomId);
  conn.on("open", () => {
    if (onConnect && conn) {
      onConnect()(peer, conn);
    }
  });

  // Handle incoming data
  conn.on("data", (data) => {
    if (onData) {
      onData(data);
    }

    handleData(data);
  });

  conn.on("close", () => {
    console.log("Connection closed");
  });
}

function hostReady({
  onConnect,
  onData,
}: {
  onConnect?: () => (peer: Peer, conn: Peer.DataConnection) => void;
  onData?: (data: any) => void;
}) {
  if (conn) {
    conn.on("open", () => {
      if (onConnect && conn) {
        onConnect()(peer, conn);
      }
    });

    conn.on("data", (data: any) => {
      if (onData) {
        onData(data);
      }
      handleData(data);
    });

    conn.on("close", function () {
      console.log("Connection closed");
      conn = null;
    });
  }
}

export function getPeer(id?: string) {
  if (!peer || id) {
    peer = new Peer(id, {
      host: "cardtable.cf",
      secure: true,
      port: 443,
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
