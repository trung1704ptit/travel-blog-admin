import { Article, Category, articleService, categoryService } from '@/services';
import {
  CheckOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Image,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;

const ArticleListPage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [pageSize, setPageSize] = useState<number>(100);

  // Fetch articles
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await articleService.getArticles();
      setArticles(data);
    } catch (error) {
      message.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      message.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  // Handle delete article
  const handleDelete = async (id: string) => {
    try {
      await articleService.deleteArticle(id);
      message.success('Article deleted successfully');
      fetchArticles();
    } catch (error) {
      message.error('Failed to delete article');
    }
  };

  // Navigate to create article page
  const handleCreate = () => {
    navigate('/articles/create');
  };

  // Navigate to edit article page
  const handleEdit = (article: Article) => {
    navigate(`/articles/edit/${article.slug}`);
  };

  // Handle preview article
  const handlePreview = (article: Article) => {
    navigate(`/articles/preview/${article.slug}`);
  };

  // Handle row selection
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    newSelectedRows: Article[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedArticles(newSelectedRows);
  };

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  // Handle bulk action
  const handleBulkAction = async () => {
    if (!bulkAction) {
      message.warning('Please select an action');
      return;
    }

    if (selectedArticles.length === 0) {
      message.warning('Please select articles to perform the action');
      return;
    }

    setLoading(true);
    try {
      const promises = selectedArticles.map(async (article) => {
        switch (bulkAction) {
          case 'publish':
            return articleService.updateArticle(article.id, {
              published: true,
            });
          case 'draft':
            return articleService.updateArticle(article.id, {
              published: false,
            });
          case 'delete':
            return articleService.deleteArticle(article.id);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);

      const actionText =
        bulkAction === 'delete'
          ? 'deleted'
          : bulkAction === 'publish'
          ? 'published'
          : 'moved to draft';

      message.success(
        `${selectedArticles.length} article(s) ${actionText} successfully`
      );

      // Clear selection and refresh data
      setSelectedRowKeys([]);
      setSelectedArticles([]);
      setBulkAction('');
      fetchArticles();
    } catch (error) {
      console.log(error);
      message.error('Failed to perform bulk action');
    } finally {
      setLoading(false);
    }
  };

  // Bulk action items
  const bulkActionItems = [
    {
      key: 'publish',
      label: 'Publish',
      icon: <CheckOutlined />,
    },
    {
      key: 'draft',
      label: 'Move to Draft',
      icon: <EditOutlined />,
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  // Table columns
  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 80,
      render: (thumbnail: string) => (
        <Image
          src={thumbnail}
          alt="Article thumbnail"
          width={50}
          height={50}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="https://placehold.co/200x150"
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Article) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{title}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            by {record.author.name}
          </div>
          {record?.categories?.length > 0 && (
            <div style={{ marginTop: 4 }}>
              {record.categories.map((cat) => (
                <Tag key={cat.id} color="blue">
                  {cat.name}
                </Tag>
              ))}
            </div>
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
      title: 'Status',
      dataIndex: 'published',
      key: 'published',
      width: 100,
      render: (published: boolean) => (
        <Tag color={published ? 'green' : 'orange'}>
          {published ? 'Published' : 'Draft'}
        </Tag>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      width: 80,
      render: (views: number) => views || 0,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Article) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            Preview
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this article?"
            onConfirm={() => handleDelete(record.id)}
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

  // Filter articles based on search text and category
  const filteredArticles = articles.filter((article) => {
    // Search filter
    const searchLower = searchText.toLowerCase();
    const matchesSearch =
      !searchText ||
      article.title.toLowerCase().includes(searchLower) ||
      article.slug.toLowerCase().includes(searchLower) ||
      article.author.name.toLowerCase().includes(searchLower) ||
      article.categories?.some((cat) =>
        cat.name.toLowerCase().includes(searchLower)
      ) ||
      article.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

    // Category filter
    const matchesCategory =
      !selectedCategory ||
      article.categories?.some((cat) => cat.id === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <Card>
        <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
          <Title level={3} className="!m-0">
            Article Management
          </Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Article
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-4 flex-wrap">
          <Search
            placeholder="Search articles by title, author, or tags..."
            allowClear
            enterButton
            size="middle"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => setSearchText(value)}
            style={{ maxWidth: 300 }}
          />
          <Select
            placeholder="Filter by category"
            allowClear
            showSearch
            size="middle"
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            style={{ width: 250 }}
          />
        </div>

        {/* Bulk Actions */}
        {selectedRowKeys.length > 0 && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              backgroundColor: '#f0f8ff',
              borderRadius: 6,
              border: '1px solid #d6e4ff',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ color: '#1890ff', fontWeight: 500 }}>
              {selectedRowKeys.length} article(s) selected
            </span>
            <Dropdown
              menu={{
                items: bulkActionItems,
                onClick: ({ key }) => setBulkAction(key),
              }}
              trigger={['click']}
            >
              <Button>
                {bulkAction
                  ? bulkActionItems.find((item) => item.key === bulkAction)
                      ?.label
                  : 'Bulk Actions'}{' '}
                <DownOutlined />
              </Button>
            </Dropdown>
            <Button
              type="primary"
              onClick={handleBulkAction}
              disabled={!bulkAction}
            >
              Apply
            </Button>
            <Button
              onClick={() => {
                setSelectedRowKeys([]);
                setSelectedArticles([]);
                setBulkAction('');
              }}
            >
              Cancel
            </Button>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={filteredArticles}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['50', '100', '150', '200'],
            onShowSizeChange: (current, size) => setPageSize(size),
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} articles`,
          }}
        />
      </Card>
    </div>
  );
};

export default ArticleListPage;
