import type { BirthdayPack } from '../generator/types';

export async function exportAsPDF(
  pack: BirthdayPack,
  name: string,
  includeWatermark: boolean
): Promise<void> {
  try {
    // Create a simple text-based PDF using browser's print functionality
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Failed to open print window. Please allow popups.');
    }

    const watermarkText = includeWatermark 
      ? '<p style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">Created with WishMint AI - Upgrade to remove watermark</p>'
      : '<p style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">Made with ❤️ by WishMint AI</p>';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Birthday Wish - ${name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              background: linear-gradient(135deg, #8B5CF6 0%, #10B981 100%);
              color: white;
            }
            .container {
              background: rgba(0, 0, 0, 0.7);
              padding: 40px;
              border-radius: 12px;
            }
            h1 {
              text-align: center;
              font-size: 32px;
              margin-bottom: 10px;
            }
            h2 {
              text-align: center;
              font-size: 24px;
              margin-bottom: 40px;
              color: #10B981;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-weight: bold;
              font-size: 18px;
              margin-bottom: 10px;
              color: #8B5CF6;
            }
            .section-content {
              line-height: 1.6;
              white-space: pre-wrap;
            }
            @media print {
              body {
                background: white;
                color: black;
              }
              .container {
                background: white;
              }
              .section-title {
                color: #8B5CF6;
              }
              h2 {
                color: #10B981;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>WishMint AI</h1>
            <h2>Happy Birthday ${name}!</h2>
            
            <div class="section">
              <div class="section-title">Birthday Wish:</div>
              <div class="section-content">${pack.mainWish}</div>
            </div>
            
            <div class="section">
              <div class="section-title">WhatsApp Message:</div>
              <div class="section-content">${pack.whatsappShort}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Instagram Caption:</div>
              <div class="section-content">${pack.instagramCaption}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Mini Speech:</div>
              <div class="section-content">${pack.miniSpeech}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Hashtags:</div>
              <div class="section-content">${pack.hashtags}</div>
            </div>
            
            ${watermarkText}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to generate PDF. Please try again or check if popups are blocked.');
  }
}
