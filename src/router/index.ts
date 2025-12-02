import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: { title: 'Sign In' },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: { title: 'Sign Up' },
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Dashboard/DashboardView.vue'),
      meta: {
        title: 'Dashboard',
      },
    },
    {
      path: '/admin/users',
      name: 'Users',
      component: () => import('../views/Admin/UsersView.vue'),
      meta: {
        title: 'User Management',
      },
    },
    {
      path: '/admin/roles',
      name: 'Roles',
      component: () => import('../views/Admin/RolesView.vue'),
      meta: {
        title: 'Role Management',
      },
    },
    {
      path: '/admin/activity-logs',
      name: 'ActivityLogs',
      component: () => import('../views/Admin/ActivityLogsView.vue'),
      meta: {
        title: 'Activity Logs',
        requiresAuth: true
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/Pages/Settings.vue'),
      meta: {
        title: 'Account Settings',
      },
    },
    {
      path: '/security',
      name: 'Security',
      component: () => import('../views/Pages/SecuritySettings.vue'),
      meta: {
        title: 'Security Settings',
      },
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('../views/Admin/UsersView.vue'),
      meta: {
        title: 'User Management',
      },
    },
    {
      path: '/users/create',
      name: 'CreateUser',
      component: () => import('../views/Admin/UserFormView.vue'),
      meta: {
        title: 'Create User',
      },
    },
    {
      path: '/users/:id/edit',
      name: 'EditUser',
      component: () => import('../views/Admin/UserFormView.vue'),
      meta: {
        title: 'Edit User',
      },
    },
    {
      path: '/customers',
      name: 'Customers',
      component: () => import('../views/Admin/CustomersView.vue'),
      meta: {
        title: 'Customer Management',
      },
    },
    {
      path: '/customers/create',
      name: 'CreateCustomer',
      component: () => import('../views/Admin/CustomerFormView.vue'),
      meta: {
        title: 'Create Customer',
      },
    },
    {
      path: '/customers/:id/edit',
      name: 'customer-edit',
      component: () => import('../views/Admin/CustomerFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/customers/:id',
      name: 'CustomerDetail',
      component: () => import('../views/Admin/CustomerDetailView.vue'),
      meta: {
        title: 'Customer Details',
        requiresAuth: true
      },
    },
    {
      path: '/documents',
      name: 'Documents',
      component: () => import('../views/Admin/DocumentsView.vue'),
      meta: {
        title: 'Document Management',
        requiresAuth: true
      },
    },
    // Location Management
    {
      path: '/admin/locations/countries',
      name: 'countries',
      component: () => import('../views/Admin/Locations/CountriesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/locations/states',
      name: 'states',
      component: () => import('../views/Admin/Locations/StatesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/locations/cities',
      name: 'cities',
      component: () => import('../views/Admin/Locations/CitiesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/locations/towns',
      name: 'towns',
      component: () => import('../views/Admin/Locations/TownsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Pages/ComingSoon.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('../views/Pages/ComingSoon.vue'),
      meta: { title: 'Reset Password' },
    },
    {
      path: '/projects',
      name: 'Projects',
      component: () => import('../views/Pages/ComingSoon.vue'),
      meta: {
        title: 'Projects',
      },
    },
    {
      path: '/payments',
      name: 'Payments',
      component: () => import('../views/Pages/ComingSoon.vue'),
      meta: {
        title: 'Payments',
      },
    },
    {
      path: '/admin/locations/prefixes',
      name: 'Prefixes',
      component: () => import('../views/Admin/Locations/PrefixesView.vue'),
      meta: {
        title: 'Prefixes Management',
      },
    },
    {
      path: '/admin/locations/towns/create',
      name: 'CreateTown',
      component: () => import('../views/Admin/Locations/TownFormView.vue'),
      meta: {
        title: 'Create Town',
      },
    },
    {
      path: '/admin/locations/towns/:id/edit',
      name: 'EditTown',
      component: () => import('../views/Admin/Locations/TownFormView.vue'),
      meta: {
        title: 'Edit Town',
      },
    },
    {
      path: '/admin/locations/phases',
      name: 'Phases',
      component: () => import('../views/Admin/Locations/PhasesView.vue'),
      meta: {
        title: 'Phases Management',
      },
    },
    {
      path: '/admin/locations/phases/create',
      name: 'CreatePhase',
      component: () => import('../views/Admin/Locations/PhaseFormView.vue'),
      meta: {
        title: 'Create Phase',
      },
    },
    {
      path: '/admin/locations/phases/:id/edit',
      name: 'EditPhase',
      component: () => import('../views/Admin/Locations/PhaseFormView.vue'),
      meta: {
        title: 'Edit Phase',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`

  const token = localStorage.getItem('token')
  const publicPages = ['/signin', '/signup']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !token) {
    return next('/signin')
  }

  if (token && publicPages.includes(to.path)) {
    return next('/')
  }

  next()
})
