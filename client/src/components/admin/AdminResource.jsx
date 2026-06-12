import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

const emptyFromFields = (fields) => Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? '']));

export const AdminResource = ({ title, columns, fields, load, createItem, updateItem, deleteItem, normalize = (row) => row }) => {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(() => emptyFromFields(fields));
  const [loading, setLoading] = useState(false);

  const modalTitle = useMemo(() => editing?.id ? `Cập nhật ${title}` : `Thêm ${title}`, [editing, title]);

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
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={modalTitle}>
        <form onSubmit={submit} className="grid max-h-[70vh] gap-4 overflow-y-auto pr-1">
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="mb-1 block text-sm font-bold">{field.label}</span>
              {field.type === 'select' ? (
                <select className="input" value={form[field.name] ?? ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}>
                  {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea className="input min-h-24" value={form[field.name] ?? ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} />
              ) : (
                <input className="input" type={field.type || 'text'} value={form[field.name] ?? ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} />
              )}
            </label>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>Hủy</Button>
            <Button loading={loading}>Lưu</Button>
          </div>
        </form>
      </Modal>
    </section>
  );
};
