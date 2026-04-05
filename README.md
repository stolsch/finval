# FinVal

**Financial data validation library for production applications**

---

## The Problem

Financial applications break silently when bad data gets in. Most teams write ad-hoc validation:
- "Is this price reasonable?"
- "Did the API return stale data?"
- "Is this ISIN code valid?"
- "Why did the currency conversion fail?"

There's no comprehensive OSS solution. Everyone reinvents the same validators.

This library fixes that.

## What It Does

### 1. Price Validation
- **Range checks**: Configurable bounds per asset class (stocks, FX, commodities)
- **Precision validation**: Enforce decimal places (e.g., EUR/USD to 5 decimals)
- **Sanity checks**: Detect negative prices, zero volumes, impossible values
- **Spike detection**: Flag sudden price movements beyond thresholds

### 2. Anomaly Detection
- **Outlier detection**: Statistical methods for spotting bad ticks
- **Staleness checks**: Flag data older than expected update frequency
- **Gap detection**: Identify missing data points in time series
- **Correlation checks**: Cross-validate related instruments (e.g., futures vs spot)

### 3. Format Validation
- **ISIN validation**: Checksum verification for security identifiers
- **Currency codes**: ISO 4217 compliance
- **Date formats**: Timezone-aware validation
- **Market identifiers**: MIC codes, exchange symbols

### 4. Data Quality Scoring
- **Completeness**: Percentage of expected fields present
- **Timeliness**: Age of data vs expected freshness
- **Consistency**: Internal consistency checks (bid ≤ ask, etc.)
- **Confidence scores**: Overall data quality rating

## Roadmap

**Phase 1 (Months 1-2)**: Price validators
- Range checks and precision validation
- Spike detection algorithms
- Unit tests + documentation

**Phase 2 (Months 3-4)**: Anomaly detection
- Outlier detection methods
- Staleness and gap detection
- Real-world test cases

**Phase 3 (Months 5-6)**: Format validators
- ISIN, currency, date validation
- Data quality scoring system
- Integration guides

## Current Status

🚧 **Under active development** 🚧

This library is being extracted from [Hardalion Nexus](https://hardalion.com) — a fintech platform that processes real market data daily. Validators are being refactored from production code and packaged for community use.

**First release:** Expected Q2 2026

## Why This Matters

Bad financial data causes:
- **Silent failures**: Wrong portfolio values, incorrect risk calculations
- **Production incidents**: Apps crash on unexpected formats
- **Compliance issues**: Regulatory reports with invalid data
- **Lost trust**: Users see impossible prices or stale quotes

This library provides:
- **Battle-tested validators** from production fintech systems
- **Sensible defaults** for common asset classes
- **Extensible patterns** for custom validation rules

The goal: make financial data validation boring (in a good way).

## Contributing

Contributions welcome! This project is in early stages. Once initial validators are released:
- Report edge cases and validation failures
- Suggest additional asset classes
- Share your own production validation patterns
- Improve documentation with real-world examples

## Tech Stack

- **Language**: TypeScript (type safety for financial calculations)
- **Testing**: Vitest with property-based testing
- **Documentation**: TypeDoc + usage examples
- **License**: MIT (to be confirmed)

## Use Cases

- **Trading apps**: Validate market data before display
- **Risk systems**: Ensure calculation inputs are sane
- **Compliance**: Pre-validate data before regulatory submission
- **Data pipelines**: Quality gates for financial ETL
- **APIs**: Input validation for fintech endpoints

## Author

Built by [Apostolos](https://github.com/stolsch), founder of [Hardalion](https://hardalion.com) — fintech infrastructure for modern financial applications.

---

**Note**: This is production-grade validation extracted from real fintech systems. Components are released as they're validated, documented, and generalized. Quality over speed.
