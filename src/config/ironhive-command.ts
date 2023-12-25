export const ironhiveRequest = {
  ping: JSON.stringify({ func: "ping" }),
  publicIp: JSON.stringify({ func: "publicip" }),
  cpuUssage: JSON.stringify({ func: "cpuussage" }),
  softwareList: JSON.stringify({ func: "softwarelist" }),
  procs: JSON.stringify({ func: "procs" }),
};

export const ironhiveResponse = {
  ping: "pong",
};
