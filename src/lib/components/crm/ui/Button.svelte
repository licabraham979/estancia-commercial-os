<script>
    let { children, className = "" } = $props();
</script>


<div class={`card ${className}`}>
    {@render children()}
</div>


<style>
.card{
    background:white;
    border-radius:16px;
    padding:20px;
    box-shadow:
    0 2px 8px rgba(0,0,0,.06);
    border:1px solid #eee;
}
</style>