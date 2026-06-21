import { Head, Link, useForm } from '@inertiajs/react';

export default function AnnouncementCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        message: '',
        audience: 'all',
        priority: 'normal',
        is_published: false,
        published_at: '',
        expires_at: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/announcements');
    };

    return (
        <>
            <Head title="Tạo thông báo" />

            <div className="max-w-4xl space-y-6">
                <Link
                    href="/admin/announcements"
                    className="text-sm text-purple-600 hover:underline"
                >
                    &larr; Quay lại danh sách
                </Link>

                <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-6">
                        Tạo thông báo mới
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-zinc-700 mb-1">
                                Tiêu đề
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            {errors?.title && (
                                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-1">
                                Nội dung
                            </label>
                            <textarea
                                id="message"
                                rows={5}
                                maxLength={2000}
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            <p className="mt-1 text-xs text-zinc-400 text-right">
                                {data.message.length}/2000
                            </p>
                            {errors?.message && (
                                <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="audience" className="block text-sm font-medium text-zinc-700 mb-1">
                                    Đối tượng
                                </label>
                                <select
                                    id="audience"
                                    value={data.audience}
                                    onChange={(e) => setData('audience', e.target.value as 'all' | 'owners' | 'employees')}
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="owners">Chủ hộ kinh doanh</option>
                                    <option value="employees">Nhân viên</option>
                                </select>
                                {errors?.audience && (
                                    <p className="mt-1 text-xs text-red-600">{errors.audience}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-zinc-700 mb-1">
                                    Độ ưu tiên
                                </label>
                                <select
                                    id="priority"
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value as 'normal' | 'high' | 'urgent')}
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                >
                                    <option value="normal">Thường</option>
                                    <option value="high">Cao</option>
                                    <option value="urgent">Khẩn cấp</option>
                                </select>
                                {errors?.priority && (
                                    <p className="mt-1 text-xs text-red-600">{errors.priority}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <label htmlFor="is_published" className="text-sm font-medium text-zinc-700">
                                Xuất bản ngay
                            </label>
                            <input
                                id="is_published"
                                type="checkbox"
                                checked={data.is_published}
                                onChange={(e) => setData('is_published', e.target.checked)}
                                className="rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                            />
                        </div>

                        {data.is_published && (
                            <div>
                                <label htmlFor="published_at" className="block text-sm font-medium text-zinc-700 mb-1">
                                    Thời gian gửi
                                </label>
                                <input
                                    id="published_at"
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                                {errors?.published_at && (
                                    <p className="mt-1 text-xs text-red-600">{errors.published_at}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label htmlFor="expires_at" className="block text-sm font-medium text-zinc-700 mb-1">
                                Hết hạn
                            </label>
                            <input
                                id="expires_at"
                                type="datetime-local"
                                value={data.expires_at}
                                onChange={(e) => setData('expires_at', e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            {errors?.expires_at && (
                                <p className="mt-1 text-xs text-red-600">{errors.expires_at}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                            >
                                {processing ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                            <Link
                                href="/admin/announcements"
                                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                            >
                                Hủy
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
