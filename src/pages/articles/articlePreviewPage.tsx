import { Article, articleService } from '@/services';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Image, message, Spin, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const ArticlePreviewPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch article by slug
  const fetchArticle = async () => {
    if (!slug) {
      message.error('Article slug not found');
      navigate('/articles');
      return;
    }

    setLoading(true);
    try {
      // Get all articles to find the one with matching slug
      const articles = await articleService.getArticles();
      const articleData = articles.find((article) => article.slug === slug);

      if (!articleData) {
        message.error('Article not found');
        navigate('/articles');
        return;
      }

      setArticle(articleData);
    } catch (error) {
      message.error('Failed to fetch article');
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Title level={3}>Article not found</Title>
        <Button onClick={() => navigate('/articles')}>Back to Articles</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card>
        {/* Header */}
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
              Article Preview
            </Title>
          </div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/articles/edit/${article.slug}`)}
          >
            Edit Article
          </Button>
        </div>

        {/* Article Content */}
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Article Header */}
          <div style={{ marginBottom: 32 }}>
            <Title level={1} style={{ marginBottom: 16 }}>
              {article.title}
            </Title>

            {article.short_description && (
              <Paragraph
                style={{
                  fontSize: 18,
                  color: '#666',
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                {article.short_description}
              </Paragraph>
            )}

            {/* Meta Information */}
            <div
              style={{
                display: 'flex',
                gap: 16,
                marginBottom: 16,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {article.categories.length > 0 && (
                <div>
                  <strong>Categories: </strong>
                  {article.categories.map((cat) => (
                    <Tag key={cat.id} color="blue" style={{ marginLeft: 4 }}>
                      {cat.name}
                    </Tag>
                  ))}
                </div>
              )}
              {article.keywords.length > 0 && (
                <div>
                  <strong>Keywords: </strong>
                  {article.keywords.map((keyword) => (
                    <Tag key={keyword} color="green" style={{ marginLeft: 4 }}>
                      {keyword}
                    </Tag>
                  ))}
                </div>
              )}
            </div>

            {/* Status and Author */}
            <div
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                marginBottom: 24,
                padding: 16,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
              }}
            >
              <Tag color={article.published ? 'green' : 'orange'}>
                {article.published ? 'Published' : 'Draft'}
              </Tag>
              <span style={{ color: '#666' }}>
                by <strong>{article.author.name}</strong>
              </span>
              <span style={{ color: '#999', fontSize: 14 }}>
                {new Date(article.created_at).toLocaleDateString()}
              </span>
              <span style={{ color: '#999', fontSize: 14 }}>
                Updated: {new Date(article.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          {article.image && (
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
              <Image
                src={article.image}
                alt="Featured"
                style={{
                  maxWidth: '100%',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div style={{ marginBottom: 32 }}>
            {article.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{
                  lineHeight: 1.8,
                  fontSize: 16,
                  color: '#333',
                }}
              />
            ) : (
              <Paragraph style={{ color: '#999', fontStyle: 'italic' }}>
                No content available
              </Paragraph>
            )}
          </div>

          {/* Article Stats */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              marginBottom: 32,
              padding: 20,
              backgroundColor: '#f5f5f5',
              borderRadius: 8,
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}
              >
                {article.views}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>Views</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}
              >
                {article.likes}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>Likes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{ fontSize: 24, fontWeight: 'bold', color: '#fa8c16' }}
              >
                {article.comments}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>Comments</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}
              >
                {article.reading_time_minutes}
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>Min Read</div>
            </div>
          </div>

          {/* SEO Meta Description */}
          {article.meta_description && (
            <div
              style={{
                backgroundColor: '#f0f8ff',
                padding: 20,
                borderRadius: 8,
                border: '1px solid #d6e4ff',
              }}
            >
              <Title level={4} style={{ marginBottom: 8, color: '#1890ff' }}>
                SEO Meta Description
              </Title>
              <Paragraph style={{ margin: 0, color: '#666' }}>
                {article.meta_description}
              </Paragraph>
            </div>
          )}

          {/* Breadcrumb */}
          {article.breadcrumb && article.breadcrumb.length > 0 && (
            <div
              style={{
                marginTop: 32,
                padding: 16,
                backgroundColor: '#fafafa',
                borderRadius: 8,
                border: '1px solid #e8e8e8',
              }}
            >
              <Title level={5} style={{ marginBottom: 8 }}>
                Navigation Path
              </Title>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {article.breadcrumb.map((item, index) => (
                  <span key={index}>
                    <a
                      href={item.link}
                      style={{ color: '#1890ff', textDecoration: 'none' }}
                    >
                      {item.name}
                    </a>
                    {index < article.breadcrumb.length - 1 && (
                      <span style={{ margin: '0 8px', color: '#999' }}>›</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ArticlePreviewPage;
