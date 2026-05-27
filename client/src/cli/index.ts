#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import path from "path";
import { FluidClient } from "../FluidClient";
import StellarSdk from "@stellar/stellar-sdk";

export function createProgram() {
  const program = new Command();

  program
    .name("fluid")
    .description("Fluid Platform CLI for developers")
    .version("0.1.0");

  const config = program.command("config").description("Manage platform configurations");

  config
    .command("upload")
    .description("Upload a local configuration file to the Fluid platform")
    .argument("<file>", "Path to the configuration file (JSON)")
    .option("-s, --server <url>", "Fluid server URL", "http://localhost:3000")
    .action(async (file, options) => {
      try {
        const filePath = path.resolve(process.cwd(), file);
        if (!fs.existsSync(filePath)) {
          console.error(`Error: File not found at ${filePath}`);
          process.exit(1);
        }

        const content = fs.readFileSync(filePath, "utf8");
        const configData = JSON.parse(content);

        console.log(`Uploading configuration from ${file} to ${options.server}...`);
        
        // Mocked implementation for config upload
        // In a real scenario, this would call a protected endpoint on the Fluid server
        const response = await fetch(`${options.server}/cli/config/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Fluid-CLI-Version": "0.1.0",
          },
          body: JSON.stringify(configData),
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${await response.text()}`);
        }

        console.log("✅ Configuration uploaded successfully!");
      } catch (error) {
        console.error(`❌ Upload failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      }
    });

  config
    .command("download")
    .description("Download the latest platform configuration")
    .argument("[destination]", "Path to save the configuration", "./fluid.config.json")
    .option("-s, --server <url>", "Fluid server URL", "http://localhost:3000")
    .action(async (destination, options) => {
      try {
        console.log(`Downloading configuration from ${options.server}...`);

        const response = await fetch(`${options.server}/cli/config/download`, {
          method: "GET",
          headers: {
            "X-Fluid-CLI-Version": "0.1.0",
          },
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${await response.text()}`);
        }

        const configData = await response.json();
        const destPath = path.resolve(process.cwd(), destination);
        
        fs.writeFileSync(destPath, JSON.stringify(configData, null, 2));
        console.log(`✅ Configuration saved to ${destPath}`);
      } catch (error) {
        console.error(`❌ Download failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      }
    });

  program
    .command("simulate")
    .description("Simulate a fee-bump request without submitting it to the network")
    .argument("<xdr>", "The inner transaction XDR to fee-bump")
    .option("-s, --server <url>", "Fluid server URL", "http://localhost:3000")
    .option("-n, --network <passphrase>", "Stellar network passphrase", StellarSdk.Networks.TESTNET)
    .option("-j, --json", "Output the result as JSON", false)
    .action(async (xdr, options) => {
      try {
        if (!options.json) {
          console.log(`🔍 Simulating fee-bump for transaction...`);
          console.log(`   Server: ${options.server}`);
          console.log(`   Network: ${options.network}`);
        }

        const client = new FluidClient({
          serverUrl: options.server,
          networkPassphrase: options.network,
        });

        const response = await client.requestFeeBump(xdr, false);

        if (options.json) {
          console.log(JSON.stringify(response, null, 2));
        } else {
          console.log("\n✅ Fee-bump simulation successful!");
          console.log("--------------------------------------------------");
          console.log(`Status:      ${response.status}`);
          console.log(`Hash:        ${response.hash || "N/A"}`);
          console.log(`Fee Payer:   ${response.fee_payer || "N/A"}`);
          console.log(`Fee-Bump XDR:`);
          console.log(response.xdr);
          console.log("--------------------------------------------------");
          console.log("\n(Note: This transaction has NOT been submitted to the network)");
        }
      } catch (error) {
        if (options.json) {
          console.error(JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            type: error && typeof error === 'object' && 'name' in error ? error.name : 'Error',
            serverUrl: error && typeof error === 'object' && 'serverUrl' in error ? (error as any).serverUrl : undefined,
            statusCode: error && typeof error === 'object' && 'statusCode' in error ? (error as any).statusCode : undefined,
          }, null, 2));
        } else {
          console.error(`\n❌ Simulation failed!`);
          if (error && typeof error === 'object' && 'name' in error) {
            console.error(`   Error Type: ${error.name}`);
          }
          console.error(`   Message:    ${error instanceof Error ? error.message : String(error)}`);
          if (error && typeof error === 'object' && 'serverUrl' in error) {
            console.error(`   Server:     ${(error as any).serverUrl}`);
          }
        }
        process.exit(1);
      }
    });

  return program;
}

if (require.main === module) {
  createProgram().parse();
}
