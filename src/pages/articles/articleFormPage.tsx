import { generateSlug, generateUniqueSlug } from '@/lib/utils';
import {
  Article,
  Category,
  CreateArticleRequest,
  articleService,
  categoryService,
} from '@/services';
import {
  ArrowLeftOutlined,
  EyeOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;
const { TextArea } = Input;

const ArticleFormPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const isEditMode = Boolean(slug);

  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      message.error('Failed to fetch categories');
    }
  };

  // Fetch article for editing
  const fetchArticle = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      // First get all articles to find the one with matching slug
      const articles = await articleService.getArticles();
      const articleData = articles.find((article) => article.slug === slug);

      if (!articleData) {
        message.error('Article not found');
        navigate('/articles');
        return;
      }

      setArticle(articleData);

      // Set form values
      form.setFieldsValue({
        title: articleData.title,
        slug: articleData.slug,
        content: articleData.content,
        thumbnail: articleData.thumbnail,
        image: articleData.image,
        short_description: articleData.short_description,
        meta_description: articleData.meta_description,
        tags: articleData.tags,
        category_ids: articleData.categories.map((cat) => cat.id),
        published: articleData.published,
      });

      // Set keywords state
      setKeywords(articleData.keywords || []);
    } catch (error) {
      message.error('Failed to fetch article');
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchArticle();
    }
  }, [slug, isEditMode]);

  // Handle title change to auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;

    // Generate slug from the new title
    const newSlug = generateSlug(title);

    // Get existing slugs (excluding current article if editing)
    const existingSlugs = article ? [article.slug] : [];

    // Generate unique slug
    const uniqueSlug = generateUniqueSlug(newSlug, existingSlugs);

    // Update the slug field
    form.setFieldValue('slug', uniqueSlug);
  };

  // Handle adding new keyword
  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  // Handle removing keyword
  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  // Handle preview
  const handlePreview = () => {
    const formValues = form.getFieldsValue();
    if (!formValues.title) {
      message.warning('Please enter a title to preview');
      return;
    }

    // Generate slug from title if not provided
    const previewSlug = formValues.slug || generateSlug(formValues.title);
    navigate(`/articles/preview/${previewSlug}`);
  };

  // Handle form submission
  const handleSubmit = async (values: CreateArticleRequest) => {
    setLoading(true);
    try {
      const submitData = {
        ...values,
        keywords: keywords,
      };

      if (isEditMode && article) {
        await articleService.updateArticle(article.id, submitData);
        message.success('Article updated successfully');
      } else {
        await articleService.createArticle(submitData);
        message.success('Article created successfully');
      }
      navigate('/articles');
    } catch (error) {
      message.error('Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div
          style={{
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/articles')}
            >
              Back to Articles
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              {isEditMode ? 'Edit Article' : 'Create New Article'}
            </Title>
          </div>
          <Space>
            <Button icon={<EyeOutlined />} onClick={handlePreview}>
              Preview
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={loading}
            >
              {isEditMode ? 'Update Article' : 'Create Article'}
            </Button>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={loading}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Card title="Article Content" style={{ marginBottom: 24 }}>
                <Form.Item
                  name="title"
                  label="Article Title"
                  rules={[
                    { required: true, message: 'Please enter article title' },
                  ]}
                >
                  <Input
                    placeholder="Enter article title"
                    onChange={handleTitleChange}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="slug"
                  label="Slug"
                  rules={[{ required: true, message: 'Please enter slug' }]}
                  extra="Auto-generated from article title, but you can edit it manually"
                >
                  <Input placeholder="Enter slug (e.g., my-article)" />
                </Form.Item>

                <Form.Item
                  name="short_description"
                  label="Short Description"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter short description',
                    },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Enter short description"
                    showCount
                    maxLength={200}
                  />
                </Form.Item>

                <Form.Item
                  name="content"
                  label="Content"
                  rules={[{ required: true, message: 'Please enter content' }]}
                >
                  <Editor
                    apiKey="no-api-key" // You can get a free API key from TinyMCE
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'code',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'help',
                        'wordcount',
                      ],
                      toolbar:
                        'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style:
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    }}
                    onEditorChange={(content: string) => {
                      form.setFieldValue('content', content);
                    }}
                  />
                </Form.Item>
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Article Settings" style={{ marginBottom: 24 }}>
                <Form.Item
                  name="published"
                  label="Published"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item name="category_ids" label="Categories">
                  <Select
                    mode="multiple"
                    placeholder="Select categories"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={categories.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    }))}
                  />
                </Form.Item>

                <Form.Item label="Keywords">
                  <div style={{ marginBottom: 8 }}>
                    <Input
                      placeholder="Enter keyword"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onPressEnter={handleAddKeyword}
                      style={{ marginBottom: 8 }}
                    />
                    <Button
                      type="dashed"
                      onClick={handleAddKeyword}
                      disabled={!newKeyword.trim()}
                    >
                      Add Keyword
                    </Button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {keywords.map((keyword) => (
                      <Tag
                        key={keyword}
                        closable
                        onClose={() => handleRemoveKeyword(keyword)}
                        color="blue"
                      >
                        {keyword}
                      </Tag>
                    ))}
                  </div>
                </Form.Item>
              </Card>

              <Card title="Media" style={{ marginBottom: 24 }}>
                <Form.Item name="thumbnail" label="Thumbnail">
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <Input placeholder="Enter thumbnail URL" />
                    <Upload
                      showUploadList={false}
                      beforeUpload={() => {
                        message.info(
                          'File upload functionality will be implemented'
                        );
                        return false;
                      }}
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </div>
                </Form.Item>

                <Form.Item name="image" label="Featured Image">
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <Input placeholder="Enter featured image URL" />
                    <Upload
                      showUploadList={false}
                      beforeUpload={() => {
                        message.info(
                          'File upload functionality will be implemented'
                        );
                        return false;
                      }}
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </div>
                </Form.Item>
              </Card>

              <Card title="SEO">
                <Form.Item name="meta_description" label="Meta Description">
                  <TextArea
                    rows={3}
                    placeholder="Enter meta description for SEO"
                    showCount
                    maxLength={160}
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default ArticleFormPage;
