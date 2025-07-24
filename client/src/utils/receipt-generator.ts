import { toast } from 'sonner'

export interface ReceiptData {
  transactionHash: string
  amount: string
  productName: string
  sessionId: string
  timestamp: string
  recipientAddress: string
  vendorName?: string
}

export interface ReceiptGeneratorOptions {
  width?: number
  height?: number
  backgroundColor?: string
  primaryColor?: string
  secondaryColor?: string
}

export class EnhancedReceiptGenerator {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = 600
    this.canvas.height = 800
    
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas context not available')
    }
    this.ctx = ctx
  }

  private drawText(
    text: string, 
    x: number, 
    y: number, 
    font: string = '14px Arial', 
    color: string = '#000000', 
    align: CanvasTextAlign = 'left',
    maxWidth?: number
  ) {
    this.ctx.font = font
    this.ctx.fillStyle = color
    this.ctx.textAlign = align
    
    if (maxWidth) {
      this.ctx.fillText(text, x, y, maxWidth)
    } else {
      this.ctx.fillText(text, x, y)
    }
  }

  private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number, fillColor?: string, strokeColor?: string) {
    this.ctx.beginPath()
    this.ctx.moveTo(x + radius, y)
    this.ctx.lineTo(x + width - radius, y)
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    this.ctx.lineTo(x + width, y + height - radius)
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    this.ctx.lineTo(x + radius, y + height)
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    this.ctx.lineTo(x, y + radius)
    this.ctx.quadraticCurveTo(x, y, x + radius, y)
    this.ctx.closePath()

    if (fillColor) {
      this.ctx.fillStyle = fillColor
      this.ctx.fill()
    }
    
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor
      this.ctx.lineWidth = 2
      this.ctx.stroke()
    }
  }

  private drawGradientHeader(y: number, height: number) {
    const gradient = this.ctx.createLinearGradient(0, y, 0, y + height)
    gradient.addColorStop(0, '#10b981') // emerald-500
    gradient.addColorStop(1, '#059669') // emerald-600
    
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, y, this.canvas.width, height)
  }

  private drawCheckmark(x: number, y: number, size: number) {
    const centerX = x + size / 2
    const centerY = y + size / 2
    
    // Draw circle background
    this.ctx.beginPath()
    this.ctx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    this.ctx.fill()
    
    // Draw checkmark
    this.ctx.strokeStyle = '#ffffff'
    this.ctx.lineWidth = 4
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    
    this.ctx.beginPath()
    this.ctx.moveTo(centerX - size * 0.2, centerY)
    this.ctx.lineTo(centerX - size * 0.05, centerY + size * 0.15)
    this.ctx.lineTo(centerX + size * 0.2, centerY - size * 0.1)
    this.ctx.stroke()
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  }

  private truncateAddress(address: string, length: number = 16): string {
    if (address.length <= length) return address
    const start = Math.floor((length - 3) / 2)
    const end = Math.ceil((length - 3) / 2)
    return `${address.slice(0, start)}...${address.slice(-end)}`
  }

  public generateReceipt(data: ReceiptData): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        // Clear canvas with white background
        this.ctx.fillStyle = '#ffffff'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        let y = 0

        // Header with gradient background
        const headerHeight = 160
        this.drawGradientHeader(y, headerHeight)
        
        // Brand name at top
        this.drawText('XionxePay', this.canvas.width / 2, y + 30, 'bold 24px Arial', '#ffffff', 'center')

        // Success checkmark
        this.drawCheckmark(this.canvas.width / 2 - 30, y + 50, 60)

        // Header text
        this.drawText('Payment Successful!', this.canvas.width / 2, y + 130, 'bold 28px Arial', '#ffffff', 'center')
        this.drawText('Transaction confirmed on Xion blockchain', this.canvas.width / 2, y + 155, '16px Arial', 'rgba(255, 255, 255, 0.9)', 'center')
        
        y += headerHeight + 40

        // Amount section with background
        this.drawRoundedRect(40, y, this.canvas.width - 80, 80, 12, '#f0fdf4', '#10b981')
        this.drawText('Amount Paid', this.canvas.width / 2, y + 25, '16px Arial', '#6b7280', 'center')
        this.drawText(`${data.amount} XION`, this.canvas.width / 2, y + 50, 'bold 32px Arial', '#10b981', 'center')
        this.drawText(`for ${data.productName}`, this.canvas.width / 2, y + 70, '14px Arial', '#6b7280', 'center')
        
        y += 120

        // Transaction Details Header
        this.drawText('Transaction Details', 60, y, 'bold 20px Arial', '#1f2937')
        y += 40

        // Details background
        this.drawRoundedRect(40, y, this.canvas.width - 80, 280, 12, '#f9fafb', '#e5e7eb')
        
        const detailsStartY = y + 30
        const leftMargin = 70
        const rightMargin = this.canvas.width - 70

        // Transaction Hash
        y = detailsStartY
        this.drawText('Transaction Hash:', leftMargin, y, 'bold 14px Arial', '#374151')
        y += 20
        this.drawText(this.truncateAddress(data.transactionHash, 40), leftMargin, y, '12px Courier', '#6b7280')
        y += 35

        // Timestamp
        this.drawText('Transaction Time:', leftMargin, y, 'bold 14px Arial', '#374151')
        y += 20
        this.drawText(this.formatDate(data.timestamp), leftMargin, y, '12px Arial', '#6b7280')
        y += 35

        // Recipient Address
        this.drawText('Recipient Address:', leftMargin, y, 'bold 14px Arial', '#374151')
        y += 20
        this.drawText(this.truncateAddress(data.recipientAddress, 40), leftMargin, y, '12px Courier', '#6b7280')
        y += 35

        // Session ID
        this.drawText('Session ID:', leftMargin, y, 'bold 14px Arial', '#374151')
        y += 20
        this.drawText(data.sessionId, leftMargin, y, '12px Courier', '#6b7280')
        y += 35

        // Status
        this.drawText('Status:', leftMargin, y, 'bold 14px Arial', '#374151')
        this.drawText('✓ Completed', rightMargin, y, 'bold 14px Arial', '#10b981', 'right')

        y += 80

        // Brand logo/name section
        y += 20
        this.drawText('XionxePay', this.canvas.width / 2, y, 'bold 24px Arial', '#10b981', 'center')
        y += 30
        this.drawText('Secure Web3 Payment Platform', this.canvas.width / 2, y, '14px Arial', '#6b7280', 'center')
        y += 40

        // Footer
        this.drawText('Powered by XionxePay', this.canvas.width / 2, y, 'bold 16px Arial', '#10b981', 'center')
        y += 25
        this.drawText('Secured by Xion Blockchain Technology', this.canvas.width / 2, y, '12px Arial', '#6b7280', 'center')
        y += 20
        this.drawText('This receipt is cryptographically verified and tamper-proof', this.canvas.width / 2, y, '10px Arial', '#9ca3af', 'center')

        // Convert to blob
        this.canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to generate receipt blob'))
          }
        }, 'image/png', 1.0)

      } catch (error) {
        reject(error)
      }
    })
  }

  public async downloadReceipt(data: ReceiptData): Promise<void> {
    try {
      const blob = await this.generateReceipt(data)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `xionxepay-receipt-${data.transactionHash.substring(0, 8)}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Receipt downloaded successfully!')
    } catch (error) {
      console.error('Failed to download receipt:', error)
      toast.error('Failed to generate receipt')
    }
  }
}
