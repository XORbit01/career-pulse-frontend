# 🛠️ Development Guide

> Comprehensive guide for contributing to Career Pulse Frontend development

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn package manager
- Git ([Download](https://git-scm.com/))
- VS Code (recommended) with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Auto Rename Tag
  - Bracket Pair Colorizer

### Development Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/careerpulse-frontend.git
cd careerpulse-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your local configuration
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:5173`

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1
- **Styling**: Tailwind CSS 3.4.11
- **UI Components**: Radix UI primitives
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM 6.26.2
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── chat/            # Chat and messaging
│   ├── home/            # Landing page components
│   ├── jobs/            # Job-related components
│   ├── layout/          # Layout components (navbar, footer)
│   ├── profile/         # User profile components
│   └── ui/              # Base UI components (buttons, inputs)
├── pages/               # Route components
├── services/            # API services and utilities
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── styles/              # Global styles and themes
└── main.tsx            # Application entry point
```

## 🎨 Component Development

### Component Structure

```typescript
// components/ui/example-component.tsx
import React from 'react';
import { cn } from '@/utils/cn';

interface ExampleComponentProps {
  title: string;
  description?: string;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
  children?: React.ReactNode;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  description,
  variant = 'default',
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        'base-styles',
        {
          'variant-primary': variant === 'primary',
          'variant-secondary': variant === 'secondary',
        },
        className
      )}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
};

export default ExampleComponent;
```

### Styling Guidelines

1. **Use Tailwind CSS classes**
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
```

2. **Create reusable component variants**
```tsx
const buttonVariants = {
  primary: "bg-jobify-blue text-white hover:bg-jobify-blue/90",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-50"
};
```

3. **Use CSS custom properties for theming**
```css
:root {
  --jobify-blue: #3B82F6;
  --jobify-teal: #14B8A6;
}
```

## 🔌 API Integration

### Service Layer Pattern

```typescript
// services/example-service.ts
import api from './api';

export interface ExampleData {
  id: number;
  name: string;
  description: string;
}

export interface ExampleResponse {
  success: boolean;
  data: ExampleData;
  message: string;
}

class ExampleService {
  static async getExample(id: number): Promise<ExampleResponse> {
    const response = await api.get(`/examples/${id}`);
    return response.data;
  }

  static async createExample(data: Partial<ExampleData>): Promise<ExampleResponse> {
    const response = await api.post('/examples', data);
    return response.data;
  }

  static async updateExample(id: number, data: Partial<ExampleData>): Promise<ExampleResponse> {
    const response = await api.put(`/examples/${id}`, data);
    return response.data;
  }

  static async deleteExample(id: number): Promise<ExampleResponse> {
    const response = await api.delete(`/examples/${id}`);
    return response.data;
  }
}

export default ExampleService;
```

### React Query Integration

```typescript
// hooks/use-example.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ExampleService from '@/services/example-service';

export const useExample = (id: number) => {
  return useQuery({
    queryKey: ['example', id],
    queryFn: () => ExampleService.getExample(id),
    enabled: !!id,
  });
};

export const useCreateExample = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ExampleService.createExample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examples'] });
    },
  });
};
```

## 🧪 Testing

### Testing Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
});
```

### Component Testing

```typescript
// components/ui/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="primary">Primary Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-jobify-blue');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API Testing

```typescript
// services/__tests__/example-service.test.ts
import { describe, it, expect, vi } from 'vitest';
import ExampleService from '../example-service';
import api from '../api';

vi.mock('../api');

describe('ExampleService', () => {
  it('fetches example data', async () => {
    const mockData = { id: 1, name: 'Test', description: 'Test description' };
    vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: mockData } });

    const result = await ExampleService.getExample(1);
    expect(result.data).toEqual(mockData);
  });
});
```

## 📝 Code Standards

### TypeScript Guidelines

1. **Use strict TypeScript configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

2. **Define proper interfaces**
```typescript
interface User {
  id: number;
  email: string;
  role: 'job_seeker' | 'employer';
  profile?: UserProfile;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  first_name: string;
  last_name: string;
  bio?: string;
  avatar_url?: string;
}
```

3. **Use type guards**
```typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'role' in obj
  );
}
```

### ESLint Configuration

```javascript
// eslint.config.js
export default [
  {
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 🔄 State Management

### React Query for Server State

```typescript
// hooks/use-jobs.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import JobService from '@/services/job-service';

export const useJobs = (filters: JobFilters) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => JobService.getJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInfiniteJobs = (filters: JobFilters) => {
  return useInfiniteQuery({
    queryKey: ['jobs', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => 
      JobService.getJobs({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.next_page,
    initialPageParam: 1,
  });
};
```

### Local State with useState

```typescript
// hooks/use-form-state.ts
import { useState, useCallback } from 'react';

export const useFormState = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  
  const updateField = useCallback((field: keyof T, value: T[keyof T]) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const resetForm = useCallback(() => {
    setState(initialState);
  }, [initialState]);
  
  return { state, updateField, resetForm };
};
```

## 🎯 Performance Optimization

### Code Splitting

```typescript
// Lazy load components
import { lazy, Suspense } from 'react';

const JobDetail = lazy(() => import('@/pages/JobDetail'));
const EmployerDashboard = lazy(() => import('@/pages/EmployerDashboard'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <JobDetail />
</Suspense>
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data, onUpdate }: Props) => {
  const processedData = useMemo(() => {
    return data.map(item => ({ ...item, processed: true }));
  }, [data]);
  
  const handleUpdate = useCallback((id: number) => {
    onUpdate(id);
  }, [onUpdate]);
  
  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleUpdate(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
```

### Image Optimization

```typescript
// utils/image-optimization.ts
export const optimizeImageUrl = (url: string, width?: number, height?: number) => {
  if (!url) return '/placeholder.jpg';
  
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  
  return `${url}?${params.toString()}`;
};
```

## 🔒 Security Best Practices

### Input Validation

```typescript
import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  salary_min: z.number().positive().optional(),
  salary_max: z.number().positive().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

export const validateJobForm = (data: unknown): JobFormData => {
  return jobSchema.parse(data);
};
```

### XSS Prevention

```typescript
// utils/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
};
```

## 📱 Responsive Design

### Mobile-First Approach

```css
/* Start with mobile styles */
.component {
  padding: 1rem;
  font-size: 0.875rem;
}

/* Tablet styles */
@media (min-width: 768px) {
  .component {
    padding: 1.5rem;
    font-size: 1rem;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .component {
    padding: 2rem;
    font-size: 1.125rem;
  }
}
```

### Tailwind Responsive Utilities

```tsx
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
  {/* Content */}
</div>
```

## 🐛 Debugging

### React Developer Tools

1. Install React Developer Tools browser extension
2. Use Profiler for performance debugging
3. Check component props and state

### Console Debugging

```typescript
// utils/debug.ts
export const debug = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Usage
debug('User data loaded', userData);
```

### Error Boundaries

```typescript
// components/error-boundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <h2>Something went wrong.</h2>
          <p>Please refresh the page and try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## 📚 Additional Resources

### Documentation Links

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev/guide/)

### Useful Tools

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter)

## 🤝 Contributing

### Git Workflow

1. **Create feature branch**
```bash
git checkout -b feature/amazing-feature
```

2. **Make changes and commit**
```bash
git add .
git commit -m "feat: add amazing feature"
```

3. **Push and create PR**
```bash
git push origin feature/amazing-feature
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build process or auxiliary tool changes

### Pull Request Guidelines

1. **Clear description** of changes
2. **Screenshots** for UI changes
3. **Tests** for new features
4. **Documentation** updates if needed
5. **Breaking changes** clearly marked

---

<div align="center">
  <p>🛠️ Happy Coding!</p>
  <p>For questions, reach out to the development team</p>
</div>

