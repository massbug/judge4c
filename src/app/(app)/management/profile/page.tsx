"use client"
export default function ProfilePage() {
  return (
    <div className="h-full w-full p-6">
      <div className="h-full w-full bg-white shadow-lg rounded-xl p-8 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">登录信息</h1>

        <div className="flex items-center space-x-6 mb-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              👤
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold">张三</h2>
            <p className="text-gray-500">角色：管理员</p>
            <p className="text-gray-500">最后登录时间：2025-04-05 14:30</p>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700">用户名</label>
            <p className="mt-1 text-lg font-medium text-gray-900">zhangsan123</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">邮箱地址</label>
            <p className="mt-1 text-lg font-medium text-gray-900">zhangsan@example.com</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">注册时间</label>
            <p className="mt-1 text-lg font-medium text-gray-900">2022-03-12</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">状态</label>
            <p className="mt-1 text-lg font-medium text-green-600">已激活</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            编辑信息
          </button>
        </div>
      </div>
    </div>
  );
}