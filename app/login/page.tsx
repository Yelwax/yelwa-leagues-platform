import AuthForm from '@/components/AuthForm'
import { h1, wrap } from '@/lib/ui'

export default function Page() {
  return (
    <div className={wrap}>
      <h1 className={h1}>Log in</h1>
      <p className="mt-4 leading-relaxed">Welcome back.</p>
      <AuthForm mode="login" />
    </div>
  )
}
