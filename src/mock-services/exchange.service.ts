import { Injectable, ServiceUnavailableException } from '@nestjs/common';

/**
 * Exchange-rate service stub. See API_DOCUMENTATION.md.
 * DO NOT MODIFY.
 *
 * Set EXCHANGE_SERVICE_DOWN=1 to simulate an outage.
 */
@Injectable()
export class ExchangeService {
  private readonly rates: Record<string, number> = {
    'USD:EUR': 0.91,
    'EUR:USD': 1.0989,
    'USD:GBP': 0.78,
    'GBP:USD': 1.2821,
    'EUR:GBP': 0.857,
    'GBP:EUR': 1.1668,
  };

  async getRate(from: string, to: string): Promise<number> {
    if (process.env.EXCHANGE_SERVICE_DOWN === '1') {
      throw new ServiceUnavailableException(
        'exchange-rate-service: connection timed out',
      );
    }
    const rate = this.rates[`${from}:${to}`];
    if (rate === undefined) {
      throw new ServiceUnavailableException(
        `exchange-rate-service: no rate available for ${from}:${to}`,
      );
    }
    return rate;
  }
}
