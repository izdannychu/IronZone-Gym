import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, Edit3, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

const emptyFromFields = (fields) => Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? '']));

export const AdminResource = ({ title, columns, fields, load, createItem, updateItem, deleteItem, normalize = (row) => row }) => {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(() => emptyFromFields(fields));
  const [loading, setLoading] = useState(false);

  const resourceName = useMemo(() => title.replace(/^Quản lý\s+/i, ''), [title]);
  const modalTitle = useMemo(() => editing?.id ? `Cập nhật ${resourceName}` : `Thêm ${resourceName}`, [editing, resourceName]);
  const modalSubtitle = editing?.id
    ? `Chỉnh sửa bản ghi #${editing.id}. Các thay đổi sẽ được áp dụng ngay sau khi lưu.`
    : 'Nhập thông tin cho bản ghi mới. Vui lòng kiểm tra trước khi lưu.';

  const refresh = async () => {
    const res = await load();
    setRows(res.data.data.rows || res.data.data);
  };

  useEffect(() => { refresh().catch(() => toast.error('Không tải được dữ liệu')); }, []);

  const openCreate = () => {
    setEditing({});
    setForm(emptyFromFields(fields));
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm(normalize(row));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing?.id) await updateItem(editing.id, form);
      else await createItem(form);
      toast.success('Đã lưu thay đổi');
      setEditing(null);
      await refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không lưu được');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (row) => {
    if (!deleteItem) return;
    setLoading(true);
    try {
      await deleteItem(row.id);
      toast.success('Đã cập nhật trạng thái');
      await refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không xóa được');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-black">{title}</h1>
        {createItem && <Button onClick={openCreate}><Plus size={17} />Thêm mới</Button>}
      </div>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
            <tr>
              {columns.map((column) => <th key={column.key} className="p-4 text-left">{column.label}</th>)}
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-zinc-200 dark:border-zinc-800">
                {columns.map((column) => <td key={column.key} className="p-4">{column.render ? column.render(row) : row[column.key]}</td>)}
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {updateItem && <button title="Sửa" onClick={() => openEdit(row)} className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><Edit3 size={17} /></button>}
                    {deleteItem && <button title="Xóa/Ẩn" onClick={() => remove(row)} disabled={loading} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 size={17} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={modalTitle}
        subtitle={modalSubtitle}
        size="wide"
      >
        <form onSubmit={submit}>
          <div className="grid gap-x-4 gap-y-3 p-5 min-[560px]:grid-cols-2 sm:p-6 lg:grid-cols-3">
            {fields.map((field) => {
              const isUrl = ['avatar_url', 'image_url'].includes(field.name);

              return (
                <label key={field.name} className={isUrl ? 'min-[560px]:col-span-2' : 'block'}>
                  <span className="mb-1.5 block text-xs font-bold text-zinc-400">
                    {field.label}
                  </span>
                  {field.type === 'select' ? (
                    <select
                      className="input h-10 border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-primary"
                      value={form[field.name] ?? ''}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    >
                      {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      className="input h-20 resize-none border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-primary"
                      value={form[field.name] ?? ''}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    />
                  ) : (
                    <input
                      className="input h-10 border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-600 focus:border-primary"
                      type={field.type || 'text'}
                      value={form[field.name] ?? ''}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    />
                  )}
                </label>
              );
            })}
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-zinc-800 bg-zinc-950 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <button
              type="button"
              onClick={() => setForm(editing?.id ? normalize(editing) : emptyFromFields(fields))}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-zinc-500 hover:bg-white/5 hover:text-white"
            >
              <RotateCcw size={16} />
              Đặt lại
            </button>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1 border-zinc-700 bg-transparent py-2 text-white hover:border-zinc-500 sm:flex-none" onClick={() => setEditing(null)}>
                Hủy
              </Button>
              <Button loading={loading} className="flex-1 px-5 py-2 sm:flex-none">
                <Check size={17} />
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </section>
  );
};
