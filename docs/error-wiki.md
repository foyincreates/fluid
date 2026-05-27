# Fluid Error Wiki

Welcome to the central repository for Fluid SDK error codes. This guide helps you understand why an error occurred and how to resolve it.

## Common Error Codes

### [Configuration Error](https://docs.fluid.dev/errors#configuration) (`FluidConfigurationError`)
**Description**: Occurs when the `FluidClient` is initialized with invalid parameters.
**Resolution**: Check your `FluidClientConfig`. Ensure `networkPassphrase` is correct and at least one `serverUrl` is provided.

### [Network Error](https://docs.fluid.dev/errors#network) (`FluidNetworkError`)
**Description**: Failed to reach any Fluid server. This could be due to DNS issues, local connectivity, or a server timeout.
**Resolution**: Verify your internet connection. If the issue persists, check the status of the Fluid servers or increase the `timeout` in your configuration.

### [No Available Server](https://docs.fluid.dev/errors#no-available-server) (`FluidNoAvailableServerError`)
**Description**: All configured server URLs have been tried and failed, or are currently in a "cool-down" state due to previous failures.
**Resolution**: Check if the Fluid infrastructure is undergoing maintenance. If using multiple URLs, ensure they are all valid and reachable.

### [Server Error](https://docs.fluid.dev/errors#server) (`FluidServerError`)
**Description**: The Fluid server received the request but rejected it with a specific status code (4xx or 5xx).
**Common Sub-codes**:
- `insufficient-funds`: The sponsor account does not have enough XLM to cover the fee-bump.
- `unauthorized-transaction`: The transaction does not match the sponsor's whitelist or policy.
- `rate-limit-exceeded`: You are making too many requests in a short period.

### [Wallet Error](https://docs.fluid.dev/errors#wallet) (`FluidWalletError`)
**Description**: Issues related to signing or wallet interactions (e.g., user rejected a signing request).
**Resolution**: Ensure the user has their wallet unlocked and has granted permission to the application.

---

## Need More Help?
If your error isn't listed here, please visit our [Discord Community](https://discord.gg/fluid) or open a [Support Ticket](https://support.fluid.dev/tickets).
