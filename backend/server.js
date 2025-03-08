const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { SessionsClient } = require("@google-cloud/dialogflow");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PROJECT_ID = process.env.DIALOGFLOW_PROJECT_ID;
const SESSION_ID = "123456789"; // Unique session for each user

// Dialogflow client setup
const sessionClient = new SessionsClient();

app.post("/api/dialogflow", async (req, res) => {
  const userMessage = req.body.text;

  const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, SESSION_ID);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: userMessage,
        languageCode: "en-US",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({ response: result.fulfillmentText });
  } catch (error) {
    console.error("Dialogflow request failed:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
