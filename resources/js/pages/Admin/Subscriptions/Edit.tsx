import { Head, Link, useForm } from '@inertiajs/react';
import type { SubscriptionPlan } from '@/types/admin';
import { useState } from 'react';

interface Props {
    plan: SubscriptionPlan;
}

export default function SubscriptionEdit({ plan }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: plan.name,
        monthly_price: plan.monthlyPrice,
        annual_price: plan.annualPrice,
        currency: plan.currency,
        features: plan.features,
        is_active: plan.isActive,
        sort_order: plan.sortOrder,
    });

    const [featureInputs, setFeatureInputs] = useState<string[]>(plan.features);

    const handleFeatureChange = (index: number, value: string) => {
        const updated = [...featureInputs];
        updated[index] = value;
        setFeatureInputs(updated);
        setData('features', updated);
    };

    const addFeature = () => {
        const updated = [...featureInputs, ''];
        setFeatureInputs(updated);
        setData('features', updated);
    };

    const removeFeature = (index: number) => {
        const updated = featureInputs.filter((_, i) => i !== index);
        setFeatureInputs(updated);
        setData('features', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/subscriptions/${plan.id}`);
    };

    return (
        <>
            <Head title={`Chỉnh sửa gói: ${plan.name}`} />

            <div className="max-w-2xl space-y-6">
                <Link
                    href="/admin/subscriptions"
                    className="text-sm text-purple-600 hover:underline"
                >
                    &larr; Quay lại danh sách
                </Link>

                <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-6">
                        Chỉnh sửa gói: {plan.name}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-zinc-700 mb-1"
                            >
                                Tên gói
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                disabled
                                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="monthly_price"
                                className="block text-sm font-medium text-zinc-700 mb-1"
                            >
                                Giá hàng tháng
                            </label>
                            <input
                                id="monthly_price"
                                type="number"
                                step={1000}
                                min={0}
                                value={data.monthly_price}
                                onChange={(e) =>
                                    setData('monthly_price', Number(e.target.value))
                                }
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            {errors?.monthly_price && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.monthly_price}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="annual_price"
                                className="block text-sm font-medium text-zinc-700 mb-1"
                            >
                                Giá hàng năm
                            </label>
                            <input
                                id="annual_price"
                                type="number"
                                step={1000}
                                min={0}
                                value={data.annual_price}
                                onChange={(e) =>
                                    setData('annual_price', Number(e.target.value))
                                }
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            {errors?.annual_price && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.annual_price}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="currency"
                                className="block text-sm font-medium text-zinc-700 mb-1"
                            >
                                Tiền tệ
                            </label>
                            <select
                                id="currency"
                                value={data.currency}
                                onChange={(e) =>
                                    setData('currency', e.target.value)
                                }
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="VND">VND</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                            {errors?.currency && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.currency}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Tính năng
                            </label>
                            <div className="space-y-2">
                                {featureInputs.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) =>
                                                handleFeatureChange(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="rounded-lg px-2 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addFeature}
                                className="mt-2 text-sm text-purple-600 hover:underline"
                            >
                                + Thêm tính năng
                            </button>
                            {errors?.features && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.features}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="is_active"
                                className="text-sm font-medium text-zinc-700"
                            >
                                Đang hoạt động
                            </label>
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData('is_active', e.target.checked)
                                }
                                className="rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="sort_order"
                                className="block text-sm font-medium text-zinc-700 mb-1"
                            >
                                Thứ tự hiển thị
                            </label>
                            <input
                                id="sort_order"
                                type="number"
                                min={0}
                                value={data.sort_order}
                                onChange={(e) =>
                                    setData('sort_order', Number(e.target.value))
                                }
                                className="w-32 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            {errors?.sort_order && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.sort_order}
                                </p>
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
                                href="/admin/subscriptions"
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
