import Link from "next/link";
export default function Home() {
  return (
    <div className="p-6 h-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-orange-600 bg-orange-100 border-l-4 border-orange-500 p-4 -m-6 mb-6 rounded-t-lg">
        Academic Information
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Cột 1: Registration/Application */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-blue-800 border-b-2 pb-2 mb-4">
            Registration/Application (Thủ tục/đơn từ)
          </h2>
          <ul className="space-y-2 list-disc list-inside text-gray-700">
            <li>
              <Link
                href="/registration/suspend-repeated"
                className="hover:underline text-blue-600"
              >
                Suspend one semester to take repeated course | Cancel
              </Link>
            </li>
            <li>
              <Link
                href="/registration/suspend-semester"
                className="hover:underline text-blue-600"
              >
                Suspend one semester | Cancel
              </Link>
            </li>
            <li>
              <Link
                href="/registration/move-out-class"
                className="hover:underline text-blue-600"
              >
                Move out class (Xin chuyển lớp/Tạm ngưng môn)
              </Link>
            </li>
            <li>
              <Link
                href="/registration/register-abroad"
                className="hover:underline text-blue-600"
              >
                Đăng ký học môn học tại nước ngoài
              </Link>
            </li>
          </ul>
        </div>
        {/* Cột 2: Information Access */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-blue-800 border-b-2 pb-2 mb-4">
            Information Access (Tra cứu thông tin)
          </h2>
          <ul className="space-y-2 list-disc list-inside text-gray-700">
            <li>
              <Link
                href="/info/timetable"
                className="hover:underline text-blue-600"
              >
                University timetable (Lịch học)
              </Link>
            </li>
            <li>
              <Link href="/subjects" className="hover:underline text-blue-600">
                Curriculum (Khung chương trình)
              </Link>
            </li>
            <li>
              <Link
                href="/info/weekly-timetable"
                className="hover:underline text-blue-600"
              >
                Weekly timetable (Thời khóa biểu từng tuần)
              </Link>
            </li>
            <li>
              <Link
                href="/authentication"
                className="hover:underline text-blue-600"
              >
                View exam schedule (Xem lịch thi)
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="hover:underline text-blue-600"
              >
                User Profile (Thông tin cá nhân)
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
