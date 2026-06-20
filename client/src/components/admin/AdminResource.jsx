import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, Edit3, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';

const emptyFromFields = (fields) => Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? '']));
const fieldBaseClass = 'admin-dialog-field w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-sm font-semibold text-zinc-100 shadow-inner shadow-black/30 outline-none placeholder:text-zinc-600 hover:border-white/20 focus:border-primary focus:ring-4 focus:ring-primary/10';
const labelClass = 'mb-2 flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.08em] text-zinc-400';
const optionClass = 'bg-zinc-950 text-zinc-100';

const serializeForm = (fields, form, editing) => Object.fromEntries(
  fields
    .filter((field) => !(editing?.id && field.createOnly) && !(!editing?.id && field.editOnly))
    .map((field) => {
      const value = form[field.name];
      if (field.type === 'number') return [field.name, value === '' ? null : Number(value)];
      if (field.type === 'select') {
        const option = field.options?.find((item) => String(item.value) === String(value));
        return [field.name, option ? option.value : value];
      }
      if (field.type === 'date') return [field.name, value || null];
      return [field.name, typeof value === 'string' ? value.trim() : value];
    }),
);

export const AdminResource = ({
  title,
  columns,
  fields,
  load,
  createItem,
  updateItem,
  deleteItem,
  normalize = (row) => row,
  getRowLabel = (row) => row.name || row.full_name || row.code || `#${row.id}`,
  deleteConfig = {},
  canDelete = () => true,
}) => {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [form, setForm] = useState(() => emptyFromFields(fields));
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const resourceName = useMemo(() => title.replace(/^Quản lý\s+/i, ''), [title]);
  const modalTitle = editing?.id ? `Cập nhật ${resourceName}` : `Thêm ${resourceName}`;
  const activeFields = fields.filter((field) => !(editing?.id && field.createOnly) && !(!editing?.id && field.editOnly));
  const deleteTitle = deleteConfig.title || `Xóa ${resourceName}`;
  const deleteDescription = pendingDelete
    ? (deleteConfig.description?.(pendingDelete)
      || `Bạn có chắc muốn xóa “${getRowLabel(pendingDelete)}”? Hành động này có thể ảnh hưởng đến dữ liệu liên quan.`)
    : '';

  const refresh = async () => {
    setFetching(true);
    try {
      const res = await load();
      setRows(res.data.data.rows || res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không tải được dữ liệu');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const openCreate = () => {
    setEditing({});
    setForm(emptyFromFields(fields));
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({ ...emptyFromFields(fields), ...normalize(row) });
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = serializeForm(fields, form, editing);
      const res = editing?.id
        ? await updateItem(editing.id, payload)
        : await createItem(payload);
      toast.success(res.data.message || 'Đã lưu thay đổi');
      setEditing(null);
      await refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không lưu được dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!deleteItem || !pendingDelete) return;
    setLoading(true);
    try {
      const res = await deleteItem(pendingDelete.id);
      toast.success(res.data.message || 'Đã cập nhật dữ liệu');
      setPendingDelete(null);
      await refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể thực hiện thao tác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Dữ liệu hệ thống</p>
          <h1 className="mt-2 text-3xl font-black">{title}</h1>
        </div>
        {createItem && <Button onClick={openCreate}><Plus size={17} />Thêm mới</Button>}
      </div>

      <div className="card mt-6 overflow-x-auto">
        {fetching ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <EmptyState title="Chưa có dữ liệu" subtitle="Không có bản ghi nào phù hợp để hiển thị." />
        ) : (
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                {columns.map((column) => <th key={column.key} className="p-4 text-left">{column.label}</th>)}
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-zinc-200 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-white/[0.03]">
                  {columns.map((column) => <td key={column.key} className="p-4">{column.render ? column.render(row) : row[column.key]}</td>)}
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {updateItem && (
                        <button title="Sửa" onClick={() => openEdit(row)} className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                          <Edit3 size={17} />
                        </button>
                      )}
                      {deleteItem && canDelete(row) && (
                        <button
                          title={deleteConfig.actionLabel || 'Xóa'}
                          onClick={() => setPendingDelete(row)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={Boolean(editing)}
        onClose={() => !loading && setEditing(null)}
        title={modalTitle}
        subtitle={editing?.id ? `Đang chỉnh sửa bản ghi #${editing.id}.` : 'Nhập đầy đủ các thông tin bắt buộc.'}
        size="wide"
      >
        <form onSubmit={submit} className="bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_34%),#090909]">
          <div className="grid gap-4 p-5 min-[560px]:grid-cols-2 sm:p-6 lg:grid-cols-3">
            {activeFields.map((field) => {
              const isWide = field.fullWidth || field.type === 'textarea' || ['avatar_url', 'image_url'].includes(field.name);
              return (
                <label
                  key={field.name}
                  className={`group rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 transition hover:border-white/10 hover:bg-white/[0.04] ${
                    isWide ? 'min-[560px]:col-span-2 lg:col-span-3' : 'block'
                  }`}
                >
                  <span className={labelClass}>
                    <span>{field.label}</span>
                    {field.required ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">Bắt buộc</span> : null}
                  </span>
                  {field.type === 'select' ? (
                    <select
                      className={`${fieldBaseClass} h-12 cursor-pointer pr-10`}
                      value={form[field.name] ?? ''}
                      onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                      required={field.required}
                    >
                      {field.placeholder && <option className={optionClass} value="">{field.placeholder}</option>}
                      {field.options?.map((option) => <option className={optionClass} key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      className={`${fieldBaseClass} min-h-28 resize-y leading-6`}
                      value={form[field.name] ?? ''}
                      onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  ) : (
                    <input
                      className={`${fieldBaseClass} h-12`}
                      type={field.type || 'text'}
                      value={form[field.name] ?? ''}
                      onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      minLength={field.minLength}
                      required={field.required}
                    />
                  )}
                </label>
              );
            })}
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-black/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <button
              type="button"
              onClick={() => setForm(editing?.id ? { ...emptyFromFields(fields), ...normalize(editing) } : emptyFromFields(fields))}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-zinc-500 hover:bg-white/5 hover:text-white"
            >
              <RotateCcw size={16} />
              Đặt lại
            </button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1 rounded-xl border-zinc-700 bg-zinc-950 py-3 text-white hover:border-zinc-500 sm:flex-none" onClick={() => setEditing(null)} disabled={loading}>
                Hủy
              </Button>
              <Button loading={loading} className="flex-1 rounded-xl px-5 py-3 sm:flex-none">
                <Check size={17} />
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={remove}
        loading={loading}
        title={deleteTitle}
        description={deleteDescription}
        confirmLabel={deleteConfig.confirmLabel || 'Xác nhận'}
        destructive={deleteConfig.destructive !== false}
      />
    </section>
  );
};
