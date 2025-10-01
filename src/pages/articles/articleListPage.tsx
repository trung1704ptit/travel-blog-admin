import { Article, articleService } from '@/services';
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
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ArticleListPage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');

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

  useEffect(() => {
    fetchArticles();
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
              title: article.title,
              slug: article.slug,
              content: article.content,
              short_description: article.short_description,
              meta_description: article.meta_description,
              keywords: article.keywords,
              categories: article.categories.map((cat) => ({ id: cat.id })),
              published: true,
              image: article.image,
              thumbnail: article.thumbnail,
              author: {
                id: article.author.id,
              },
            });
          case 'draft':
            return articleService.updateArticle(article.id, {
              title: article.title,
              slug: article.slug,
              content: article.content,
              short_description: article.short_description,
              meta_description: article.meta_description,
              keywords: article.keywords,
              categories: article.categories.map((cat) => ({ id: cat.id })),
              published: false,
              image: article.image,
              thumbnail: article.thumbnail,
              author: {
                id: article.author.id,
              },
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
            Article Management
          </Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Article
          </Button>
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
          dataSource={articles}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} articles`,
          }}
        />
      </Card>
    </div>
  );
};

export default ArticleListPage;
