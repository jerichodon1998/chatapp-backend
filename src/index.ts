import "dotenv/config";
import DBConnection from "./database_configurations/DBConnection";
import app from "./rest_api";

// initialize connection to database
DBConnection.dbConnect();

const PORT = process.env.ENV === "production" ? process.env.PORT : 3001;

app.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));
