import { TransferService } from './transfer.service';
import {
  AccountCoreService,
  ExchangeService,
  TransferLogService,
} from '../mock-services';

/**
 * PR #241 — author's tests. All green. ✅
 */
describe('TransferService', () => {
  let service: TransferService;

  beforeEach(() => {
    service = new TransferService(
      new AccountCoreService(),
      new ExchangeService(),
      new TransferLogService(),
    );
  });

  it('completes a same-currency transfer', async () => {
    const result = await service.createTransfer(
      {
        customerId: 'CUST-1',
        fromAccountId: 'CHK-001', // fixture balance: 5000 USD
        toAccountId: 'SAV-001', //  USD
        amount: '2500.00',
        currency: 'USD',
      },
      'key-1',
    );
    expect(result.status).toBe('completed');
  });

  it('rejects a transfer exceeding the balance (AC1)', async () => {
    await expect(
      service.createTransfer(
        {
          customerId: 'CUST-1',
          fromAccountId: 'CHK-001', // fixture balance: 5000 USD
          toAccountId: 'SAV-001',
          amount: '9999.00',
          currency: 'USD',
        },
        'key-2',
      ),
    ).rejects.toThrow('Insufficient funds');
  });

  it('rejects a transfer over the daily limit (AC2)', async () => {
    await expect(
      service.createTransfer(
        {
          customerId: 'CUST-2',
          fromAccountId: 'CHK-777', // fixture balance: 50000 USD
          toAccountId: 'SAV-777',
          amount: '10001.00',
          currency: 'USD',
        },
        'key-3',
      ),
    ).rejects.toThrow('Daily transfer limit exceeded');
  });

  it('does not double-execute the same idempotency key (AC3)', async () => {
    const req = {
      customerId: 'CUST-1',
      fromAccountId: 'CHK-001',
      toAccountId: 'SAV-001',
      amount: '100.00',
      currency: 'USD',
    };
    const first = await service.createTransfer(req, 'key-4');
    const second = await service.createTransfer(req, 'key-4');
    expect(first.status).toBe('completed');
    expect(second.status).toBe('completed');
  });

  it('fails closed when the exchange-rate service is down (AC4)', async () => {
    process.env.EXCHANGE_SERVICE_DOWN = '1';
    try {
      await expect(
        service.createTransfer(
          {
            customerId: 'CUST-1',
            fromAccountId: 'CHK-001', // USD
            toAccountId: 'SAV-EUR-1', // EUR — requires a live FX rate
            amount: '100.00',
            currency: 'USD',
          },
          'key-5',
        ),
      ).rejects.toThrow('exchange-rate-service');
    } finally {
      delete process.env.EXCHANGE_SERVICE_DOWN;
    }
  });
});
