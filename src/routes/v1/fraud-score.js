const express = require('express');

const fraudScoreRouter = express.Router();

fraudScoreRouter.post('/fraud-score', (_request, response) => {
  response.status(200).json({
    approved: false,
    fraud_score: 1.0
  });
});

module.exports = { fraudScoreRouter };
