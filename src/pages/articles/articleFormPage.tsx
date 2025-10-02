import { generateSlug, generateUniqueSlug } from '@/lib/utils';
import {
  Article,
  Category,
  CreateArticleRequest,
  articleService,
  categoryService,
} from '@/services';
import { cloudinaryService } from '@/services/cloudinary.service';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
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
  Image,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Typography,
  Upload,
  message,
} from 'antd';
import castArray from 'lodash/castArray';
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form] = Form.useForm();

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
      const articleData = await articleService.getArticleBySlug(slug);
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
        keywords: articleData.keywords,
        categories: articleData.categories?.[0]?.id || undefined,
        published: articleData.published,
      });
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
    const newSlug = generateSlug(title);
    const existingSlugs = article ? [article.slug] : [];
    const uniqueSlug = generateUniqueSlug(newSlug, existingSlugs);
    form.setFieldValue('slug', uniqueSlug);
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      message.loading({ content: 'Uploading image...', key: 'upload' });

      // Upload image with thumbnail generation
      const result = await cloudinaryService.uploadImageWithThumbnail(file, {
        folder: 'articles',
        thumbnailWidth: 400,
        thumbnailHeight: 300,
      });

      message.success({
        content: 'Image uploaded successfully!',
        key: 'upload',
      });

      // Update form fields
      form.setFieldsValue({
        image: result.imageUrl,
        thumbnail: result.thumbnailUrl,
      });
    } catch (error) {
      message.error({ content: 'Failed to upload image', key: 'upload' });
      console.error('Upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle thumbnail upload (separate)
  const handleThumbnailUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      message.loading({ content: 'Uploading thumbnail...', key: 'upload' });

      const result = await cloudinaryService.uploadImage(file, {
        folder: 'articles/thumbnails',
        transformation: 'c_fill,w_400,h_300,g_auto,q_auto',
      });

      message.success({
        content: 'Thumbnail uploaded successfully!',
        key: 'upload',
      });

      form.setFieldValue('thumbnail', result.secure_url);
    } catch (error) {
      message.error({ content: 'Failed to upload thumbnail', key: 'upload' });
      console.error('Upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    const formValues = form.getFieldsValue();
    if (!formValues.title) {
      message.warning('Please enter a title to preview');
      return;
    }
    const previewSlug = formValues.slug || generateSlug(formValues.title);
    navigate(`/articles/preview/${previewSlug}`);
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const submitData: CreateArticleRequest = {
        title: values.title,
        slug: values.slug,
        content: values.content || '',
        thumbnail: values.thumbnail,
        image: values.image,
        short_description: values.short_description,
        meta_description: values.meta_description,
        keywords: values.keywords,
        tags: values.tags,
        categories: castArray(values.categories),
        published: values.published || false,
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
      console.error('Submit error:', error);
      message.error('Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-3 pt-3 pb-6">
      <Card>
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/articles')}
            >
              Back to Articles
            </Button>
            <Title level={3} className="!m-0">
              {isEditMode ? 'Edit Article' : 'Create Article'}
            </Title>
          </div>
          <Space wrap>
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
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <Card title="Article Content" className="mb-6">
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
                  trigger="onEditorChange"
                  getValueFromEvent={(content: string) => {
                    return typeof content === 'string' ? content : '';
                  }}
                >
                  <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    init={{
                      height: 2000,
                      menubar: 'file edit view insert format tools table help',
                      plugins: [
                        'advlist',
                        'anchor',
                        'autolink',
                        'autoresize',
                        'charmap',
                        'code',
                        'codesample',
                        'directionality',
                        'emoticons',
                        'fullscreen',
                        'help',
                        'image',
                        'importcss',
                        'insertdatetime',
                        'link',
                        'lists',
                        'media',
                        'nonbreaking',
                        'pagebreak',
                        'preview',
                        'quickbars',
                        'save',
                        'searchreplace',
                        'table',
                        'visualblocks',
                        'visualchars',
                        'wordcount',
                      ],
                      toolbar: [
                        'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | removeformat',
                        'alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | link image media table',
                        'codesample emoticons charmap | insertdatetime pagebreak anchor | searchreplace visualblocks visualchars code fullscreen | preview help',
                      ],
                      toolbar_mode: 'wrap',
                      quickbars_selection_toolbar:
                        'bold italic underline | quicklink blockquote',
                      quickbars_insert_toolbar: 'quickimage quicktable',
                      font_family_formats:
                        'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; ' +
                        'Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; ' +
                        'Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; ' +
                        'Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; ' +
                        'Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; ' +
                        'Terminal=terminal,monaco; Times New Roman=times new roman,times; ' +
                        'Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; ' +
                        'Webdings=webdings; Wingdings=wingdings,zapf dingbats',
                      font_size_formats:
                        '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
                      block_formats:
                        'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; ' +
                        'Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre',
                      image_advtab: true,
                      image_caption: true,
                      image_title: true,
                      link_title: true,
                      link_target_list: [
                        { title: 'None', value: '' },
                        { title: 'New window', value: '_blank' },
                        { title: 'Same window', value: '_self' },
                        { title: 'Parent window', value: '_parent' },
                      ],
                      table_toolbar:
                        'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter ' +
                        'tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
                      table_appearance_options: true,
                      table_grid: true,
                      table_resize_bars: true,
                      table_default_styles: { width: '100%' },
                      codesample_languages: [
                        { text: 'HTML/XML', value: 'markup' },
                        { text: 'JavaScript', value: 'javascript' },
                        { text: 'CSS', value: 'css' },
                        { text: 'PHP', value: 'php' },
                        { text: 'Ruby', value: 'ruby' },
                        { text: 'Python', value: 'python' },
                        { text: 'Java', value: 'java' },
                        { text: 'C', value: 'c' },
                        { text: 'C#', value: 'csharp' },
                        { text: 'C++', value: 'cpp' },
                      ],
                      content_style:
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height: 1.6; }',
                      autoresize_bottom_margin: 50,
                      autoresize_overflow_padding: 50,
                      branding: false,
                      elementpath: true,
                      paste_as_text: false,
                      paste_data_images: true,
                      contextmenu: 'link image table',
                      nonbreaking_force_tab: true,
                      images_upload_handler: async (
                        blobInfo: any,
                        _progress: any
                      ) => {
                        try {
                          const formData = new FormData();
                          formData.append('file', blobInfo.blob());
                          formData.append(
                            'upload_preset',
                            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
                          );

                          const res = await fetch(
                            `https://api.cloudinary.com/v1_1/${
                              import.meta.env.VITE_CLOUDINARY_NAME
                            }/image/upload`,
                            {
                              method: 'POST',
                              body: formData,
                            }
                          );

                          const data = await res.json();
                          console.log('Cloudinary response:', data);

                          if (data.secure_url) {
                            return data.secure_url;
                          } else {
                            throw new Error(
                              data.error?.message || 'Upload failed'
                            );
                          }
                        } catch (err) {
                          console.error(err);
                          throw err;
                        }
                      },
                    }}
                  />
                </Form.Item>
              </Card>
            </Col>

            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Card title="Article Settings" className="mb-6">
                <Form.Item
                  name="published"
                  label="Published"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item name="categories" label="Category">
                  <Select
                    placeholder="Select category"
                    allowClear
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

                <Form.Item name="tags" label="Tags">
                  <Select
                    mode="tags"
                    placeholder="Enter tags (press comma or enter to add)"
                    className="w-full"
                    tokenSeparators={[',']}
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>

                <Form.Item name="keywords" label="Keywords">
                  <Select
                    mode="tags"
                    placeholder="Enter keywords (press comma or enter to add)"
                    className="w-full"
                    tokenSeparators={[',']}
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Card>

              <Card title="Media" className="mb-6">
                <Spin spinning={uploadingImage}>
                  {/* Feature Image Upload */}
                  <Form.Item label="Featured Image">
                    <Form.Item name="image" noStyle>
                      <Input placeholder="Feature image URL (auto-filled on upload)" />
                    </Form.Item>
                    <div className="mt-2 flex gap-2">
                      <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={(file) => {
                          handleImageUpload(file);
                          return false;
                        }}
                        disabled={uploadingImage}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          disabled={uploadingImage}
                        >
                          Upload Feature Image
                        </Button>
                      </Upload>
                      {form.getFieldValue('image') && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => form.setFieldValue('image', '')}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    {form.getFieldValue('image') && (
                      <div className="mt-2">
                        <Image
                          src={form.getFieldValue('image')}
                          alt="Feature"
                          style={{ maxWidth: '100%', maxHeight: 200 }}
                        />
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Uploading feature image will auto-generate thumbnail
                    </div>
                  </Form.Item>

                  {/* Thumbnail (auto-generated or manual) */}
                  <Form.Item label="Thumbnail" className="mt-4">
                    <Form.Item name="thumbnail" noStyle>
                      <Input placeholder="Thumbnail URL (auto-generated from feature image)" />
                    </Form.Item>
                    <div className="mt-2 flex gap-2">
                      <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={(file) => {
                          handleThumbnailUpload(file);
                          return false;
                        }}
                        disabled={uploadingImage}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          disabled={uploadingImage}
                        >
                          Upload Custom Thumbnail
                        </Button>
                      </Upload>
                      {form.getFieldValue('thumbnail') && (
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => form.setFieldValue('thumbnail', '')}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    {form.getFieldValue('thumbnail') && (
                      <div className="mt-2">
                        <Image
                          src={form.getFieldValue('thumbnail')}
                          alt="Thumbnail"
                          style={{ maxWidth: '100%', maxHeight: 150 }}
                        />
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Optional: Upload custom thumbnail or use auto-generated
                    </div>
                  </Form.Item>
                </Spin>
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
