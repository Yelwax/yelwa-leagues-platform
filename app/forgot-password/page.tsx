import AuthForm from '@/components/AuthForm'
import { h1, wrap } from '@/lib/ui'

export default function Page() {
  return (
    <div className={wrap}>
      <h1 className={h1}>Forgot your password?</h1>
      <p className="mt-4 leading-relaxed">Enter your email and we will send you a link to reset it.</p>
      <AuthForm mode="forgot" />
    </div>
  )
}
