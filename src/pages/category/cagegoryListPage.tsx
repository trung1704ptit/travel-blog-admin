import { generateSlug, generateUniqueSlug } from '@/lib/utils';
import { Category, CreateCategoryRequest, categoryService } from '@/services';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { useEffect, useState } from 'react';

const { Title } = Typography;
const { TextArea } = Input;

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      message.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle create/update category
  const handleSubmit = async (values: CreateCategoryRequest) => {
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id!, values);
        message.success('Category updated successfully');
      } else {
        await categoryService.createCategory(values);
        message.success('Category created successfully');
      }
      setModalVisible(false);
      setEditingCategory(null);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      message.error('Failed to save category');
    }
  };

  // Handle delete category
  const handleDelete = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      message.error('Failed to delete category');
    }
  };

  // Open modal for create
  const handleCreate = () => {
    setEditingCategory(null);
    setModalVisible(true);
    form.resetFields();
  };

  // Open modal for edit
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setModalVisible(true);
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
      image: category.image,
      parent_id: category.parent_id,
      description: category.description,
    });
  };

  // Get available parent categories (all categories except current one if editing)
  const getAvailableParentCategories = () => {
    return categories?.filter((cat) => {
      // Exclude current category if editing to prevent self-parenting
      if (editingCategory && cat.id === editingCategory.id) {
        return false;
      }
      return true;
    });
  };

  // Get category name by ID
  const getCategoryName = (id: number) => {
    const category = categories?.find((cat) => cat.id === id);
    return category?.name || 'Unknown';
  };

  // Handle name change to auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;

    // Generate slug from the new name
    const newSlug = generateSlug(name);

    // Get existing slugs (excluding current category if editing)
    const existingSlugs = categories
      .filter((cat) => !editingCategory || cat.id !== editingCategory.id)
      .map((cat) => cat.slug);

    // Generate unique slug
    const uniqueSlug = generateUniqueSlug(newSlug, existingSlugs);

    // Update the slug field
    form.setFieldValue('slug', uniqueSlug);
  };

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Category) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{name}</div>
          {record.parent_id && (
            <Tag color="blue">
              Child of: {getCategoryName(record.parent_id)}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => (
        <code
          style={{
            backgroundColor: '#f5f5f5',
            padding: '2px 4px',
            borderRadius: 2,
          }}
        >
          {slug}
        </code>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Category) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Category Management
          </Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Category
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} categories`,
          }}
        />

        <Modal
          title={editingCategory ? 'Edit Category' : 'Create Category'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingCategory(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Category Name"
              rules={[
                { required: true, message: 'Please enter category name' },
              ]}
            >
              <Input
                placeholder="Enter category name"
                onChange={handleNameChange}
              />
            </Form.Item>

            <Form.Item
              name="slug"
              label="Slug"
              rules={[{ required: true, message: 'Please enter slug' }]}
              extra="Auto-generated from category name, but you can edit it manually"
            >
              <Input placeholder="Enter slug (e.g., travel-tips)" />
            </Form.Item>

            <Form.Item name="image" label="Image URL">
              <Input placeholder="Enter image URL" />
            </Form.Item>

            <Form.Item name="parent_id" label="Parent Category">
              <Select
                placeholder="Select parent category (optional)"
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={getAvailableParentCategories()?.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
              />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <TextArea rows={4} placeholder="Enter category description" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    setEditingCategory(null);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default CategoryPage;
