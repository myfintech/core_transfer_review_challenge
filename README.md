# Code Review Challenge: Funds Transfer Service

## Welcome

You're reviewing a pull request. Our AI coding agent implemented ticket **CORE-1893** overnight and pushed branch **`coding-agent/CORE-1893-transfers`**. All of its tests pass. You're the human gate: decide whether this ships.

**Your deliverable (by the end of the session):**
1. A **ship / don't-ship** verdict
2. Your **top issues, ranked by severity**
3. What you'd tell the author

You're welcome to use AI just like you would on the job. But your review is *your* review — every issue you raise, you should be able to demonstrate and defend. We're not grading what your AI finds; we're grading what you decide.

**Estimated Time:** 45-60 minutes

---

## The Ticket (CORE-1893)

> **Implement `POST /transfers`** — move money between a customer's own accounts, including cross-currency transfers.
>
> **Acceptance Criteria:**
> 1. Reject transfers that exceed the source account's available balance.
> 2. Enforce a daily transfer limit of **$10,000 USD-equivalent per customer**, across all of their transfers that day.
> 3. Requests carry an `Idempotency-Key` header. The same key must **never double-execute** a transfer, and a retried request must receive the **same response** as the original attempt.
> 4. If the exchange-rate service is unavailable, **fail closed** — never guess or reuse a rate. (Compliance requirement: rates must be current at execution time.)

---

## Quick Start

```bash
# 1. Get the code under review
git checkout coding-agent/CORE-1893-transfers

# 2. Install dependencies
npm install

# 3. Run the author's tests (they pass)
npm test

# 4. Optional: run the server for manual testing
npm start
```

You can also read the change as a diff on GitHub:
**Compare view:** `https://github.com/<org>/<repo>/compare/main...coding-agent/CORE-1893-transfers`

---

## Project Structure

```
src/
├── main.ts                         # App entry point
├── app.module.ts                   # Root module
│
├── mock-services/                  # DO NOT MODIFY — legacy core stubs
│   ├── API_DOCUMENTATION.md        # ⭐ SERVICE DOCUMENTATION — read this!
│   ├── account-core.service.ts     # balances, debit/credit
│   ├── exchange.service.ts         # FX rates
│   └── transfer-log.service.ts     # transfer history
│
└── transfer/                       # ⭐ THE CODE UNDER REVIEW
    ├── transfer.controller.ts
    ├── transfer.types.ts
    ├── transfer.service.ts         # review this
    └── transfer.service.spec.ts    # the author's tests
```

---

**Feel free to ask clarifying questions — treat this like a working session with a teammate.**
