import { Admin } from '@/interfaces/admin';
import http from '@/lib/http';
import { setPageTitle } from '@/lib/utils';
import { webRoutes } from '@/routes/web';
import { RootState } from '@/store';
import { login } from '@/store/slices/adminSlice';
import { Button, Form, Input, message } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

interface FormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || webRoutes.dashboard;
  const admin = useSelector((state: RootState) => state.admin);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setPageTitle(`Admin Login - ${CONFIG.appName}`);
  }, []);

  useEffect(() => {
    // Only redirect if user has valid token in Redux state (persisted via localStorage)
    if (admin && admin.token) {
      navigate(from, { replace: true });
    }
  }, [admin, from, navigate]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
      const response = await http.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      // Check if login was successful based on response
      if (response.data.status === 'success' && response.data.access_token) {
        const admin: Admin = {
          token: response.data.access_token,
        };
        dispatch(login(admin));
        message.success('Login successful!');
        navigate(from, { replace: true });
      } else {
        message.error('Login failed: Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        message.error('Invalid email or password');
      } else if (error.response?.status === 422) {
        message.error('Please check your email and password format');
      } else {
        message.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col space-y-1.5">
        <h3 className="font-semibold tracking-tight text-2xl opacity-60 my-0">
          Admin Login
        </h3>
        <p className="text-sm text-gray-400">
          Enter your email below to login to your account
        </p>
      </div>
      <Form
        className="space-y-4 md:space-y-6"
        form={form}
        name="login"
        onFinish={onSubmit}
        layout={'vertical'}
        requiredMark={false}
        initialValues={
          import.meta.env.VITE_DEMO_MODE === 'true'
            ? {
                email: 'eve.holt@reqres.in',
                password: 'password',
              }
            : {}
        }
      >
        <div>
          <Form.Item
            name="email"
            label={
              <p className="block text-sm font-medium text-gray-900">Email</p>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your email',
              },
              {
                type: 'email',
                message: 'Invalid email address',
              },
            ]}
          >
            <Input
              placeholder="name@example.com"
              className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            name="password"
            label={
              <p className="block text-sm font-medium text-gray-900">
                Password
              </p>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your password',
              },
            ]}
          >
            <Input.Password
              placeholder="••••••••"
              visibilityToggle={false}
              className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>

        <div className="text-center">
          <Button
            className="mt-4"
            block
            loading={loading}
            type="primary"
            size="large"
            htmlType={'submit'}
          >
            Login
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default LoginPage;
