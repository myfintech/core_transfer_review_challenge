import { Controller, Get, Param } from '@nestjs/common';
import { AccountCoreService } from '../mock-services';

/**
 * Read-only account listing for the web client.
 * Shipped in CORE-1841 — not part of the change under review.
 */
@Controller('customers')
export class AccountsController {
  constructor(private readonly accounts: AccountCoreService) {}

  @Get(':customerId/accounts')
  async list(@Param('customerId') customerId: string) {
    return this.accounts.getAccountsByCustomer(customerId);
  }
}
