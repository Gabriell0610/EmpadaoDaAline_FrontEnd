import { RegisterData } from '@/utils/schemas/register.schema';

export function useRegister() {
  async function register(data: RegisterData) {
    const req = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const res = await req.json();

    return res;
  }

  return {
    register,
  };
}
