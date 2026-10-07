import express from "express";

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).json({
    message: "Server is running",
    statusCode: response.statusCode,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
