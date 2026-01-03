import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { Mail, Lock, TrendingUp } from 'lucide-react';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md p-8 space-y-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative z-10 animate-fade-in">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-gradient-trading rounded-xl shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-trading">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sign in to continue to PrimeTrade
          </p>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const { data } = await login(values);
              authLogin(data.access_token);
              toast.success('Logged in successfully!');
              navigate('/');
            } catch (error) {
              const message = error instanceof AxiosError && error.response?.data?.detail
                ? error.response.data.detail
                : 'Failed to login. Check your credentials.';
              toast.error(message);
              console.error(error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Field
                    as={Input}
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="pl-11"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-danger-600 dark:text-danger-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Field
                    as={Input}
                    type="password"
                    name="password"
                    className="pl-11"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="mt-1 text-sm text-danger-600 dark:text-danger-400" />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                variant="gradient"
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              New to PrimeTrade?
            </span>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Create an account
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
