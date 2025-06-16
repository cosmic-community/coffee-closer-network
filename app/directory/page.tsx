import { getUserProfiles } from '@/lib/cosmic'
import UserProfileCard from '@/components/UserProfileCard'
import DirectoryFilters from '@/components/DirectoryFilters'

export const metadata = {
  title: 'Member Directory - Coffee Closer Network',
  description: 'Browse and connect with sales professionals in our community',
}

export default async function DirectoryPage() {
  const userProfiles = await getUserProfiles()

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Member Directory
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Connect with sales professionals from around the world. 
            Find someone who shares your interests and schedule a coffee chat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <DirectoryFilters />
          </div>

          {/* Members Grid */}
          <div className="lg:col-span-3">
            {userProfiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-neutral-400 text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No members found
                </h3>
                <p className="text-neutral-600">
                  Be the first to join our growing community of sales professionals.
                </p>
                <a href="/sign-up" className="btn btn-primary mt-4">
                  Join the Network
                </a>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-neutral-600">
                    Showing {userProfiles.length} members
                  </p>
                  <select className="px-4 py-2 border border-neutral-300 rounded-lg text-sm">
                    <option>Sort by: Newest</option>
                    <option>Sort by: Name</option>
                    <option>Sort by: Role</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {userProfiles.map((profile) => (
                    <UserProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}