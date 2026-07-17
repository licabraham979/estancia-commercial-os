<script>

import Card from '$lib/components/crm/ui/Card.svelte';
import SectionTitle from '$lib/components/crm/ui/SectionTitle.svelte';
import ProgressBar from '$lib/components/crm/ui/ProgressBar.svelte';

import StatsCards from './StatsCards.svelte';
import QuickAdd from './QuickAdd.svelte';
import ActivityList from './ActivityList.svelte';
import QuickActions from './QuickActions.svelte';

</script>


<div class="container">


    <SectionTitle 
        icono="⚡"
        titulo="Ejecución"
    />


    <Card>

        <h3>
            Progreso del día
        </h3>

        <p>
            3 de 10 actividades completadas
        </p>


        <ProgressBar valor={30}/>

    </Card>



    <QuickAdd />

<QuickActions />

<StatsCards />

<ActivityList />

</div>



<style>

.container{

max-width:900px;

margin:auto;

padding:20px;

display:flex;

flex-direction:column;

gap:20px;

}


</style>