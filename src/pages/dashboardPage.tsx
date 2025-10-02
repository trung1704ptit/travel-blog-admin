import StatCard from '@/components/dashboard/statCard';
import BasePageContainer from '@/components/layout/pageContainer';
import LazyImage from '@/components/lazy-image';
import { Review } from '@/interfaces/review';
import { User } from '@/interfaces/user';
import { webRoutes } from '@/routes/web';
import Icon from '@ant-design/icons';
import { StatisticCard } from '@ant-design/pro-components';
import {
  Avatar,
  BreadcrumbProps,
  Card,
  Col,
  List,
  Progress,
  Rate,
  Row,
  Table,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';
import { AiOutlineStar, AiOutlineTeam } from 'react-icons/ai';
import { BiCommentDetail, BiPhotoAlbum } from 'react-icons/bi';
import { MdOutlineArticle, MdOutlinePhoto } from 'react-icons/md';
import { Link } from 'react-router-dom';
// CONFIG is available globally

const breadcrumb: BreadcrumbProps = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
  ],
};

const DashboardPage = () => {
  const [loading, setLoading] = useState<boolean>(true);

  // Hardcoded user data
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'user',
      provider: 'local',
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
      first_name: 'John',
      last_name: 'Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'user',
      provider: 'local',
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
      first_name: 'Jane',
      last_name: 'Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'user',
      provider: 'local',
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
      first_name: 'Mike',
      last_name: 'Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      role: 'user',
      provider: 'local',
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
      first_name: 'Sarah',
      last_name: 'Wilson',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
  ]);

  // Hardcoded review data
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      title: 'Amazing Travel Experience',
      color: 'blue',
      year: '2024',
      star: 5,
    },
    {
      id: 2,
      title: 'Great Hotel Service',
      color: 'green',
      year: '2024',
      star: 4,
    },
    {
      id: 3,
      title: 'Beautiful Destination',
      color: 'orange',
      year: '2023',
      star: 5,
    },
    {
      id: 4,
      title: 'Excellent Food',
      color: 'purple',
      year: '2023',
      star: 4,
    },
    {
      id: 5,
      title: 'Wonderful Adventure',
      color: 'red',
      year: '2024',
      star: 5,
    },
  ]);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <BasePageContainer breadcrumb={breadcrumb} transparent={true}>
      <Row gutter={24}>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={AiOutlineTeam} />}
            title="Users"
            number={1247}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={MdOutlineArticle} />}
            title="Articles"
            number={89}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={BiPhotoAlbum} />}
            title="Categories"
            number={15}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={MdOutlinePhoto} />}
            title="Photos"
            number={2341}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={BiCommentDetail} />}
            title="Comments"
            number={567}
          />
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
          <StatCard
            loading={loading}
            icon={<Icon component={AiOutlineStar} />}
            title="Reviews"
            number={234}
          />
        </Col>
        <Col
          xl={12}
          lg={12}
          md={24}
          sm={24}
          xs={24}
          style={{ marginBottom: 24 }}
        >
          <Card bordered={false} className="w-full h-full cursor-default">
            <StatisticCard.Group direction="row">
              <StatisticCard
                statistic={{
                  title: 'Total Views',
                  value: loading ? 0 : 45678,
                }}
              />
              <StatisticCard
                statistic={{
                  title: 'Engagement',
                  value: '85%',
                }}
                chart={
                  <Progress
                    className="text-rfprimary"
                    percent={loading ? 0 : 85}
                    type="circle"
                    size={'small'}
                    strokeColor={CONFIG.theme.accentColor}
                  />
                }
                chartPlacement="left"
              />
            </StatisticCard.Group>
          </Card>
        </Col>
        <Col
          xl={12}
          lg={12}
          md={12}
          sm={24}
          xs={24}
          style={{ marginBottom: 24 }}
        >
          <Card bordered={false} className="w-full h-full cursor-default">
            <List
              loading={loading}
              itemLayout="horizontal"
              dataSource={users}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="circle"
                        size="small"
                        src={
                          user.avatar ? (
                            <LazyImage
                              src={user.avatar}
                              placeholder={
                                <div className="bg-gray-100 h-full w-full" />
                              }
                            />
                          ) : undefined
                        }
                      >
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                    }
                    title={
                      user.name ||
                      `${user.first_name || ''} ${user.last_name || ''}`.trim()
                    }
                    description={user.email}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col
          xl={12}
          lg={12}
          md={12}
          sm={24}
          xs={24}
          style={{ marginBottom: 24 }}
        >
          <Card bordered={false} className="w-full h-full cursor-default">
            <Table
              loading={loading}
              pagination={false}
              showHeader={false}
              dataSource={reviews}
              columns={[
                {
                  title: 'Title',
                  dataIndex: 'title',
                  key: 'title',
                  align: 'left',
                },
                {
                  title: 'Year',
                  dataIndex: 'year',
                  key: 'year',
                  align: 'center',
                  render: (_, row: Review) => (
                    <Tag color={row.color}>{row.year}</Tag>
                  ),
                },
                {
                  title: 'Star',
                  dataIndex: 'star',
                  key: 'star',
                  align: 'center',
                  render: (_, row: Review) => (
                    <Rate disabled defaultValue={row.star} />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </BasePageContainer>
  );
};

export default DashboardPage;
