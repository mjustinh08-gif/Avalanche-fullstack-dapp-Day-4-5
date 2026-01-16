import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { createPublicClient, http, PublicClient } from 'viem';
import { avalancheFuji } from 'viem/chains';
import SIMPLE_STORAGE from './simple-storage.json';

@Injectable()
export class BlockchainService {
  private client: PublicClient;
  private contractAddress: `0x${string}`;

  constructor() {
    /** * Konfigurasi Client menggunakan Environment Variables (.env)
     * Task 1 & 4 - Setup & API Design
     */
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http(process.env.RPC_URL),
    });

    // Mengambil alamat kontrak dari .env agar tidak hardcoded
    this.contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`;
  }

  /**
   * Mengambil nilai terbaru (Read Contract)
   * Task 2 - Read Smart Contract
   */
  async getLatestValue() {
    try {
      const value = (await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE.abi,
        functionName: 'getValue',
      })) as bigint;

      return {
        status: 'success',
        contract: this.contractAddress,
        data: {
          lastValue: value.toString(),
          unit: 'uint256',
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.processBlockchainError(error);
    }
  }

  /**
   * Mengambil riwayat event dari blockchain
   * Task 3 - Event Query
   */
  async getValueUpdatedEvents(fromBlock: number, toBlock: number) {
    try {
      // Validasi rentang blok (Task 4 - Error Handling)
      const blockRange = toBlock - fromBlock;
      if (blockRange < 0) {
        throw new BadRequestException('fromBlock tidak boleh lebih besar dari toBlock');
      }
      if (blockRange > 2000) {
        throw new BadRequestException('Range blok terlalu besar, maksimal 2000 blok');
      }

      const logs = await this.client.getLogs({
        address: this.contractAddress,
        event: {
          type: 'event',
          name: 'ValueUpdated',
          inputs: [{ name: 'newValue', type: 'uint256', indexed: false }],
        },
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });

      const eventLogs = logs.map((log) => ({
        block: log.blockNumber?.toString(),
        newValue: log.args.newValue?.toString(),
        transactionHash: log.transactionHash,
      }));

      return {
        status: 'success',
        totalEvents: eventLogs.length,
        results: eventLogs,
      };
    } catch (error) {
      this.processBlockchainError(error);
    }
  }

  /**
   * Centralized Error Handler untuk Blockchain
   * Task 4 - Error Handling Rapi
   */
  private processBlockchainError(error: unknown): never {
    if (error instanceof BadRequestException) {
      throw error;
    }

    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Blockchain Service Error:', errorMsg);

    if (errorMsg.includes('timeout')) {
      throw new ServiceUnavailableException({
        message: 'Koneksi ke Blockchain timeout.',
        suggestion: 'Coba lagi dalam beberapa saat.',
      });
    }

    if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
      throw new ServiceUnavailableException({
        message: 'Gagal terhubung ke RPC Fuji.',
        suggestion: 'Periksa koneksi internet atau status RPC.',
      });
    }

    throw new InternalServerErrorException({
      message: 'Gagal berinteraksi dengan Smart Contract.',
      details: errorMsg,
    });
  }
}