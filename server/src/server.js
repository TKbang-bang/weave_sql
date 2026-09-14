import http from "http";

import app from "./app.js";
import ioConnection from "./io/socket.io.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

ioConnection(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
