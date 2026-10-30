import AuthForm from '@/components/AuthForm'
import { h1, wrap } from '@/lib/ui'

export default function Page() {
  return (
    <div className={wrap}>
      <h1 className={h1}>Create your account</h1>
      <p className="mt-4 leading-relaxed">Start here. Your account stays in application mode until you have been through our joining process.</p>
      <AuthForm mode="signup" />
    </div>
  )
}
