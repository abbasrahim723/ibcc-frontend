<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width="250"
          height="40"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width="250"
          height="40"
        />
        <img
          v-else
          src="/images/logo/logo-icon.svg"
          alt="Logo"
          width="100"
          height="100"
        />
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in filteredMenuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                          <span class="flex items-center gap-1 ml-auto">
                            <span
                              v-if="subItem.new"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              new
                            </span>
                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  UserGroupIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
  HomeIcon,
  SettingsIcon,
} from "../../icons";
import BoxCubeIcon from "@/icons/BoxCubeIcon.vue";
import { useSidebar } from "@/composables/useSidebar";
import { usePermissions, loadPermissions } from '@/composables/usePermissions';

const route = useRoute();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

const menuGroups = [
  {
    title: "Menu",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
        subItems: [
          { name: "Ecommerce", path: "/", pro: false },
          { name: "CRM", path: "/crm", pro: false },
          { name: "Calendar", path: "/calendar", pro: false }
        ],
      },
      {
        icon: UserGroupIcon,
        name: "Customers",
        path: "/customers",
      },
      {
        icon: DocsIcon,
        name: "Documents",
        path: "/documents",
      },
      {
        icon: HomeIcon,
        name: "Projects",
        path: "/projects",
      },
      {
        icon: DocsIcon,
        name: "Payments",
        path: "/payments",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        icon: UserGroupIcon,
        name: "Users",
        path: "/users",
      },
      {
        icon: UserCircleIcon,
        name: "Roles & Permissions",
        path: "/admin/roles",
      },
      {
        icon: ListIcon,
        name: "Activity Logs",
        path: "/admin/activity-logs",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        icon: BoxCubeIcon,
        name: "Locations",
        subItems: [
          { name: "Countries", path: "/admin/locations/countries", pro: false },
          { name: "States", path: "/admin/locations/states", pro: false },
          { name: "Cities", path: "/admin/locations/cities", pro: false },
          { name: "Towns", path: "/admin/locations/towns", pro: false },
          { name: "Phases", path: "/admin/locations/phases", pro: false },
        ],
      },
      {
        icon: ListIcon,
        name: "Prefixes",
        path: "/admin/locations/prefixes",
      },
      {
        icon: DocsIcon,
        name: "Templates",
        subItems: [
          { name: "Placeholders", path: "/admin/templates/placeholders", pro: false },
          { name: "Signatures", path: "/admin/templates/signatures", pro: false },
          { name: "Templates", path: "/admin/templates/templates", pro: false },
        ],
      },
      {
        icon: DocsIcon,
        name: "Contract Types",
        path: "/contract-types",
      },
    ],
  },
];

const isActive = (path) => route.path === path;

// Permission-aware filtering
const { can, roles } = usePermissions();

onMounted(() => {
  // Load permissions once when sidebar mounts
  loadPermissions();
});

const isSuperAdmin = computed(() => {
  return roles.value && (roles.value.includes('super-admin') || roles.value.includes('Super Admin'));
});

const resourceMapByName = {
  'Dashboard': 'dashboard',
  'Ecommerce': 'dashboard',
  'CRM': 'dashboard',
  'Calendar': 'calendar',
  'Customers': 'customers',
  'Documents': 'documents',
  'Projects': 'projects',
  'Payments': 'payments',
  'Users': 'users',
  'Roles & Permissions': 'roles',
  'Activity Logs': 'activity_logs',
  'Locations': 'locations',
  'Prefixes': 'locations',
  'Contract Types': 'projects',
  'Templates': 'documents', // Using documents permission for now
  'Placeholders': 'documents',
  'Signatures': 'documents',
};

function resourceForItem(item) {
  if (item.path) {
    const parts = item.path.split('/').filter(Boolean);
    // try to find a known resource in path
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (['dashboard','crm','calendar','customers','documents','projects','payments','users','roles','activity-logs','locations','countries','states','cities','towns','phases','prefixes','placeholders','signatures','templates'].includes(part)) {
        if (part === 'activity-logs') return 'activity_logs';
        if (part === 'crm') return 'dashboard';
        if (['prefixes'].includes(part)) return 'locations';
        if (['placeholders','signatures','templates'].includes(part)) return 'documents';
        return part;
      }
    }
  }
  return resourceMapByName[item.name] || null;
}

const filteredMenuGroups = computed(() => {
  // If super admin, show all menu items without filtering
  if (isSuperAdmin.value) {
    return menuGroups;
  }

  return menuGroups.map(group => {
    const items = group.items.filter(item => {
      // If no path and no subItems, show by default
      if (!item.path && !item.subItems) return true;

      // If subItems, keep group item if any subItem allowed
      if (item.subItems) {
        const any = item.subItems.some(sub => {
          const res = resourceForItem(sub) || resourceForItem(item);
          if (!res) return true; // default allow if unknown
          return can(res, 'view');
        });
        return any;
      }

      const res = resourceForItem(item);
      if (!res) return true; // default allow
      return can(res, 'view');
    });

    return {
      ...group,
      items,
    };
  }).filter(g => g.items.length > 0);
});

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path)
      ))
  );
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>
