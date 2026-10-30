import AuthForm from '@/components/AuthForm'
import { h1, wrap } from '@/lib/ui'

export default function Page() {
  return (
    <div className={wrap}>
      <h1 className={h1}>Choose a new password</h1>
      <p className="mt-4 leading-relaxed">Pick a new password for your account.</p>
      <AuthForm mode="reset" />
    </div>
  )
}
