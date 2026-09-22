import { SaaSProvider } from '@/lib/saas-context'
import SplendoApp from '@/components/splendo-app'

export default function HotelTenantPage() {
  return (
    <SaaSProvider>
      <SplendoApp />
    </SaaSProvider>
  )
}
