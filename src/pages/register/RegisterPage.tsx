import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@shared/layout';
import { axiosClient } from '@shared/lib';

// ✨ shadcn/ui 컴포넌트 임포트
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Checkbox } from '@shared/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/components/ui/select';
import { Separator } from '@shared/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@shared/components/ui/dialog';
import { ApiResult } from '@entities/common';
import { useAuthStore } from '@shared/store/AuthStore.ts';
import { Navigate } from 'react-router';
function usePreventBackLeave(condition) {
    useEffect(() => {
        if (!condition) return;

        // 현재 상태를 push해서 뒤로가기를 '감지' 가능하게
        window.history.pushState(null, '', window.location.href);

        const handlePopState = (e) => {
            const leave = window.confirm(
                '이메일 인증이 완료되지 않았어요. 정말 페이지를 나가시겠습니까?',
            );

            if (leave) {
                // 사용자가 진짜로 나간다고 함 → 이전 페이지로 이동 허용
                window.removeEventListener('popstate', handlePopState);
                window.history.back();
            } else {
                // 안 나간다고 하면 다시 push해서 뒤로가기 무효화
                window.history.pushState(null, '', window.location.href);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [condition]);
}
const RegisterPage = () => {
    const [form, setForm] = useState({
        email: '',
        domain: '',
        code: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        agreeAll: false,
        agreePrivacy: false,
        agreeAge: false,
        agreeMarketing: false,
    });
    const [emailCheck, setEmailCheck] = useState({ checked: false, message: '' });
    const [emailVerified, setEmailVerified] = useState(false);
    const [otpCheck, setOtpCheck] = useState({ checked: false, message: '' });
    const [nicknameCheck, setNicknameCheck] = useState({ checked: false, message: '' });
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0); // 인증 재전송 타이머(초)
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [pendingLeave, setPendingLeave] = useState<'reload' | 'back' | null>(null);
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const navigate = useNavigate();
    const { userAuth } = useAuthStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));

        if (name === 'email') {
            setEmailCheck({ checked: false, message: '' });
            setEmailVerified(false);
            setOtpCheck({ checked: false, message: '' });
        }
        if (name === 'nickname') {
            setNicknameCheck({ checked: false, message: '' });
        }
        if (name === 'password') {
            // 4자리 이상만 통과, 기존 정규식은 주석처리
            if (value.length >= 4) {
                setPasswordValid(true);
                setPasswordMessage('사용 가능한 비밀번호입니다.');
            } else {
                setPasswordValid(false);
                setPasswordMessage('비밀번호는 4자리 이상이어야 합니다.');
            }
            // if (!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/.test(value)) {
            //     setPasswordValid(false);
            //     setPasswordMessage('비밀번호는 8~20자의 영문, 숫자, 특수문자 조합이어야 합니다.');
            // } else {
            //     setPasswordValid(true);
            //     setPasswordMessage('사용 가능한 비밀번호입니다.');
            // }
        }
    };

    const handleDomainChange = (value) => {
        setForm((prev) => ({ ...prev, domain: value }));
        setEmailCheck({ checked: false, message: '' });
        setEmailVerified(false);
        setOtpCheck({ checked: false, message: '' });
    };

    const handleCheckboxChange = (name, checked) => {
        if (name === 'agreeAll') {
            setForm((prev) => ({
                ...prev,
                agreeAll: checked,
                agreePrivacy: checked,
                agreeAge: checked,
                agreeMarketing: checked,
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: checked }));
        }
    };

    useEffect(() => {
        const { agreePrivacy, agreeAge, agreeMarketing } = form;
        const allRequiredChecked = agreePrivacy && agreeAge && agreeMarketing;
        if (form.agreeAll !== allRequiredChecked) {
            setForm((prev) => ({ ...prev, agreeAll: allRequiredChecked }));
        }
    }, [form.agreePrivacy, form.agreeAge, form.agreeMarketing]);

    // 타이머 useEffect
    useEffect(() => {
        if (timer > 0) {
            timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
        } else if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [timer]);

    // 새로고침/뒤로가기 감지
    useEffect(() => {
        const isAnyInputFilled = !!(
            form.email ||
            form.domain ||
            form.code ||
            form.password ||
            form.confirmPassword ||
            form.nickname
        );
        const handleBeforeUnload = (e) => {
            if (isAnyInputFilled && !emailVerified) {
                e.preventDefault();
                e.returnValue = '';
                setPendingLeave('reload');
                return '';
            }
        };
        const handlePopState = (e) => {
            if (isAnyInputFilled && !emailVerified) {
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [
        form.email,
        form.domain,
        form.code,
        form.password,
        form.confirmPassword,
        form.nickname,
        emailVerified,
    ]);
    usePreventBackLeave(emailCheck.checked && !emailVerified);

    // 인증번호 발송(재전송) 버튼 클릭
    const handleCheckEmail = async () => {
        if (!form.email || !form.domain) {
            setEmailCheck({ checked: false, message: '이메일을 모두 입력해주세요.' });
            return;
        }
        const fullEmail = `${form.email}@${form.domain}`;
        setLoading(true);
        try {
            const response = await axiosClient.post(`/auth/email/otp`, { email: fullEmail });
            if (response.data.isDuplicate) {
                setEmailCheck({ checked: false, message: '이미 사용 중인 이메일입니다.' });
            } else {
                setEmailCheck({ checked: true, message: '이메일로 인증번호를 발송했습니다.' });
                setTimer(60); // 1분 타이머 시작
            }
        } catch (error) {
            setEmailCheck({ checked: false, message: '오류가 발생했습니다. 다시 시도해주세요.' });
        } finally {
            setLoading(false);
        }
    };

    // 인증코드 입력 핸들러(숫자만, 6자리 자동 인증)
    const handleCodeInput = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 6) value = value.slice(0, 6);
        setForm((prev) => ({ ...prev, code: value }));
        if (value.length === 6) {
            handleVerifyOtp(value);
        }
    };

    // 인증코드 검증(수정: value 파라미터로 받음)
    const handleVerifyOtp = async (codeValue = form.code) => {
        if (!codeValue) {
            setOtpCheck({ checked: false, message: '인증번호를 입력해주세요.' });
            return;
        }
        setLoading(true);
        try {
            const response = await axiosClient.post<ApiResult<boolean>>('/auth/email/otp/verify', {
                email: `${form.email}@${form.domain}`,
                otp: codeValue,
            });
            if (response.data.data) {
                setOtpCheck({ checked: true, message: '이메일 인증이 완료되었습니다.' });
                setEmailVerified(true);
            } else {
                setOtpCheck({ checked: false, message: '인증번호가 올바르지 않습니다.' });
                setEmailVerified(false);
            }
        } catch (error) {
            setOtpCheck({ checked: false, message: '오류가 발생했습니다. 다시 시도해주세요.' });
            setEmailVerified(false);
        } finally {
            setLoading(false);
        }
    };

    // 팝업에서 "나가기" 선택 시
    const handleLeave = () => {
        setShowLeaveDialog(false);
        if (pendingLeave === 'reload') {
            window.removeEventListener('beforeunload', () => {});
            window.location.reload();
        } else if (pendingLeave === 'back') {
            window.removeEventListener('popstate', () => {});
            window.history.back();
        }
    };
    // 팝업에서 "취소" 선택 시
    const handleStay = () => {
        setShowLeaveDialog(false);
        setPendingLeave(null);
    };
    const handleCheckNickname = async () => {
        if (!form.nickname) {
            setNicknameCheck({ checked: false, message: '닉네임을 입력해주세요.' });
            return;
        }
        setLoading(true);
        try {
            const response = await axiosClient.get(
                `/auth/register/nickname/check?nickname=${form.nickname}`,
            );
            if (response.data.isDuplicate) {
                setNicknameCheck({ checked: false, message: '이미 사용 중인 닉네임입니다.' });
            } else {
                setNicknameCheck({ checked: true, message: '멋진 닉네임이네요!' });
            }
        } catch (error) {
            setNicknameCheck({
                checked: false,
                message: '오류가 발생했습니다. 다시 시도해주세요.',
            });
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailVerified) return alert('이메일 인증을 완료해주세요!');
        if (form.password !== form.confirmPassword) return alert('비밀번호가 일치하지 않습니다.');
        if (form.password.length < 4) {
            // if (!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/.test(form.password)) {
            //     return alert('비밀번호는 8~20자의 영문, 숫자, 특수문자 조합이어야 합니다.');
            // }
            return alert('비밀번호는 4자리 이상이어야 합니다.');
        }
        if (!nicknameCheck.checked) return alert('닉네임 중복 확인을 해주세요!');
        if (!form.agreePrivacy || !form.agreeAge) return alert('필수 이용약관에 동의해주세요.');

        setLoading(true);
        try {
            await axiosClient.post('/auth/register/email', {
                email: `${form.email}@${form.domain}`,
                password: form.password,
                nickname: form.nickname,
            });
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };
    if (userAuth) {
        return <Navigate to={'/'} />;
    }

    return (
        <MainLayout>
            {/* shadcn Dialog: 이탈 경고 */}
            <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>페이지를 나가시겠습니까?</DialogTitle>
                        <DialogDescription>
                            인증을 완료하지 않고 나가면 인증을 다시 진행해야 합니다. 정말
                            나가시겠습니까?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={handleStay}>
                            취소
                        </Button>
                        <Button variant='destructive' onClick={handleLeave}>
                            나가기
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className='max-w-xl mx-auto my-12 p-8'>
                <p className='text-center text-muted-foreground mb-2'>
                    회원가입에 필요한 정보를 정확히 입력해주세요.
                </p>
                <h2 className='text-3xl font-bold text-center mb-8'>회원가입</h2>

                <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                    {/* 이메일 섹션 */}
                    <div className='grid gap-3'>
                        <Label htmlFor='email'>이메일</Label>
                        <div className='flex items-center gap-2'>
                            <Input
                                id='email'
                                name='email'
                                placeholder='이메일'
                                value={form.email}
                                onChange={handleChange}
                                disabled={emailVerified}
                                className='focus-visible:ring-orange-500'
                            />
                            <span className='text-muted-foreground'>@</span>
                            <Select
                                name='domain'
                                value={form.domain}
                                onValueChange={handleDomainChange}
                                disabled={emailVerified}
                            >
                                <SelectTrigger className='w-48 focus:ring-orange-500'>
                                    <SelectValue placeholder='선택' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='naver.com'>naver.com</SelectItem>
                                    <SelectItem value='gmail.com'>gmail.com</SelectItem>
                                    <SelectItem value='hanmail.net'>hanmail.net</SelectItem>
                                </SelectContent>
                            </Select>
                            {!emailVerified && (
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleCheckEmail}
                                    disabled={loading || !form.email || !form.domain || timer > 0}
                                    className='w-24 border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600'
                                >
                                    {timer > 0
                                        ? `${timer}초 후 재전송`
                                        : emailCheck.checked
                                          ? '재전송'
                                          : '인증하기'}
                                </Button>
                            )}
                        </div>
                        {emailCheck.message && !emailVerified && (
                            <p
                                className={`text-sm ${emailCheck.checked ? 'text-green-600' : 'text-destructive'}`}
                            >
                                {emailCheck.message}
                            </p>
                        )}
                        {emailCheck.checked && !emailVerified && (
                            <div className='flex items-center gap-2'>
                                <Input
                                    name='code'
                                    placeholder='인증번호 6자리'
                                    value={form.code}
                                    onChange={handleCodeInput}
                                    className='focus-visible:ring-orange-500'
                                    inputMode='numeric'
                                    pattern='[0-9]*'
                                    maxLength={6}
                                    autoComplete='one-time-code'
                                />
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => handleVerifyOtp(form.code)}
                                    disabled={loading || form.code.length !== 6}
                                    className='border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600'
                                >
                                    확인
                                </Button>
                            </div>
                        )}
                        {otpCheck.message && (
                            <p
                                className={`text-sm ${otpCheck.checked ? 'text-green-600' : 'text-destructive'}`}
                            >
                                {otpCheck.message}
                            </p>
                        )}
                    </div>

                    <Separator />

                    {/* 비밀번호 섹션 */}
                    <div className='grid gap-3'>
                        <Label>비밀번호</Label>
                        <Input
                            type='password'
                            name='password'
                            placeholder='비밀번호'
                            value={form.password}
                            onChange={handleChange}
                            className='focus-visible:ring-orange-500'
                        />
                        {form.password && (
                            <span
                                className={`text-sm ${passwordValid ? 'text-green-600' : 'text-destructive'}`}
                            >
                                {passwordMessage}
                            </span>
                        )}
                        <Input
                            type='password'
                            name='confirmPassword'
                            placeholder='비밀번호 확인'
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className='focus-visible:ring-orange-500'
                        />
                        {/* <p className='text-sm text-orange-500'>
                            8~20자 / 영문, 숫자, 특수문자 조합
                        </p> */}
                    </div>

                    <Separator />

                    {/* 닉네임 섹션 */}
                    <div className='grid gap-3'>
                        <Label htmlFor='nickname'>닉네임</Label>
                        <div className='flex items-center gap-2'>
                            <Input
                                id='nickname'
                                name='nickname'
                                placeholder='닉네임'
                                value={form.nickname}
                                onChange={handleChange}
                                className='focus-visible:ring-orange-500'
                            />
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleCheckNickname}
                                disabled={loading}
                                className='border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600'
                            >
                                중복확인
                            </Button>
                        </div>
                        {nicknameCheck.message && (
                            <p
                                className={`text-sm ${nicknameCheck.checked ? 'text-green-600' : 'text-destructive'}`}
                            >
                                {nicknameCheck.message}
                            </p>
                        )}
                    </div>

                    <Separator />

                    {/* 이용약관 섹션 */}
                    <div className='grid gap-3'>
                        <Label>이용약관</Label>
                        <div className='border rounded-md p-4 flex flex-col gap-4'>
                            <div className='flex items-center space-x-2'>
                                <Checkbox
                                    id='agreeAll'
                                    checked={form.agreeAll}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange('agreeAll', checked)
                                    }
                                    className='accent-orange-500 data-[state=checked]:bg-orange-500'
                                />
                                <Label
                                    htmlFor='agreeAll'
                                    className='font-bold cursor-pointer text-base'
                                >
                                    이용약관 모두 동의
                                </Label>
                            </div>
                            <div className='pl-7 flex flex-col gap-4 text-muted-foreground'>
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        id='agreePrivacy'
                                        checked={form.agreePrivacy}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxChange('agreePrivacy', checked)
                                        }
                                        className='accent-orange-500 data-[state=checked]:bg-orange-500'
                                    />
                                    <Label htmlFor='agreePrivacy' className='cursor-pointer'>
                                        개인정보 수집 및 이용동의 (필수)
                                    </Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        id='agreeAge'
                                        checked={form.agreeAge}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxChange('agreeAge', checked)
                                        }
                                        className='accent-orange-500 data-[state=checked]:bg-orange-500'
                                    />
                                    <Label htmlFor='agreeAge' className='cursor-pointer'>
                                        연령(만 14세 이상) 확인 (필수)
                                    </Label>
                                </div>
                                <p className='text-xs text-orange-500 ml-7'>
                                    만 14세 미만 아동의 계정 생성은 보호자의 승인 필요
                                </p>
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        id='agreeMarketing'
                                        checked={form.agreeMarketing}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxChange('agreeMarketing', checked)
                                        }
                                        className='accent-orange-500 data-[state=checked]:bg-orange-500'
                                    />
                                    <Label htmlFor='agreeMarketing' className='cursor-pointer'>
                                        서비스 홍보 및 마케팅 목적의 개인정보 수집 및 이용동의
                                        (선택)
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        type='submit'
                        size='lg'
                        className='w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white'
                        disabled={loading}
                    >
                        가입하기
                    </Button>
                </form>
            </div>
        </MainLayout>
    );
};

export default RegisterPage;
