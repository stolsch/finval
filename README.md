# FinVal

[![npm version](https://img.shields.io/npm/v/finval.svg)](https://www.npmjs.com/package/finval)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Coverage](https://img.shields.io/badge/coverage-target%20100%25-brightgreen.svg)](#roadmap)

Financial data validation should be a solved problem.

FinVal is a production-ready, open-source TypeScript library for validating financial data before it reaches pricing engines, APIs, risk models, dashboards, and compliance workflows.

## Why FinVal Exists

Financial systems break in expensive ways when market data is malformed, stale, out-of-range, or internally inconsistent. FinVal gives teams a lightweight, composable validation layer they can run early in ingestion pipelines and service boundaries, with deterministic machine-readable error codes.

## Installation

```bash
npm install finval
```

## Quick Start

```ts
import { validatePriceRange } from "finval";

const result = validatePriceRange({ price: 150, assetClass: "equity" });
console.log(result.valid); // true
```

```ts
import { validateNoNegativeValues } from "finval";

const result = validateNoNegativeValues({
  assetClass: "equity",
  price: 101.5,
  bid: 101.4,
  ask: 101.6,
  volume: 12000
});
console.log(result.errors);
```

```ts
import { detectSpike } from "finval";

const result = detectSpike({ prices: [100, 101, 99, 145, 100], threshold: 0.2 });
console.log(result.errors.map((error) => error.code)); // ['PRICE_SPIKE']
```

## API Reference

Generate docs locally with:

```bash
pnpm docs
```

TypeDoc output is generated under `docs/`.

## Roadmap

- [x] Phase 1: Price validators (range, precision, negatives, spikes) with tests
- [x] Phase 1: Public API barrel and strict core types
- [ ] Phase 2: Expanded anomaly detection coverage and tests
- [ ] Phase 3: Full format validators (complete ISO 4217 list, MIC datasets, date edge cases)
- [ ] Quality engine enhancements and scoring heuristics

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

## License

MIT © Apostolos Chardalias (Hardalion)
