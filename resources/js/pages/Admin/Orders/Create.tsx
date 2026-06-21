/**
 * Orders/Create.tsx — Order create form.
 *
 * Snake_case field names (product_id, unit_price, customer_id) so Laravel
 * validation matches. Controller converts to camelCase before forwarding
 * to Spring Boot.
 */
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { SpringProduct } from '@/types/admin';
import type { CreateOrderFormData } from '@/types/admin';

interface CustomerOption {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
}

interface Props {
    products: { data?: SpringProduct[] } | SpringProduct[];
    customers: { data?: CustomerOption[] } | CustomerOption[];
    auth: { user: { id: string; email: string; name: string; role: string } };
    [key: string]: unknown;
}

function formatCurrency(n: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

function unwrap<T>(payload: { data?: T[] } | T[] | null | undefined): T[] {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    return [];
}

function getError(errors: Record<string, string | string[]> | undefined, key: string): string | null {
    if (!errors) return null;
    const value = errors[key];
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
}

function getItemError(
    errors: Record<string, string | string[]> | undefined,
    key: string,
): string | null {
    if (!errors) return null;
    const value = errors[key];
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
}

export default function OrderCreate() {
    const { products, customers, auth: _auth } = usePage<Props>().props;
    const productList = unwrap(products);
    const customerList = unwrap(customers);

    const { data, setData, post, processing, errors } = useForm<CreateOrderFormData>({
        status: 'DRAFT',
        customer_id: null,
        notes: '',
        items: [{ product_id: '', quantity: 1, unit_price: 0 }],
    });

    const addItem = (): void => {
        setData('items', [...data.items, { product_id: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index: number): void => {
        if (data.items.length <= 1) return;
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );
    };

    const updateItem = (index: number, patch: Partial<CreateOrderFormData['items'][number]>): void => {
        setData(
            'items',
            data.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
        );
    };

    const onProductChange = (index: number, productId: string): void => {
        const product = productList.find((p) => p.id === productId);
        updateItem(index, {
            product_id: productId,
            unit_price: product ? product.price : 0,
        });
    };

    const subtotalOf = (item: CreateOrderFormData['items'][number]): number => {
        const q = Number(item.quantity) || 0;
        const p = Number(item.unit_price) || 0;
        return q * p;
    };

    const grandTotal: number = data.items.reduce((sum, item) => sum + subtotalOf(item), 0);

    const itemsError = getError(errors, 'items');

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        post('/admin/orders');
    };

    return (
        <>
            <Head title="Tạo đơn hàng" />

            <div className="max-w-4xl space-y-6">
                <Link href="/admin/orders" className="text-sm text-purple-600 hover:underline">
                    &larr; Quay lại danh sách
                </Link>

                <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-6">Tạo đơn hàng mới</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-zinc-700 mb-1"
                                >
                                    Trạng thái
                                </label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData('status', e.target.value as 'DRAFT' | 'CONFIRMED')
                                    }
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                >
                                    <option value="DRAFT">DRAFT — Lưu nháp</option>
                                    <option value="CONFIRMED">CONFIRMED — Xác nhận (trừ kho)</option>
                                </select>
                                {getError(errors, 'status') && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {getError(errors, 'status')}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="customer_id"
                                    className="block text-sm font-medium text-zinc-700 mb-1"
                                >
                                    Khách hàng
                                </label>
                                <select
                                    id="customer_id"
                                    value={data.customer_id ?? ''}
                                    onChange={(e) =>
                                        setData(
                                            'customer_id',
                                            e.target.value === '' ? null : e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                >
                                    <option value="">— Khách lẻ —</option>
                                    {customerList.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                            {c.phone ? ` — ${c.phone}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {getError(errors, 'customer_id') && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {getError(errors, 'customer_id')}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="notes"
                                className="block text-sm font-medium text-zinc-700 mb-1"
                            >
                                Ghi chú
                            </label>
                            <textarea
                                id="notes"
                                rows={3}
                                maxLength={1000}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            <p className="mt-1 text-xs text-zinc-400 text-right">
                                {data.notes.length}/1000
                            </p>
                            {getError(errors, 'notes') && (
                                <p className="mt-1 text-xs text-red-600">
                                    {getError(errors, 'notes')}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-zinc-700">Sản phẩm</h3>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100"
                                >
                                    + Thêm dòng
                                </button>
                            </div>

                            {itemsError && (
                                <p className="mb-2 text-xs text-red-600">{itemsError}</p>
                            )}

                            <div className="space-y-3">
                                {data.items.map((item, index) => {
                                    const productError = getItemError(
                                        errors,
                                        `items.${index}.product_id`,
                                    );
                                    const quantityError = getItemError(
                                        errors,
                                        `items.${index}.quantity`,
                                    );
                                    const unitPriceError = getItemError(
                                        errors,
                                        `items.${index}.unit_price`,
                                    );
                                    return (
                                        <div
                                            key={index}
                                            className="grid grid-cols-12 gap-2 items-end rounded-lg border border-zinc-200 p-3"
                                        >
                                            <div className="col-span-12 md:col-span-6">
                                                <label
                                                    htmlFor={`product-${index}`}
                                                    className="block text-xs font-medium text-zinc-600 mb-1"
                                                >
                                                    Sản phẩm
                                                </label>
                                                <select
                                                    id={`product-${index}`}
                                                    value={item.product_id}
                                                    onChange={(e) =>
                                                        onProductChange(index, e.target.value)
                                                    }
                                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                                >
                                                    <option value="">— Chọn sản phẩm —</option>
                                                    {productList.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.name} ({formatCurrency(p.price)})
                                                        </option>
                                                    ))}
                                                </select>
                                                {productError && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {productError}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="col-span-5 md:col-span-2">
                                                <label
                                                    htmlFor={`quantity-${index}`}
                                                    className="block text-xs font-medium text-zinc-600 mb-1"
                                                >
                                                    SL
                                                </label>
                                                <input
                                                    id={`quantity-${index}`}
                                                    type="number"
                                                    min="0.001"
                                                    step="0.001"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItem(index, {
                                                            quantity: Number(e.target.value),
                                                        })
                                                    }
                                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                                />
                                                {quantityError && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {quantityError}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="col-span-5 md:col-span-2">
                                                <label
                                                    htmlFor={`unit_price-${index}`}
                                                    className="block text-xs font-medium text-zinc-600 mb-1"
                                                >
                                                    Đơn giá
                                                </label>
                                                <input
                                                    id={`unit_price-${index}`}
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={item.unit_price}
                                                    onChange={(e) =>
                                                        updateItem(index, {
                                                            unit_price: Number(e.target.value),
                                                        })
                                                    }
                                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                                />
                                                {unitPriceError && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {unitPriceError}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="col-span-12 md:col-span-1 text-right">
                                                <p className="text-xs text-zinc-400 mb-1">T.Tiền</p>
                                                <p className="text-sm font-medium text-zinc-900">
                                                    {formatCurrency(subtotalOf(item))}
                                                </p>
                                            </div>

                                            <div className="col-span-12 md:col-span-1 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    disabled={data.items.length <= 1}
                                                    className="rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-4">
                            <span className="text-sm text-zinc-500">Tổng cộng:</span>
                            <span className="text-xl font-bold text-zinc-900">
                                {formatCurrency(grandTotal)}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                            >
                                {processing ? 'Đang tạo...' : 'Tạo đơn hàng'}
                            </button>
                            <Link
                                href="/admin/orders"
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
