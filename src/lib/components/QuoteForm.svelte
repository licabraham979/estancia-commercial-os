<script lang="ts">

let {
	fields = [],
	button = "Solicitar Cotización",
	onSubmit = null,
	onChange = null,
	className = ''
} = $props();

let valores = $state<Record<string, string>>({});


function actualizarCampo(label: string, value: string){

	valores[label] = value;


	if(onChange){

		onChange(valores);

	}

}


function enviar(){

	if(onSubmit){

		onSubmit(valores);

	}

}

</script>
<div class={`space-y-5 w-full relative ${className}`}>

    {#each fields as field}

        <div
            class="
            bg-white
            rounded-3xl
            p-5
            border
            border-slate-200
            shadow-sm
            transition-all
            duration-300
            hover:shadow-lg
            "
        >

            <label
                class="
                block
                text-xs
                font-bold
                uppercase
                tracking-widest
                text-cyan-600
                mb-3
                "
            >

                {field.label}

            </label>

            {#if field.type === "select"}

                <select

	bind:value={valores[field.label]}

	onchange={(e)=>actualizarCampo(
		field.label,
		e.currentTarget.value
	)}
                    class="
                    w-full
                    h-14
                    rounded-2xl
                    bg-slate-50
                    border
                    border-slate-200
                    px-5
                    text-slate-700
                    shadow-sm
                    transition
                    duration-300
                    outline-none
                    focus:border-cyan-500
                    focus:ring-4
                    focus:ring-cyan-200
                    "

                >

                    {#each field.options as option}

                        <option value={option}>

                            {option}

                        </option>

                    {/each}

                </select>

            {:else}

                <input

                    type={field.type}

                    placeholder={field.placeholder}

                    bind:value={valores[field.label]}

                    oninput={(e)=>actualizarCampo(
        field.label,
        e.currentTarget.value
    )}

                    class="
                    w-full
                    h-14
                    rounded-2xl
                    bg-slate-50
                    border
                    border-slate-200
                    px-5
                    placeholder:text-slate-400
                    text-slate-700
                    shadow-sm
                    transition
                    duration-300
                    outline-none
                    focus:border-cyan-500
                    focus:ring-4
                    focus:ring-cyan-200
                    "

                />

            {/if}

        </div>

    {/each}
<button
	class="
	bg-cyan-600
	text-white
	rounded-2xl
	px-6
	py-4
	font-bold
	w-full
	"
	onclick={enviar}
>
	{button}
</button>
</div>