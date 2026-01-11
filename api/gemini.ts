
// File này đã được hủy bỏ và di chuyển logic về geminiService.ts phía client.
export default async function handler(req: any, res: any) {
  res.status(410).json({ error: "Endpoint đã ngừng hoạt động. Vui lòng sử dụng logic phía client." });
}
