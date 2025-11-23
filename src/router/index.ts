import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
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
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
    {
      path: '/my-activity',
      name: 'MyActivity',
      component: () => import('../views/Pages/MyActivityLogs.vue'),
      meta: {
        title: 'My Activity',
      },
    },
    {
      path: '/admin/activity-logs',
      name: 'AdminActivityLogs',
      component: () => import('../views/Admin/AdminActivityLogs.vue'),
      meta: {
        title: 'System Activity Logs',
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
