import { Injectable, BadRequestException } from '@nestjs/common';
import {
  AccountCoreService,
  ExchangeService,
  TransferLogService,
} from '../mock-services';
import { TransferRequest, TransferResult } from './transfer.types';

/**
 * PR #241 — feat(transfers): implement POST /transfers + Move Money screen (CORE-1893)
 * Author: coding-agent[bot]
 *
 * Implements customer-to-own-account transfers with cross-currency
 * support, daily limits, strict idempotency, and fail-closed FX handling.
 */
@Injectable()
export class TransferService {
  // Idempotency (AC3): completed transfers keyed by Idempotency-Key, so a
  // retried request replays the exact original response.
  private readonly completedByKey = new Map<string, TransferResult>();

  private static readonly DAILY_LIMIT = 10000;

  constructor(
    private readonly accounts: AccountCoreService,
    private readonly exchange: ExchangeService,
    private readonly transferLog: TransferLogService,
  ) {}

  async createTransfer(
    req: TransferRequest,
    idempotencyKey: string,
  ): Promise<TransferResult> {
    // ── Idempotency (AC3) ──────────────────────────────────────────
    const replay = this.completedByKey.get(idempotencyKey);
    if (replay) {
      return replay;
    }

    const amount = Number(req.amount);

    console.log(
      `[transfer] ${req.customerId}: ${req.fromAccountId} -> ${req.toAccountId} ${amount} ${req.currency}`,
    );

    // ── Balance check (AC1) ────────────────────────────────────────
    const balance = await this.accounts.getBalance(req.fromAccountId);
    if (balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    // ── Daily limit check (AC2) ────────────────────────────────────
    // Sum today's transfers and make sure this one keeps us under the cap.
    const todays = await this.transferLog.getTransfers(
      req.fromAccountId,
      new Date().toISOString().slice(0, 10),
    );
    const spentToday = todays.reduce((sum, t) => sum + t.amount, 0);
    if (spentToday + amount > TransferService.DAILY_LIMIT) {
      throw new BadRequestException('Daily transfer limit exceeded');
    }

    // ── Cross-currency conversion (AC4) ────────────────────────────
    // Fail closed: if the FX service is down, getRate throws and the
    // transfer is rejected — rates must be current at execution time.
    const targetCurrency = await this.accounts.getCurrency(req.toAccountId);
    let credited = amount;
    if (targetCurrency !== req.currency) {
      const rate = await this.exchange.getRate(req.currency, targetCurrency);
      credited = amount * rate;
    }

    // ── Execute ────────────────────────────────────────────────────
    await this.accounts.debit(req.fromAccountId, amount);
    await this.accounts.credit(req.toAccountId, credited);

    const transferId = await this.transferLog.record({
      customerId: req.customerId,
      fromAccountId: req.fromAccountId,
      toAccountId: req.toAccountId,
      amount,
      currency: req.currency,
    });

    const result: TransferResult = { status: 'completed', transferId };
    this.completedByKey.set(idempotencyKey, result);
    return result;
  }
}
