export default function WhoItsFor() {
  const roles = [
    {
      title: 'SDRs & BDRs',
      description: 'Learn prospecting strategies and build confidence with experienced reps',
      icon: '🎯'
    },
    {
      title: 'Account Executives',
      description: 'Share closing techniques and discuss complex deal scenarios',
      icon: '🤝'
    },
    {
      title: 'Customer Success',
      description: 'Exchange retention strategies and onboarding best practices',
      icon: '🌟'
    },
    {
      title: 'Sales Managers',
      description: 'Connect with fellow leaders on team management and coaching',
      icon: '👥'
    },
    {
      title: 'Sales Directors',
      description: 'Discuss strategic initiatives and scaling successful teams',
      icon: '📈'
    },
    {
      title: 'Sales Enablement',
      description: 'Share training methods and productivity optimization tips',
      icon: '🔧'
    }
  ]

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Who It's For
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Coffee Closer Network brings together sales professionals at every level. 
            No matter where you are in your journey, there's someone to learn from and teach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <div key={index} className="card-hover">
              <div className="text-3xl mb-4">{role.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                {role.title}
              </h3>
              <p className="text-neutral-600">
                {role.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-neutral-600 mb-6">
            Working in a different sales role? We welcome all sales professionals!
          </p>
          <a href="/sign-up" className="btn btn-primary">
            Join Your Community
          </a>
        </div>
      </div>
    </section>
  )
}