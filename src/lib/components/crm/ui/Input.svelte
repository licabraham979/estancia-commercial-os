<script>

let {

value,

placeholder=''

}= $props();

</script>


<input

bind:value

{placeholder}

/>


<style>

input{

width:100%;

border:1px solid #ddd;

border-radius:12px;

padding:12px 14px;

font-size:15px;

outline:none;

}


input:focus{

border-color:#999;

}


</style>