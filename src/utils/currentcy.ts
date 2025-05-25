/**
 * Định dạng số thành chuỗi tiền tệ
 * @param amount Số tiền cần định dạng
 * @param currency Đơn vị tiền tệ (mặc định: VND)
 * @param locale Ngôn ngữ định dạng (mặc định: vi-VN)
 * @returns Chuỗi tiền tệ đã định dạng
 */
function formatCurrency(
    amount: number,
    currency: string = "VND",
    locale: string = "vi-VN"
  ): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0, // Không hiển thị số thập phân (tùy chỉnh nếu cần)
    }).format(amount);
  }
export default formatCurrency;