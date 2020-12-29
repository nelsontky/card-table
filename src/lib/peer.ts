import Peer from "peerjs";

let peer: null | Peer = null;

export function getPeer() {
  if (!peer) {
    peer = new Peer();
  }

  return peer;
}
