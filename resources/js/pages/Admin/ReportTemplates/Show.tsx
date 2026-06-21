import { Head, Link } from '@inertiajs/react';
import type { ReportTemplate, ReportTemplateField } from '@/types/admin';

interface Props {
    template: ReportTemplate;
}

const typeLabels: Record<string, string> = {
    text: 'Văn bản',
    number: 'Số',
    date: 'Ngày tháng',
    boolean: 'Có/Không',
};

const alignmentLabels: Record<string, string> = {
    left: 'Trái',
    center: 'Giữa',
    right: 'Phải',
};

function FieldRow({ field, index }: { field: ReportTemplateField; index: number }) {
    return (
        <tr className="border-b border-zinc-100 transition-colors hover:bg-zinc-50">
            <td className="px-4 py-2.5 text-sm text-zinc-500">{index + 1}</td>
            <td className="px-4 py-2.5 text-sm font-mono text-zinc-800">{field.key}</td>
            <td className="px-4 py-2.5 text-sm text-zinc-800">{field.label}</td>
            <td className="px-4 py-2.5 text-sm text-zinc-600">{typeLabels[field.type] ?? field.type}</td>
            <td className="px-4 py-2.5 text-sm text-zinc-600">{field.width ?? '—'}</td>
            <td className="px-4 py-2.5 text-sm text-zinc-600">{alignmentLabels[field.alignment ?? ''] ?? '—'}</td>
        </tr>
    );
}

export default function ReportTemplateShow({ template }: Props) {
    return (
        <>
            <Head title={template.name} />

            <div className="max-w-4xl space-y-6">
                <Link
                    href="/admin/report-templates"
                    className="text-sm text-purple-600 hover:underline"
                >
                    &larr; Quay lại danh sách
                </Link>

                <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">
                                {template.name}
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                {template.circularRef}
                            </p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                            v{template.version}
                        </span>
                    </div>

                    {template.description && (
                        <div className="mb-6 rounded-lg bg-zinc-50 p-4">
                            <p className="text-sm text-zinc-600">{template.description}</p>
                        </div>
                    )}

                    <div className="mb-4 flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-700">Tình trạng:</span>
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                template.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}
                        >
                            {template.isActive ? 'Đang dùng' : 'Ngừng dùng'}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-zinc-700 mb-3">
                            Cấu trúc trường
                        </h3>
                        <div className="overflow-x-auto rounded-lg border border-zinc-200">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-zinc-50 border-b border-zinc-200">
                                        <th className="px-4 py-2.5 text-left font-medium text-zinc-600">STT</th>
                                        <th className="px-4 py-2.5 text-left font-medium text-zinc-600">Key</th>
                                        <th className="px-4 py-2.5 text-left font-medium text-zinc-600">Nhãn hiển thị</th>
                                        <th className="px-4 py-2.5 text-left font-medium text-zinc-600">Kiểu dữ liệu</th>
                                        <th className="px-4 py-2.5 text-left font-medium text-zinc-600">Độ rộng</th>
                                        <th className="px-4 py-2.5 text-left font-medium text-zinc-600">Căn lề</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(template.fields ?? []).map((field, index) => (
                                        <FieldRow key={field.key} field={field} index={index} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <Link
                            href={`/admin/report-templates/${template.id}/edit`}
                            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                        >
                            Sửa mẫu báo cáo
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
