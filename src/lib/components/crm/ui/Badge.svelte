<script>

let {

texto,

tipo="default"

}= $props();

</script>


<span class={tipo}>

{texto}

</span>


<style>

span{

padding:5px 10px;

border-radius:20px;

font-size:12px;

font-weight:600;

}


.default{

background:#eee;

}


</style>