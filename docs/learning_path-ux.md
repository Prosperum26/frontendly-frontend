# Frontend Learning Path UX & Implementation Standard

Tài liệu này định nghĩa các tiêu chuẩn trải nghiệm người dùng (UX) và giải pháp kỹ thuật chi tiết phía Client-side (Frontend) áp dụng cho tính năng Bản đồ Lộ trình học tập.

### 1. Tự động cuộn màn hình (Auto-scroll)
* **Trải nghiệm người dùng (UX):** Khi người học truy cập trang Lộ trình, màn hình tự động cuộn mượt mà (Smooth Scroll) tập trung vào chặng/bài học đang học dở, giúp họ tiếp tục ngay mà không cần cuộn chuột tìm kiếm.
* **Giải pháp kỹ thuật (FE):**
    * Sau khi fetch thành công dữ liệu lộ trình từ API, sử dụng React `useEffect` quét qua danh sách để tìm Node đầu tiên có thuộc tính `status === 'in_progress'`.
    * Dùng React `useRef` gán vào phần tử đó và kích hoạt hàm `scrollIntoView({ behavior: 'smooth', block: 'center' })`.
    * *Tối ưu:* Bọc logic cuộn trong một `setTimeout (100-200ms)` để đảm bảo cây DOM đã được trình duyệt dựng xong hoàn toàn trước khi tính toán tọa độ cuộn màn hình.

### 2. Hiệu ứng Tương tác nhỏ (Micro-interactions & Connector Lines)
* **Trải nghiệm người dùng (UX):** Các nút bài học phản hồi sinh động khi di chuột qua, tạo cảm giác trực quan chuẩn game hóa. Các đường nối giữa các chặng phản ánh rõ ràng dòng chảy tiến độ.
* **Giải pháp kỹ thuật (FE):**
    * Sử dụng **Framer Motion** để tạo hiệu ứng hover phóng to nhẹ cho các Node khả dụng: `<motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} />`.
    * Xử lý CSS động cho các đường nối (Connector Lines) dựa trên trạng thái của chặng đích:
        * *Chặng đã xong (`completed`):* Đường kẻ màu sáng rực rỡ (glowing line hoặc màu xanh lá neon).
        * *Chặng đang/chưa học (`in_progress`/`available`):* Đường kẻ nét liền mang màu sắc thương hiệu (solid line).
        * *Chặng bị khóa (`locked`):* Đường kẻ nét đứt màu xám mờ (`border-dashed border-gray-400 opacity-40`).

### 3. Xử lý trạng thái bị khóa (Gating UI & Locked State UX)
* **Trải nghiệm người dùng (UX):** Khi bấm vào bài học bị khóa, người dùng sẽ nhận được tooltip chỉ dẫn thân thiện, kèm một nút "Học tiếp" tự động đưa tầm nhìn quay lại đúng vị trí họ đang học dở.
* **Giải pháp kỹ thuật (FE):**
    * Nếu Stage có thuộc tính `status === 'locked'`, áp dụng class CSS `cursor-not-allowed` và chặn hoàn toàn sự kiện click chuyển hướng bằng `e.preventDefault()`.
    * Khi hover hoặc click vào nút bị khóa này, hiển thị một Tooltip hoặc Popover cục bộ với nội dung: *"🔒 Chặng này đang khóa! Hãy hoàn thành các bài học trước để mở khóa nhé."*
    * Đặt một nút CTA nhỏ **"Học tiếp bài hiện tại"** nằm ngay trong Tooltip đó. Khi click, nút này sẽ gọi hàm cuộn màn hình mượt mà (hàm đã viết ở mục 1) đưa người dùng quay lại đúng Node đang có trạng thái `in_progress`.

### 4. Ghim cố định thanh Tiến độ Milestone (Sticky Progress)
* **Trải nghiệm người dùng (UX):** Khi mở panel chi tiết bài học của một Milestone, dù danh sách bài học có dài và phải cuộn xuống, thanh tiến độ tổng quát vẫn luôn hiển thị cố định giúp giữ vững động lực học tập.
* **Giải pháp kỹ thuật (FE):**
    * Đặt component thanh tiến độ tổng quát (Progress Bar) ở trên cùng của panel hiển thị (Sidebar/Modal).
    * Áp dụng thuộc tính CSS Sticky: `sticky top-0 z-10`.
    * *Lưu ý:* Đổ màu nền (background) đặc cho thanh tiến độ cố định này (không để trong suốt) để khi danh sách bài học phía dưới cuộn trượt lên, nội dung text không bị lem nhem hoặc đè lấp lẫn lộn vào chữ của thanh tiến độ.

### 5. Hiệu ứng tải trang mờ (Skeleton Loading Shimmer)
* **Trải nghiệm người dùng (UX):** Loại bỏ hoàn toàn các vòng xoay tròn (Loading Spinner) gây cảm giác ứng dụng bị chậm. Thay bằng các khối mờ chạy hiệu ứng sóng mô phỏng trước khung xương cấu trúc của bản đồ.
* **Giải pháp kỹ thuật (FE):**
    * Thiết kế một Component `RoadmapSkeleton` mô phỏng đúng bố cục (layout) của bản đồ lộ trình (gồm các khối tròn mờ đại diện cho Stage và các đường kẻ dọc mờ nối giữa chúng).
    * Áp dụng hiệu ứng sóng chạy qua bằng class `animate-pulse` của Tailwind CSS hoặc hiệu ứng nền Shimmer CSS custom.
    * Sử dụng trạng thái `isLoading` từ **TanStack Query** để điều khiển: Hiển thị `RoadmapSkeleton` khi dữ liệu đang trong trạng thái loading, và swap mượt mà sang component Bản đồ thật khi API trả về thành công.

### 6. Kiến trúc Tối ưu hóa nâng cao (Advanced FE Architecture)
* **Zustand Store:** Lưu trữ trạng thái bài học toàn cục (XP, Streak, Rank, ID bài học hiện tại). Tích hợp middleware `persist` đẩy dữ liệu vào `localStorage` phục vụ lưu trữ ngoại tuyến (Offline Persistence) nếu người dùng mất mạng đột ngột.
* **Debounce Scroll Progress:** Khi người dùng cuộn chuột (scroll) đọc trang lý thuyết dài, áp dụng hàm `debounce` (trễ 1 giây) để gom sự kiện cuộn lại trước khi gửi API cập nhật vị trí dòng đọc về server, tránh làm quá tải mạng.
* **BroadcastChannel API (Đồng bộ đa tab):** Khi người dùng mở song song Tab 1 (đàm làm bài) và Tab 2 (trang lộ trình). Ngay khi Tab 1 nộp bài thành công, một tín hiệu "hoàn thành" sẽ được phát qua BroadcastChannel để Tab 2 nghe thấy và tự động cập nhật đổi màu trạng thái Node sang `completed` ngay lập tức mà không cần F5.
* **Virtual Scrolling:** Áp dụng thư viện `@tanstack/react-virtual` để cấu hình trình duyệt chỉ render những thẻ Milestone thực sự xuất hiện trong khung nhìn (Viewport), giúp tối ưu bộ nhớ RAM khi lộ trình dài hàng trăm bài.