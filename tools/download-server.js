const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const filePath = path.join(root, "entregables", "cotizacion-haru-logistics-group.png");
const port = Number(process.env.PORT || 8765);

http
  .createServer((req, res) => {
    if (req.url !== "/cotizacion-haru-logistics-group.png") {
      res.writeHead(302, { Location: "/cotizacion-haru-logistics-group.png" });
      res.end();
      return;
    }

    fs.stat(filePath, (statError, stats) => {
      if (statError) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Imagen no encontrada.");
        return;
      }

      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": stats.size,
        "Content-Disposition": 'attachment; filename="cotizacion-haru-logistics-group.png"',
      });
      fs.createReadStream(filePath).pipe(res);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Download server running at http://127.0.0.1:${port}/cotizacion-haru-logistics-group.png`);
  });
