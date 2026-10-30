export default function LogoutButton() {
  return (
    <form action="/auth/signout" method="post" className="mt-8">
      <button type="submit" className="rounded border border-navy px-4 py-2 font-semibold text-navy">Log out</button>
    </form>
  )
}
