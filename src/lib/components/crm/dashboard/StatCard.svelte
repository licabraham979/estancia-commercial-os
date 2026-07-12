<script>
    let { 
        title,
        value,
        description
    } = $props();
</script>


<div class="card">

    <div class="title">
        {title}
    </div>

    <div class="value">
        {value}
    </div>

    <div class="description">
        {description}
    </div>

</div>


<style>

.card {
    background: var(--surface);

    border: 1px solid var(--border);

    border-radius: var(--radius);

    padding: var(--space-6);

    box-shadow: var(--shadow-sm);

}


.title {
    color: var(--text-secondary);

    font-size: 14px;
}


.value {

    margin-top: var(--space-2);

    font-size: 32px;

    font-weight: 700;

    color: var(--text);

}


.description {

    margin-top: var(--space-2);

    font-size: 14px;

    color: var(--text-secondary);

}

</style>