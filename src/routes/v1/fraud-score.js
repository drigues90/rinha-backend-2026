const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  DEFAULT_TOP_K,
  getNearestNeighbors,
  placeholderDataset
} = require('../../services/nearestNeighbors');

const fraudScoreRouter = express.Router();

const MCC_RISK_PATH = path.join(__dirname, '../../data/mcc_risk.json');
// MCC risk lookup defaults to 0.5 when the MCC is missing.

// Normalization limits for the fraud vector.
const VECTOR_LIMITS = {
  maxAmount: 10000,
  maxInstallments: 12,
  maxAmountVsAvgRatio: 10,
  maxMinutes: 1440,
  maxKm: 1000,
  maxTxCount24h: 20,
  maxMerchantAvgAmount: 10000
};

let cachedMccRiskMap = null;

function safeNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function limitar(value, min, max) {
  return clamp(value, min, max);
}

function normalizeValue(value, max) {
  if (!Number.isFinite(max) || max === 0) {
    return 0;
  }
  const numeric = safeNumber(value);
  return clamp(numeric / max, 0, 1);
}

function toEpochMillis(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 1e12 ? value : Math.floor(value * 1000);
  }

  if (typeof value === 'string') {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return numeric > 1e12 ? numeric : Math.floor(numeric * 1000);
    }

    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function toBooleanNumber(value) {
  return value ? 1 : 0;
}

function getMccRiskMap() {
  if (cachedMccRiskMap) {
    return cachedMccRiskMap;
  }

  try {
    const raw = fs.readFileSync(MCC_RISK_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    cachedMccRiskMap = parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    cachedMccRiskMap = {};
  }

  return cachedMccRiskMap;
}

function getUtcTimeParts(value) {
  const epochMillis = toEpochMillis(value);
  if (!epochMillis) {
    return { hour: 0, dayOfWeek: 0 };
  }

  const date = new Date(epochMillis);
  return {
    hour: date.getUTCHours(),
    dayOfWeek: date.getUTCDay()
  };
}

function buildFeatureVector(payload) {
  const transaction = payload.transaction || {};
  const customer = payload.customer || {};
  const merchant = payload.merchant || {};
  const terminal = payload.terminal || {};
  const lastTransaction = payload.last_transaction;
  const knownMerchants = Array.isArray(customer.known_merchants)
    ? customer.known_merchants
    : [];
  const knownMerchantSet = new Set(knownMerchants.map(String));
  const merchantId = merchant.id;
  const merchantIdKey = merchantId === null || merchantId === undefined
    ? null
    : String(merchantId);
  const unknownMerchant = merchantIdKey && knownMerchantSet.has(merchantIdKey)
    ? 0
    : 1;
  const { hour: requestedAtHourUtc, dayOfWeek: requestedAtDayUtc } = getUtcTimeParts(
    transaction.requested_at
  );
  const hasLastTransaction = lastTransaction && typeof lastTransaction === 'object';
  const lastTimestampMillis = hasLastTransaction
    ? toEpochMillis(lastTransaction.timestamp)
    : 0;
  const requestedAtMillis = toEpochMillis(transaction.requested_at);
  const deltaMillis = requestedAtMillis && lastTimestampMillis
    ? requestedAtMillis - lastTimestampMillis
    : 0;
  const minutesSinceLastTx = hasLastTransaction
    ? Math.max(0, deltaMillis / 60000)
    : -1;
  const mccRiskMap = getMccRiskMap();
  const mccKey = merchant.mcc === null || merchant.mcc === undefined
    ? null
    : String(merchant.mcc);
  const mccRisk = mccKey && Object.prototype.hasOwnProperty.call(mccRiskMap, mccKey)
    ? safeNumber(mccRiskMap[mccKey])
    : 0.5;
  const amountVsAvgRatio = customer.avg_amount
    ? safeNumber(transaction.amount) / safeNumber(customer.avg_amount)
    : 0;

  return [
    normalizeValue(transaction.amount, VECTOR_LIMITS.maxAmount),
    normalizeValue(transaction.installments, VECTOR_LIMITS.maxInstallments),
    normalizeValue(amountVsAvgRatio, VECTOR_LIMITS.maxAmountVsAvgRatio),
    normalizeValue(customer.tx_count_24h, VECTOR_LIMITS.maxTxCount24h),
    unknownMerchant,
    clamp(mccRisk, 0, 1),
    normalizeValue(merchant.avg_amount, VECTOR_LIMITS.maxMerchantAvgAmount),
    toBooleanNumber(terminal.is_online),
    toBooleanNumber(terminal.card_present),
    normalizeValue(terminal.km_from_home, VECTOR_LIMITS.maxKm),
    normalizeValue(
      hasLastTransaction ? lastTransaction.km_from_current : 0,
      VECTOR_LIMITS.maxKm
    ),
    minutesSinceLastTx === -1
      ? -1
      : normalizeValue(minutesSinceLastTx, VECTOR_LIMITS.maxMinutes),
    normalizeValue(requestedAtHourUtc, 23),
    normalizeValue(requestedAtDayUtc, 6)
  ];
}

function computeFraudScore(_payload, _vector, _neighbors) {
  // TODO: Replace with real scoring rule once defined.
  return 1.0;
}

fraudScoreRouter.post('/fraud-score', (request, response) => {
  const payload = request.body || {};
  const vector = buildFeatureVector(payload);
  const neighbors = getNearestNeighbors(vector, placeholderDataset, {
    topK: DEFAULT_TOP_K
  });
  const fraudScore = computeFraudScore(payload, vector, neighbors);

  response.status(200).json({
    approved: false,
    fraud_score: fraudScore
  });
});

module.exports = { fraudScoreRouter };
