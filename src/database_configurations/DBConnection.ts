import mongoose from "mongoose";

interface ConnectionInterface {
	dbConnect: () => Promise<void>;
	dbDisconnect: () => Promise<void>;
}

const DB_URI =
	process.env.ENV === "production"
		? process.env.DB_URI || "" // Added an empty string due to TS concern that DB_URI might be undefined
		: "mongodb://localhost:27017/chatapp?replicaSet=myReplSet";

class DBConnection implements ConnectionInterface {
	// initialize connection
	dbConnect = async () => {
		try {
			await mongoose.connect(DB_URI).then(async (db) => {
				console.log(`DB connected ${mongoose.connection.db.databaseName}`);

				// configure changeStreamOptions preAndPostImages: { expireAfterSeconds: 100 }
				await db.connection.db.admin().command({
					setClusterParameter: {
						changeStreamOptions: {
							preAndPostImages: { expireAfterSeconds: 100 },
						},
					},
				});
			});
		} catch (error) {
			console.log(error);
		}
	};

	// disconnect
	dbDisconnect = async () => {
		try {
			await mongoose.disconnect().then(() => {
				console.log(`Database Disconnected`);
			});
		} catch (error) {
			console.log(error);
		}
	};
}

// Instance Object of the DB connection
const MyDB = new DBConnection();

export default MyDB;
