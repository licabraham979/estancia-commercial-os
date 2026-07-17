<script>

let {

valor=0

}= $props();

</script>


<div class="container">

<div 
class="bar"
style={`width:${valor}%`}
>

</div>

</div>


<style>

.container{

height:10px;

background:#eee;

border-radius:10px;

overflow:hidden;

}


.bar{

height:100%;

border-radius:10px;

background:#333;

}


</style>