import api from './api';

// Types
interface OTPResponse {
    success: boolean;
    message: string;
}

interface OTPVerifyResponse extends OTPResponse {
    // Additional fields can be added if needed
}

// Request OTP to be sent to email
export async function requestOTP(email: string, purpose: 'verification' | 'password_reset' | '2fa' = 'verification'): Promise<OTPResponse> {
    const response = await api.post<OTPResponse>('/otp/request', { email, purpose });
    return response.data;
}

// Verify OTP code
export async function verifyOTP(email: string, otp: string): Promise<OTPVerifyResponse> {
    const response = await api.post<OTPVerifyResponse>('/otp/verify', { email, otp });
    return response.data;
}

// Request password reset OTP
export async function requestPasswordReset(email: string): Promise<OTPResponse> {
    const response = await api.post<OTPResponse>('/otp/password-reset/request', { email });
    return response.data;
}

// Confirm password reset with OTP and new password
export async function confirmPasswordReset(email: string, otp: string, newPassword: string): Promise<OTPResponse> {
    const response = await api.post<OTPResponse>('/otp/password-reset/confirm', {
        email,
        otp,
        new_password: newPassword,
    });
    return response.data;
}

// Enable 2FA (requires authentication)
export async function enable2FA(): Promise<OTPResponse> {
    const response = await api.post<OTPResponse>('/otp/2fa/enable');
    return response.data;
}

// Confirm 2FA enable with OTP
export async function confirm2FAEnable(email: string, otp: string): Promise<OTPResponse> {
    const response = await api.post<OTPResponse>('/otp/2fa/confirm', { email, otp });
    return response.data;
}

// Disable 2FA with OTP verification
export async function disable2FA(email: string, otp: string): Promise<OTPResponse> {
    const response = await api.post<OTPResponse>('/otp/2fa/disable', { email, otp });
    return response.data;
}
