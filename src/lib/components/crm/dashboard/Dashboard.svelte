<script>

import DashboardHeader from './DashboardHeader.svelte';
import DashboardStats from './DashboardStats.svelte';
import SalesPipeline from './SalesPipeline.svelte';
import ActivityList from './ActivityList.svelte';
import QuickActions from './QuickActions.svelte';
import DashboardAlerts from './DashboardAlerts.svelte';
import DashboardDecision from './DashboardDecision.svelte';
import { dashboardStore } from '$lib/stores/dashboard.svelte.js';
import CommercialSummary from './CommercialSummary.svelte';
import TimelineComercial from './TimelineComercial.svelte';

</script>



<DashboardHeader />

<DashboardDecision/>

<CommercialSummary />

<TimelineComercial />

<DashboardStats />

<DashboardAlerts />

<SalesPipeline />

<ActivityList />

<QuickActions />