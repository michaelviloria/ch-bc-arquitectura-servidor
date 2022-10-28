import app from "./src/server.js";
import os from "os";
import cluster from "cluster";
const numCPUs = os.cpus().length;
import mongoose from "mongoose";
import parseArgs from "minimist";
import { executeCmds } from "./src/services/executeCmds.js";
import { logger } from "./src/utils/apiLogs.js";
import * as dotenv from "dotenv";
dotenv.config();

// export const args = yargs(process.argv.slice(2))
// 	.options({
// 		p: {
// 			alias: "port",
// 			default: "8080",
// 			describe: "Puerto de escucha del servidor",
// 		},
// 		m: {
// 			alias: "mode",
// 			default: "FORK",
// 			describe: "Modo de operacion del servidor",
// 			type: "string",
// 		},
// 	})
// 	.parse();

const optionsArgs = {
	alias: {
		cmd: "command",
		n: "name",
		pr: "price",
		s: "stock",
		p: "port",
		m: "mode"
	},
};
export const args = parseArgs(process.argv.slice(2), optionsArgs);

const portArgs = args.port || 8080;
const PORT = process.env.PORT || portArgs;
const modeServer = args.mode || "FORK";

if (modeServer == "CLUSTER" && cluster.isPrimary) {
	console.log(`Master ${process.pid} is running`);
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker, code, signal) => {
		console.log(`Worker ${worker.proccess.pid} died`);
	});
} else {
	const server = app.listen(PORT, () => {
		mongoose.connect(process.env.MONGO_CONNECT);
		console.log(
			`Servidor HTTP escuchando en el puerto ${server.address().port}`
		);
	});

	server.on("error", (error) => console.log(`Error en servidor: ${error}`));
}
