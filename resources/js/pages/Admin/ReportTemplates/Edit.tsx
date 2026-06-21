import { Head, Link, useForm } from '@inertiajs/react';
import type { ReportTemplate, ReportTemplateField } from '@/types/admin';
import { useState } from 'react';

interface Props {
    template: ReportTemplate;
}

const fieldTypes = ['text', 'number', 'date', 'boolean'] as const;
const alignments = ['left', 'center', 'right'] as const;

function FieldRow({
    field,
    index,
    onChange,
    onRemove,
}: {
    field: ReportTemplateField;
    index: number;
    onChange: (index: number, updated: ReportTemplateField) => void;
    onRemove: (index: number) => void;
}) {
    return (
        <div className="flex items-start gap-2 rounded-lg border border-zinc-200 p-3">
            <div className="grid flex-1 grid-cols-5 gap-2">
                <div>
                    <label className="block text-xs text-zinc-500 mb-1">Khóa</label>
                    <input
                        type="text"
                        value={field.key}
                        onChange={(e) =>
                            onChange(index, { ...field, key: e.target.value })
                        }
                        className="w-full rounded border border-zinc-200 px-2 py-1.5 text-xs text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <label className="block text-xs text-zinc-500 mb-1">Nhãn hiển thị</label>
                    <input
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                            onChange(index, { ...field, label: e.target.value })
                        }
                        className="w-full rounded border border-zinc-200 px-2 py-1.5 text-xs text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <label className="block text-xs text-zinc-500 mb-1">Kiểu dữ liệu</label>
                    <select
                        value={field.type}
                        onChange={(e) =>
                            onChange(index, {
                                ...field,
                                type: e.target.value as ReportTemplateField['type'],
                            })
                        }
                        className="w-full rounded border border-zinc-200 px-2 py-1.5 text-xs text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    >
                        {fieldTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-zinc-500 mb-1">Độ rộng</label>
                    <input
                        type="number"
                        value={field.width ?? ''}
                        onChange={(e) =>
                            onChange(index, {
                                ...field,
                                width: e.target.value === '' ? null : Number(e.target.value),
                            })
                        }
                        placeholder="120"
                        className="w-full rounded border border-zinc-200 px-2 py-1.5 text-xs text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <label className="block text-xs text-zinc-500 mb-1">Căn lề</label>
                    <select
                        value={field.alignment ?? ''}
                        onChange={(e) =>
                            onChange(index, {
                                ...field,
                                alignment: (e.target.value || null) as ReportTemplateField['alignment'],
                            })
                        }
                        className="w-full rounded border border-zinc-200 px-2 py-1.5 text-xs text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    >
                        <option value="">—</option>
                        {alignments.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="mt-5 rounded px-2 py-1.5 text-xs text-red-600 hover:bg-red-50"
            >
                &times;
            </button>
        </div>
    );
}

export default function ReportTemplateEdit({ template }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: template.name,
        description: template.description ?? '',
        circular_ref: template.circularRef,
        version: template.version,
        is_active: template.isActive,
        fields: template.fields,
    });

    const [fieldRows, setFieldRows] = useState<ReportTemplateField[]>(template.fields);

    const handleFieldChange = (index: number, updated: ReportTemplateField) => {
        const updatedRows = fieldRows.map((f, i) => (i === index ? updated : f));
        setFieldRows(updatedRows);
        setData('fields', updatedRows);
    };

    const addField = () => {
        const newField: ReportTemplateField = {
            key: '',
            label: '',
            type: 'text',
            width: null,
            alignment: null,
        };
        const updated = [...fieldRows, newField];
        setFieldRows(updated);
        setData('fields', updated);
    };

    const removeField = (index: number) => {
        const updated = fieldRows.filter((_, i) => i !== index);
        setFieldRows(updated);
        setData('fields', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/report-templates/${template.id}`);
    };

    return (
        <>
            <Head title={`Sửa mẫu báo cáo`} />

            <div className="max-w-4xl space-y-6">
                <Link
                    href="/admin/report-templates"
                    className="text-sm text-purple-600 hover:underline"
                >
                    &larr; Quay lại danh sách
                </Link>

                <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-6">
                        Sửa mẫu báo cáo: {template.name}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-zinc-700 mb-1"
                            >
                                Tên báo cáo
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            {errors?.name && (
                                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-zinc-700 mb-1"
                            >
                                Mô tả
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            {errors?.description && (
                                <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="circular_ref"
                                    className="block text-sm font-medium text-zinc-700 mb-1"
                                >
                                    Thông tư tham chiếu
                                </label>
                                <input
                                    id="circular_ref"
                                    type="text"
                                    value={data.circular_ref}
                                    onChange={(e) => setData('circular_ref', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                                {errors?.circular_ref && (
                                    <p className="mt-1 text-xs text-red-600">{errors.circular_ref}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="version"
                                    className="block text-sm font-medium text-zinc-700 mb-1"
                                >
                                    Phiên bản
                                </label>
                                <input
                                    id="version"
                                    type="text"
                                    value={data.version}
                                    onChange={(e) => setData('version', e.target.value)}
                                    placeholder="1.0"
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                                {errors?.version && (
                                    <p className="mt-1 text-xs text-red-600">{errors.version}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="is_active"
                                className="text-sm font-medium text-zinc-700"
                            >
                                Đang sử dụng
                            </label>
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Cấu trúc trường
                            </label>
                            <div className="space-y-2">
                                {fieldRows.map((field, index) => (
                                    <FieldRow
                                        key={index}
                                        field={field}
                                        index={index}
                                        onChange={handleFieldChange}
                                        onRemove={removeField}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addField}
                                className="mt-2 text-sm text-purple-600 hover:underline"
                            >
                                + Thêm trường
                            </button>
                            {errors?.fields && (
                                <p className="mt-1 text-xs text-red-600">{errors.fields}</p>
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
                                href="/admin/report-templates"
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
