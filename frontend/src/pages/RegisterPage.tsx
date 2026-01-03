import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/api';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { Mail, Lock, TrendingUp, CheckCircle2, User, Shield } from 'lucide-react';
import { useState } from 'react';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
  role: Yup.string().oneOf(['user', 'admin']).required('Required'),
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');

  const roles = [
    {
      value: 'user',
      label: 'User',
      icon: User,
      description: 'Standard access to manage your own tasks',
      color: 'primary',
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: Shield,
      description: 'Full access to manage all tasks and users',
      color: 'warning',
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-2xl p-8 space-y-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative z-10 animate-fade-in">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-gradient-trading rounded-xl shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-trading">
            Join PrimeTrade
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create your account to get started
          </p>
        </div>

        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '', role: 'user' }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const { data } = await register({
                email: values.email,
                password: values.password,
                role: values.role
              });
              authLogin(data.access_token);
              toast.success('Account created successfully!');
              navigate('/');
            } catch (error) {
              const message = error instanceof AxiosError && error.response?.data?.detail
                ? error.response.data.detail
                : 'Failed to register.';
              toast.error(message);
              console.error(error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => {
            const passwordStrength = values.password.length >= 8 ?
              (values.password.length >= 12 ? 'strong' : 'medium') : 'weak';

            return (
              <Form className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-base">Select Account Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.value as 'user' | 'admin');
                          setFieldValue('role', role.value);
                        }}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedRole === role.value
                            ? `border-${role.color}-500 bg-${role.color}-50 dark:bg-${role.color}-950/20`
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${selectedRole === role.value
                              ? `bg-${role.color}-500`
                              : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                            <role.icon className={`w-5 h-5 ${selectedRole === role.value
                                ? 'text-white'
                                : 'text-gray-600 dark:text-gray-400'
                              }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {role.label}
                              </span>
                              {selectedRole === role.value && (
                                <CheckCircle2 className={`w-4 h-4 text-${role.color}-500`} />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {role.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <ErrorMessage name="role" component="div" className="mt-1 text-sm text-danger-600 dark:text-danger-400" />
                </div>

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
                  {values.password && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength === 'strong' ? 'w-full bg-success-500' :
                              passwordStrength === 'medium' ? 'w-2/3 bg-warning-500' :
                                'w-1/3 bg-danger-500'
                            }`}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength === 'strong' ? 'text-success-600' :
                          passwordStrength === 'medium' ? 'text-warning-600' :
                            'text-danger-600'
                        }`}>
                        {passwordStrength === 'strong' ? 'Strong' :
                          passwordStrength === 'medium' ? 'Medium' : 'Weak'}
                      </span>
                    </div>
                  )}
                  <ErrorMessage name="password" component="div" className="mt-1 text-sm text-danger-600 dark:text-danger-400" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field
                      as={Input}
                      type="password"
                      name="confirmPassword"
                      className="pl-11"
                    />
                    {values.confirmPassword && values.password === values.confirmPassword && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-success-500" />
                    )}
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="mt-1 text-sm text-danger-600 dark:text-danger-400"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="gradient"
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>
              </Form>
            );
          }}
        </Formik>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              Already have an account?
            </span>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Sign in instead
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
