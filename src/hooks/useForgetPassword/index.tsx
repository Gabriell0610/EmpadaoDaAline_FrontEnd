import { NewPasswordData } from '@/app/newPassword/clientPage';
import { sendEmailDto, validateTokenDto } from '@/utils/schemas/forgetPassword';

export function useForgetPassword() {
  async function generateToken(data: sendEmailDto) {
    const req = await fetch('/api/generateToken/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const res = await req.json();
    return res;
  }

  async function validateToken(data: validateTokenDto) {
    const req = await fetch('/api/validateToken/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const res = await req.json();
    return res;
  }

  async function resetPassword(data: NewPasswordData) {
    const req = await fetch('/api/resetPassword/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const res = await req.json();
    return res;
  }

  return {
    generateToken,
    validateToken,
    resetPassword,
  };
}
