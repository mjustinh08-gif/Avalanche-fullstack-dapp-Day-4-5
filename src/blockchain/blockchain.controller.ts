import { Controller, Get, Post, Body } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Blockchain Operations') // Mengelompokkan API di Swagger
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('value')
  @ApiOperation({ 
    summary: 'Ambil Nilai Terbaru', 
    description: 'Mengambil nilai angka terakhir yang tersimpan di Smart Contract SimpleStorage.' 
  })
  @ApiResponse({ status: 200, description: 'Data berhasil ditarik dari blockchain.' })
  @ApiResponse({ status: 503, description: 'Layanan blockchain sedang tidak tersedia.' })
  getLatestValue() {
    return this.blockchainService.getLatestValue();
  }

  @Post('events')
  @ApiOperation({ 
    summary: 'Cek Riwayat Perubahan', 
    description: 'Mencari log event ValueUpdated berdasarkan rentang block tertentu.' 
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fromBlock: { type: 'number', example: 50560000 },
        toBlock: { type: 'number', example: 50561000 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Daftar event berhasil ditemukan.' })
  @ApiResponse({ status: 400, description: 'Rentang block salah atau terlalu jauh.' })
  getValueUpdatedEvents(
    @Body('fromBlock') fromBlock: number,
    @Body('toBlock') toBlock: number,
  ) {
    return this.blockchainService.getValueUpdatedEvents(fromBlock, toBlock);
  }
}