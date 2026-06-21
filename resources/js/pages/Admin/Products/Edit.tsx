import { Head, Link, useForm } from '@inertiajs/react';
import type { CategoryOption, SpringProduct, UnitOption } from '@/types/admin';

interface Props {
    product: SpringProduct;
    categories: CategoryOption[];
    units: UnitOption[];
}

export default function ProductEdit({ product, categories, units }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        category_id: product.categoryId ?? '',
        primary_unit_id: product.primaryUnitId,
        price: String(product.price),
        cost_price: product.costPrice !== null ? String(product.costPrice) : '',
        stock: String(product.stock),
        min_stock: String(product.minStock),
        barcode: product.barcode ?? '',
        image_url: product.imageUrl ?? '',
    });

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        put(`/admin/products/${product.id}`);
    };

    return (
        <>
            <Head title={`Sửa sản phẩm: ${product.name}`} />

            <div className="max-w-4xl space-y-6">
                <Link
                    href={`/admin/products/${product.id}`}
                    className="text-sm text-purple-600 hover:underline"
                >
                    &larr; Quay lại chi tiết
                </Link>

                <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-6">
                        Sửa sản phẩm: {product.name}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
                                Tên sản phẩm
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

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="category_id" className="block text-sm font-medium text-zinc-700 mb-1">
                                    Danh mục
                                </label>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                >
                                    <option value="">-- Không chọn --</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors?.category_id && (
                                    <p className="mt-1 text-xs text-red-600">{errors.category_id}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="primary_unit_id" className="block text-sm font-medium text-zinc-700 mb-1">
                                    Đơn vị tính
                                </label>
                                <select
                                    id="primary_unit_id"
                                    value={data.primary_unit_id}
                                    onChange={(e) => setData('primary_unit_id', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                >
                                    <option value="">-- Chọn đơn vị --</option>
                                    {units.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name}
                                        </option>
                                    ))}
                                </select>
                                {errors?.primary_unit_id && (
                                    <p className="mt-1 text-xs text-red-600">{errors.primary_unit_id}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-zinc-700 mb-1">
                                    Giá bán
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    min="1"
                                    step="any"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                                {errors?.price && (
                                    <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="cost_price" className="block text-sm font-medium text-zinc-700 mb-1">
                                    Giá vốn
                                </label>
                                <input
                                    id="cost_price"
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={data.cost_price}
                                    onChange={(e) => setData('cost_price', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                                {errors?.cost_price && (
                                    <p className="mt-1 text-xs text-red-600">{errors.cost_price}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-zinc-700 mb-1">
                                    Tồn kho
                                </label>
                                <input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                                {errors?.stock && (
                                    <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="min_stock" className="block text-sm font-medium text-zinc-700 mb-1">
                                    Tồn kho tối thiểu
                                </label>
                                <input
                                    id="min_stock"
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={data.min_stock}
                                    onChange={(e) => setData('min_stock', e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                                {errors?.min_stock && (
                                    <p className="mt-1 text-xs text-red-600">{errors.min_stock}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="barcode" className="block text-sm font-medium text-zinc-700 mb-1">
                                Mã vạch
                            </label>
                            <input
                                id="barcode"
                                type="text"
                                maxLength={100}
                                value={data.barcode}
                                onChange={(e) => setData('barcode', e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            {errors?.barcode && (
                                <p className="mt-1 text-xs text-red-600">{errors.barcode}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="image_url" className="block text-sm font-medium text-zinc-700 mb-1">
                                URL hình ảnh
                            </label>
                            <input
                                id="image_url"
                                type="text"
                                maxLength={500}
                                value={data.image_url}
                                onChange={(e) => setData('image_url', e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                            {errors?.image_url && (
                                <p className="mt-1 text-xs text-red-600">{errors.image_url}</p>
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
                                href={`/admin/products/${product.id}`}
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
